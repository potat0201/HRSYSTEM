import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import { useSnackbar } from "notistack";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "../../../../components/common/ConfirmDialog.jsx";
import { EmptyState } from "../../../../components/common/EmptyState.jsx";
import { ErrorState } from "../../../../components/common/ErrorState.jsx";
import { LoadingState } from "../../../../components/common/LoadingState.jsx";
import { PageHeader } from "../../../../components/common/PageHeader.jsx";
import { getErrorMessage } from "../../../../services/httpClient.js";
import {
  useCreateEmployee,
  useDeactivateEmployee,
  useEmployees,
  useGrantAdmin,
  useRevokeAdmin,
  useUpdateEmployee,
} from "../api/employees.api.js";
import { EmployeeDetailDialog } from "../components/EmployeeDetailDialog.jsx";
import { EmployeeFilter } from "../components/EmployeeFilter.jsx";
import { EmployeeFormDialog } from "../components/EmployeeFormDialog.jsx";
import { EmployeeTable } from "../components/EmployeeTable.jsx";
import { toEmployeeCreatePayload, toEmployeeUpdatePayload } from "../employee.mapper.js";

export function AdminEmployeesPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [filters, setFilters] = useState({ fullName: "", status: "" });
  const [formEmployee, setFormEmployee] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [detailEmployee, setDetailEmployee] = useState(null);
  const [confirmEmployee, setConfirmEmployee] = useState(null);

  const queryFilters = useMemo(
    () => ({
      ...(filters.fullName ? { fullName: filters.fullName } : {}),
      ...(filters.status ? { status: filters.status } : {}),
    }),
    [filters],
  );

  const employeesQuery = useEmployees(queryFilters);
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const deactivateEmployee = useDeactivateEmployee();
  const grantAdmin = useGrantAdmin();
  const revokeAdmin = useRevokeAdmin();

  const saving = createEmployee.isPending || updateEmployee.isPending || grantAdmin.isPending || revokeAdmin.isPending;

  function openCreate() {
    setFormEmployee(null);
    setFormOpen(true);
  }

  async function handleSubmit(values) {
    try {
      if (formEmployee) {
        await updateEmployee.mutateAsync({
          employeeId: formEmployee.id,
          payload: toEmployeeUpdatePayload(values),
        });

        if (values.role !== formEmployee.role) {
          if (values.role === "ADMIN") {
            await grantAdmin.mutateAsync(formEmployee.id);
          } else {
            await revokeAdmin.mutateAsync(formEmployee.id);
          }
        }

        enqueueSnackbar("Employee updated", { variant: "success" });
      } else {
        const response = await createEmployee.mutateAsync(toEmployeeCreatePayload(values));
        const createdEmployee = response.data;
        if (values.role === "ADMIN" && createdEmployee?.id) {
          await grantAdmin.mutateAsync(createdEmployee.id);
        }
        enqueueSnackbar("Employee created", { variant: "success" });
      }

      setFormOpen(false);
      setFormEmployee(null);
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error, "Unable to save employee"), { variant: "error" });
    }
  }

  async function handleDeactivate() {
    try {
      await deactivateEmployee.mutateAsync(confirmEmployee.id);
      enqueueSnackbar("Employee deactivated", { variant: "success" });
      setConfirmEmployee(null);
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error, "Unable to deactivate employee"), { variant: "error" });
    }
  }

  async function handleGrantAdmin(employee) {
    try {
      await grantAdmin.mutateAsync(employee.id);
      enqueueSnackbar("Admin role granted", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error, "Unable to grant admin role"), { variant: "error" });
    }
  }

  async function handleRevokeAdmin(employee) {
    try {
      await revokeAdmin.mutateAsync(employee.id);
      enqueueSnackbar("Admin role revoked", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error, "Unable to revoke admin role"), { variant: "error" });
    }
  }

  return (
    <>
      <PageHeader
        title="Employees"
        description="Manage employee accounts, status and admin role."
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
            Add employee
          </Button>
        }
      />

      <EmployeeFilter filters={filters} onChange={setFilters} />

      {employeesQuery.isLoading ? <LoadingState message="Loading employees..." /> : null}
      {employeesQuery.isError ? (
        <ErrorState message={getErrorMessage(employeesQuery.error)} onRetry={employeesQuery.refetch} />
      ) : null}
      {employeesQuery.isSuccess && employeesQuery.data.length === 0 ? (
        <EmptyState title="No employees" description="Create an employee to start using the system." />
      ) : null}
      {employeesQuery.isSuccess && employeesQuery.data.length > 0 ? (
        <EmployeeTable
          employees={employeesQuery.data}
          onView={setDetailEmployee}
          onEdit={(employee) => {
            setFormEmployee(employee);
            setFormOpen(true);
          }}
          onDeactivate={setConfirmEmployee}
          onGrantAdmin={handleGrantAdmin}
          onRevokeAdmin={handleRevokeAdmin}
        />
      ) : null}

      <EmployeeFormDialog
        open={formOpen}
        employee={formEmployee}
        loading={saving}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />
      <EmployeeDetailDialog employee={detailEmployee} onClose={() => setDetailEmployee(null)} />
      <ConfirmDialog
        open={Boolean(confirmEmployee)}
        title="Deactivate employee"
        description={`Deactivate ${confirmEmployee?.fullName || "this employee"}?`}
        confirmText="Deactivate"
        loading={deactivateEmployee.isPending}
        onClose={() => setConfirmEmployee(null)}
        onConfirm={handleDeactivate}
      />
    </>
  );
}
