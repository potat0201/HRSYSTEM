export function toAttendancePayload(values) {
  return {
    userId: Number(values.userId),
    attendanceDate: values.attendanceDate,
    checkInTime: values.checkInTime || null,
    checkOutTime: values.checkOutTime || null,
    status: values.status,
  };
}
