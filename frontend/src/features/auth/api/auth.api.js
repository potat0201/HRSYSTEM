import { httpClient } from "../../../services/httpClient.js";

export const authApi = {
  login(payload) {
    return httpClient.post("/auth/login", payload);
  },
  logout(userId) {
    return httpClient.post("/auth/logout", null, {
      params: { userId },
    });
  },
};
