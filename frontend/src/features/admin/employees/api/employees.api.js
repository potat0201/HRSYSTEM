import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "../../../../services/httpClient.js";

export const employeesApi = {
  list(params = {}) {
    return httpClient.get("/admin/employees", { params });
  },
  get(employeeId) {
    return httpClient.get(`/admin/employees/${employeeId}`);
  },
  create(payload) {
    return httpClient.post("/admin/employees", payload);
  },
  update(employeeId, payload) {
    return httpClient.put(`/admin/employees/${employeeId}`, payload);
  },
  deactivate(employeeId) {
    return httpClient.delete(`/admin/employees/${employeeId}`);
  },
  grantAdmin(employeeId) {
    return httpClient.patch(`/admin/employees/${employeeId}/grant-admin`);
  },
  revokeAdmin(employeeId) {
    return httpClient.patch(`/admin/employees/${employeeId}/revoke-admin`);
  },
};

export function useEmployees(filters = {}) {
  return useQuery({
    queryKey: ["employees", filters],
    queryFn: () => employeesApi.list(filters),
    select: (response) => response.data || [],
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: employeesApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["employees"] }),
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ employeeId, payload }) => employeesApi.update(employeeId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["employees"] }),
  });
}

export function useDeactivateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: employeesApi.deactivate,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["employees"] }),
  });
}

export function useGrantAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: employeesApi.grantAdmin,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["employees"] }),
  });
}

export function useRevokeAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: employeesApi.revokeAdmin,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["employees"] }),
  });
}
