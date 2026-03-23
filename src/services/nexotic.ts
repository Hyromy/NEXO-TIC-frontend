import { api } from "./api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/";

const param = (id: number) => (Number.isInteger(id) && id > 0 ? `${id}/` : "");

export const userService = {
  endpoint: API_URL + "users/",

  get: (id: number = 0) => api.get(userService.endpoint + param(id)),

  create: (data: { username: string; password: string }) =>
    api.post(userService.endpoint, data),
};

export const authService = {
  endpoint: API_URL + "auth/",

  login: (username: string, password: string) =>
    api.post(
      authService.endpoint + "login/",
      {
        username,
        password,
      },
      true,
    ),

  refresh: (refreshToken?: string) => {
    if (!refreshToken) return null;
    return api.post(authService.endpoint + "refresh/", {
      refresh: refreshToken,
    });
  },

  signup: (username: string, email: string) =>
    api.post(authService.endpoint + "signup/", {
      username,
      email,
    }),

  recover: (username: string, email: string) =>
    api.post(authService.endpoint + "recover/", {
      username,
      email,
    }),

  logout: (refresh: string) =>
    api.post(authService.endpoint + "logout/", {
      refresh,
    }),

  changePassword: (new_password: string) =>
    api.post(authService.endpoint + "reset-password/", {
      new_password,
    }),
};

export const employeeService = {
  endpoint: API_URL + "employees/",
  get: (id: number) => api.get(employeeService.endpoint + param(id)),
  getByUser: (userId: number) =>
    api.get(`${employeeService.endpoint}?user=${userId}`),
  update: (id: number, data: any) =>
    api.patch(employeeService.endpoint + param(id), data),
};
export const vacationService = {
  endpoint: API_URL + "vacation-periods/",
  get: (id: number = 0) => api.get(vacationService.endpoint + param(id)),
};
export const vacationRequestService = {
  endpoint: API_URL + "vacation-requests/",
  get: (id: number = 0) => api.get(vacationRequestService.endpoint + param(id)),
  create: (data: any) => api.post(vacationRequestService.endpoint, data),
};
export const vacationDetailService = {
  endpoint: API_URL + "vacation-details/",
  get: (id: number = 0) => api.get(vacationDetailService.endpoint + param(id)),
  create: (data: any) => api.post(vacationDetailService.endpoint, data),
};
export const vacationPeriodService = {
  endpoint: API_URL + "vacation-periods/",
  getByEmployee: (employeeId: number) =>
    api.get(`${vacationPeriodService.endpoint}?employee=${employeeId}`),
};
