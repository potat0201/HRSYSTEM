import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "../../../../services/httpClient.js";

export const attendanceApi = {
  checkIn(payload) {
    return httpClient.post("/attendance/check-in", payload);
  },
  checkOut(payload) {
    return httpClient.post("/attendance/check-out", payload);
  },
  myHistory(userId) {
    return httpClient.get("/attendance/history", { params: { userId } });
  },
  adminHistory(params = {}) {
    return httpClient.get("/attendance/admin", { params });
  },
  userHistory(userId, params = {}) {
    return httpClient.get(`/attendance/admin/users/${userId}`, { params });
  },
  createManual(payload) {
    return httpClient.post("/attendance/admin", payload);
  },
  updateManual(attendanceId, payload) {
    return httpClient.put(`/attendance/admin/${attendanceId}`, payload);
  },
  deleteManual(attendanceId) {
    return httpClient.delete(`/attendance/admin/${attendanceId}`);
  },
};

export function useAdminAttendance(filters = {}) {
  return useQuery({
    queryKey: ["attendance", "admin", filters],
    queryFn: () => attendanceApi.adminHistory(filters),
    select: (response) => response.data || [],
  });
}

export function useMyAttendanceHistory(userId) {
  return useQuery({
    queryKey: ["attendance", "mine", userId],
    queryFn: () => attendanceApi.myHistory(userId),
    enabled: Boolean(userId),
    select: (response) => response.data || [],
  });
}

export function useCreateManualAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attendanceApi.createManual,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attendance"] }),
  });
}

export function useUpdateManualAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ attendanceId, payload }) => attendanceApi.updateManual(attendanceId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attendance"] }),
  });
}

export function useDeleteManualAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attendanceApi.deleteManual,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attendance"] }),
  });
}

export function useCheckIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attendanceApi.checkIn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attendance"] }),
  });
}

export function useCheckOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attendanceApi.checkOut,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attendance"] }),
  });
}
