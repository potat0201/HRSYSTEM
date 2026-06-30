export function toEmployeeCreatePayload(values) {
  return {
    username: values.username?.trim(),
    password: values.password,
    fullName: values.fullName?.trim(),
    email: values.email?.trim(),
    phone: values.phone?.trim() || null,
    department: values.department?.trim() || null,
  };
}

export function toEmployeeUpdatePayload(values) {
  return {
    fullName: values.fullName?.trim(),
    email: values.email?.trim(),
    phone: values.phone?.trim() || null,
    department: values.department?.trim() || null,
    status: values.status,
  };
}
