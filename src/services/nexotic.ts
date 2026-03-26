import { api } from "./api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/";

/**
 * Generates a URL parameter string for a request ID if it is a valid positive integer.
 * 
 * @example
 * console.log(param(5)) // Output: "5/"
 * console.log(param(-3)) // Output: ""
 * console.log(param(0)) // Output: ""
 * console.log(param(2.5)) // Output: ""
 * 
 * @param id - The request ID.
 * @returns The URL parameter string or an empty string if the ID is invalid.
 */
const param = (id: number) => (
  Number.isInteger(id) && id > 0
    ? `${id}/`
    : ""
)

type id = number

export type user = {
  id: id,
  last_login: string,
  is_superuser: boolean,
  username: string,
  first_name: string,
  last_name: string,
  email: string,
  is_staff: boolean,
  is_active: boolean,
  date_joined: string,
  groups: any[],
  user_permissions: any[],
}

/**
 * Service for managing user-related API calls.
 * 
 * The userService object provides methods for interacting with the user-related endpoints of the API. It includes methods for retrieving user information and creating new users.
 */
export const userService = {
  endpoint: API_URL + "users/",

  get: (id: number = 0): Promise<user | user[]> => (
    api.get(userService.endpoint + param(id))
  ),

  create: (data: { username: string, password: string }) => (
    api.post(userService.endpoint, data)
  ),
}

/**
 * Service for managing authentication-related API calls.
 * 
 * The authService object provides methods for interacting with the authentication endpoints of the API. It includes methods for logging in, refreshing tokens, signing up, recovering accounts, logging out, and changing passwords.
 */
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

export type employee = {
  id: id,
  join_date: string,
  phone: string,
  enabled: boolean,
  user: id,
  job_position: id,
}
export type completeEmployee = Omit<employee, "user" | "job_position"> & {
  user: user,
  job_position: completeJobPosition,
}
export const employeeService = {
  endpoint: API_URL + "employees/",

  get: (id: number = 0): Promise<employee | employee[]> => (
    api.get(employeeService.endpoint + param(id))
  ),

  create: (
    name: string,
    last_name: string,
    department: number,
    email: string,
    phone: string,
    job_position: number
  ) => (
    api.post(employeeService.endpoint, {
      join_date: new Date().toISOString().split("T")[0],
      name,
      last_name,
      department,
      email,
      phone,
      job_position,
    })
  ),

  update: (
    id: number,
    name: string,
    last_name: string,
    department: number,
    email: string,
    phone: string,
    job_position: number
  ) => (
    api.patch(employeeService.endpoint + param(id), {
      name,
      last_name,
      department,
      email,
      phone,
      job_position,
    })
  )
}

export type department = {
  id: id,
  name: string,
  description: string,
  enabled: boolean
}
export const departmentService = {
  endpoint: API_URL + "departments/",

  get: (id: number = 0): Promise<department | department[]> => (
    api.get(departmentService.endpoint + param(id))
  ),
}

export type jobPosition = {
  id: id,
  name: string,
  description: string,
  enabled: boolean,
  department: id
}
export type completeJobPosition = Omit<jobPosition, "department"> & {
  department: department,
}
export const jobPositionService = {
  endpoint: API_URL + "job-positions/",

  get: (id: number = 0): Promise<jobPosition | jobPosition[]> => (
    api.get(jobPositionService.endpoint + param(id))
  ),
}

export const employeeTerminationService = {
  endpoint: API_URL + "employee-terminations/",

  create: (
    employee: number,
    type: string,
    reason: string,
  ) => (
    api.post(employeeTerminationService.endpoint, {
      employee,
      type,
      reason,
    })
  )
}

export type employmentHistory = {
  id: id,
  update_at: string,
  description: string,
  enabled: boolean,
  employee: id,
  last_job_position: id,
  new_job_position: id
}
export type completeEmploymentHistory = Omit<employmentHistory, "employee" | "last_job_position" | "new_job_position"> & {
  employee: completeEmployee,
  last_job_position: completeJobPosition,
  new_job_position: completeJobPosition,
}
export const employmentHistoryService = {
  endpoint: API_URL + "employment-history/",

  get: (id: number = 0): Promise<employmentHistory[] | employmentHistory> => (
    api.get(employmentHistoryService.endpoint + param(id))
  ),

  create: (
    description: string,
    employee: number,
    last_job_position: number,
    new_job_position: number
  ) => (
    api.post(employmentHistoryService.endpoint, {
      description,
      employee,
      last_job_position,
      new_job_position,
    })
  ),
}

export type incident = {
  id: id,
  type: string,
  date: string,
  justified: string,
  notes: string,
  enabled: boolean,
  employee: id
}
export const incidentsService = {
  endpoint: API_URL + "incidents/",

  get: (id: number = 0): Promise<incident[] | incident> => (
    api.get(incidentsService.endpoint + param(id))
  ),
}

export type vacationRequest = {
  id: id,
  date: string,
  status: string,
  enabled: boolean,
  employee: id,
}
export type completeVacationRequest = Omit<vacationRequest, "employee"> & {
  employee: completeEmployee,
}
export const vacationRequestsService = {
  endpoint: API_URL + "vacation-requests/",

  get: (id: number = 0): Promise<vacationRequest[] | vacationRequest> => (
    api.get(vacationRequestsService.endpoint + param(id))
  ),
}

export type vacationDetail = {
  id: id,
  selected_day: string,
  enabled: boolean,
  vacation_request: id,
}
export type completeVacationDetail = Omit<vacationDetail, "vacation_request"> & {
  vacation_request: completeVacationRequest,
}
export const vacationDetailsService = {
  endpoint: API_URL + "vacation-details/",

  get: (id: number = 0): Promise<vacationDetail[] | vacationDetail> => (
    api.get(vacationDetailsService.endpoint + param(id))
  ),
}

export type vacationApproval = {
  id: id,
  date: string,
  decision: string,
  note: string,
  enabled: boolean,
  vacation_request: id,
  approver: number,
}
export type completeVacationApproval = Omit<vacationApproval, "vacation_request"> & {
  vacation_request: completeVacationRequest,
}
export const vacationApprovalsService = {
  endpoint: API_URL + "vacation-approvals/",

  get: (id: number = 0): Promise<vacationApproval[] | vacationApproval> => (
    api.get(vacationApprovalsService.endpoint + param(id))
  ),
}

export type announcement = {
  id: id,
  title: string,
  content: string,
  date: string,
  priority: string,
  enabled: boolean,
  author: id,
}

export const announcementsService = {
  endpoint: API_URL + "announcements/",

  get: (id: number = 0): Promise<announcement[] | announcement> => (
    api.get(announcementsService.endpoint + param(id))
  ),

  create: (data: { title: string, content: string, priority: string, author: number }) => (
    api.post(announcementsService.endpoint, data)
  ),
}

export type incidentJustification = {
  id: id,
  reason: string,
  evidence: string,
  date: string,
  status: string,
  notes: string,
  enabled: boolean,
  incident: id,
}

export const incidentJustificationService = {
  endpoint: API_URL + "incident-justifications/",

  get: (id: number = 0): Promise<incidentJustification[] | incidentJustification> => (
    api.get(incidentJustificationService.endpoint + param(id))
  ),

  create: (data: { 
    reason: string, 
    evidence: string, 
    status: string, 
    incident: number, 
    notes: string 
  }) => (
    api.post(incidentJustificationService.endpoint, data)
  ),
}