import { api, type ApiResponse } from "./api"

import type { Employee } from "../types/Employee"
import type { Department } from "../types/Department"
import type { JobPosition } from "../types/JobPosition"
import type { EmploymentHistory } from "../types/EmploymentHistory"
import type { Incident } from "../types/Incident"
import type { VacationRequest } from "../types/VacationRequest"
import type { VacationDetail } from "../types/VacationDetail"
import type { VacationApproval } from "../types/VacationApproval"
import type { EmployeeTermination } from "../types/EmployeeTermination"
import type { Announcement } from "../types/Announcement"
import type { Role } from "../types/Role"
import type { ReportHistory } from "../types/ReportHistory"
import type { VacationPolicy } from "../types/VacationPolicy"
import type { VacationPeriod } from "../types/VacationPeriod"
import type { IncidentJustification } from "../types/IncidentJustification"
import type { User } from "../types/User"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/";

export type { User, Employee, Department, JobPosition, EmploymentHistory, Incident, VacationRequest, VacationDetail, VacationApproval }

export type CompleteEmployee = Employee
export type CompleteEmploymentHistory = EmploymentHistory
export type CompleteVacationRequest = VacationRequest
export type CompleteVacationDetail = VacationDetail
export type CompleteVacationApproval = VacationApproval

export type user = {
  id: number
  last_login?: string | null
  is_superuser: boolean
  username: string
  first_name: string
  last_name: string
  email: string
  is_staff: boolean
  is_active: boolean
  date_joined: string
  groups?: number[]
  user_permissions?: number[]
}

export type department = {
  id: number
  name: string
  description: string
  enabled: boolean
}

export type jobPosition = {
  id: number
  name: string
  description: string
  enabled: boolean
  department: number
}

export type employee = {
  id: number
  user: number
  job_position: number
  join_date: string
  phone: string
  enabled: boolean
}

export type employmentHistory = {
  id: number
  update_at: string
  description: string
  enabled: boolean
  employee: number
  last_job_position: number
  new_job_position: number
}

export type vacationRequest = {
  id: number
  date: string
  status: string
  enabled: boolean
  employee: number
}

export type vacationDetail = {
  id: number
  selected_day: string
  enabled: boolean
  vacation_request: number
}

export type vacationApproval = {
  id: number
  date: string
  decision: string
  note: string
  enabled: boolean
  vacation_request: number
  approver: number
}

export type completeJobPosition = Omit<jobPosition, "department"> & { department: department }
export type completeEmployee = Omit<employee, "user" | "job_position"> & { user: user; job_position: completeJobPosition }
export type completeEmploymentHistory = Omit<employmentHistory, "employee" | "last_job_position" | "new_job_position"> & {
  employee: completeEmployee
  last_job_position: completeJobPosition
  new_job_position: completeJobPosition
}
export type completeVacationRequest = Omit<vacationRequest, "employee"> & { employee: completeEmployee }
export type completeVacationDetail = Omit<vacationDetail, "vacation_request"> & { vacation_request: completeVacationRequest }
export type completeVacationApproval = Omit<vacationApproval, "vacation_request"> & { vacation_request: completeVacationRequest }

type EmployeeMutationData = {
  name: string
  last_name: string
  email: string
  phone: string
  department: number
  job_position?: number
  job_position_id?: number
}

const normalizeEmployeeMutation = (data: Partial<EmployeeMutationData>) => {
  const { job_position, job_position_id, ...rest } = data
  const normalizedJobPosition = job_position ?? job_position_id

  if (normalizedJobPosition === undefined) {
    return rest
  }

  return {
    ...rest,
    job_position: normalizedJobPosition,
    job_position_id: normalizedJobPosition,
  }
}

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
const param = (id?: number) => (
  typeof id === "number" && Number.isInteger(id) && id > 0 ? `${id}/` : ""
)

/**
 * Service for managing user-related API calls.
 * 
 * The userService object provides methods for interacting with the user-related endpoints of the API. It includes methods for retrieving user information and creating new users.
 */
export const userService = {
  endpoint: API_URL + "users/",

  get: (id?: number): Promise<ApiResponse<User | User[]>> =>
    api.get(userService.endpoint + param(id)),

  getAll: (): Promise<ApiResponse<User[]>> =>
    api.get(userService.endpoint),

  getById: (id: number): Promise<ApiResponse<User>> =>
    api.get(userService.endpoint + param(id)),

  create: (data: {
    username: string
    password: string
    email?: string
  }) =>
    api.post(userService.endpoint, data),
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


// EMPLOYEES
export const employeeService = {
  endpoint: API_URL + "employees/",

  get: (id?: number): Promise<ApiResponse<Employee | Employee[]>> =>
    api.get(employeeService.endpoint + param(id)),

  getAll: (): Promise<ApiResponse<Employee[]>> =>
    api.get(employeeService.endpoint),

  getById: (id: number): Promise<ApiResponse<Employee>> =>
    api.get(employeeService.endpoint + param(id)),

  create: (
    dataOrName: EmployeeMutationData | string,
    last_name?: string,
    department?: number,
    email?: string,
    phone?: string,
    job_position?: number,
  ) => {
    const payload = typeof dataOrName === "string"
      ? {
          name: dataOrName,
          ...(last_name !== undefined && { last_name }),
          ...(department !== undefined && { department }),
          ...(email !== undefined && { email }),
          ...(phone !== undefined && { phone }),
          ...(job_position !== undefined && { job_position }),
        }
      : normalizeEmployeeMutation(dataOrName)

    return api.post(employeeService.endpoint, {
      join_date: new Date().toISOString().split("T")[0],
      ...payload
    })
  },

  update: (
    id: number,
    dataOrName: Partial<EmployeeMutationData> | string,
    last_name?: string,
    department?: number,
    email?: string,
    phone?: string,
    job_position?: number,
  ) => {
    const payload = typeof dataOrName === "string"
      ? {
          name: dataOrName,
          ...(last_name !== undefined && { last_name }),
          ...(department !== undefined && { department }),
          ...(email !== undefined && { email }),
          ...(phone !== undefined && { phone }),
          ...(job_position !== undefined && { job_position }),
        }
      : normalizeEmployeeMutation(dataOrName)

    return api.patch(employeeService.endpoint + param(id), payload)
  },
}


// DEPARTMENTS
export const departmentService = {
  endpoint: API_URL + "departments/",

  get: (id?: number): Promise<ApiResponse<Department | Department[]>> =>
    api.get(departmentService.endpoint + param(id)),

  getAll: (): Promise<ApiResponse<Department[]>> =>
    api.get(departmentService.endpoint),

  getById: (id: number): Promise<ApiResponse<Department>> =>
    api.get(departmentService.endpoint + param(id)),

  create: (data: {
    name: string
    description: string
    enabled?: boolean
  }) =>
    api.post(departmentService.endpoint, data),

  update: (id: number, data: Partial<{
    name: string
    description: string
    enabled: boolean
  }>) =>
    api.patch(departmentService.endpoint + param(id), data),

  delete: (id: number) =>
    api.delete(departmentService.endpoint + param(id)),
}



// JOB POSITIONS
export const jobPositionService = {
  endpoint: API_URL + "job-positions/",

  get: (id?: number): Promise<ApiResponse<JobPosition | JobPosition[]>> =>
    api.get(jobPositionService.endpoint + param(id)),

  getAll: (): Promise<ApiResponse<JobPosition[]>> =>
    api.get(jobPositionService.endpoint),

  getById: (id: number): Promise<ApiResponse<JobPosition>> =>
    api.get(jobPositionService.endpoint + param(id)),

  create: (data: {
    name: string
    description: string
    department_id: number
    enabled?: boolean
  }) =>
    api.post(jobPositionService.endpoint, data),

  update: (id: number, data: Partial<{
    name: string
    description: string
    department_id: number
    enabled: boolean
  }>) =>
    api.patch(jobPositionService.endpoint + param(id), data),

  delete: (id: number) =>
    api.delete(jobPositionService.endpoint + param(id)),
}


// VACATION POLICY 
export const vacationPolicyService = {
  endpoint: API_URL + "vacation-policies/",

  getAll: (): Promise<ApiResponse<VacationPolicy[]>> =>
    api.get(vacationPolicyService.endpoint),

  getById: (id: number): Promise<ApiResponse<VacationPolicy>> =>
    api.get(vacationPolicyService.endpoint + param(id)),

  create: (data: {
    seniority_years: number
    vacation_days: number
    enabled?: boolean
  }) =>
    api.post(vacationPolicyService.endpoint, data),

  update: (id: number, data: Partial<{
    seniority_years: number
    vacation_days: number
    enabled: boolean
  }>) =>
    api.patch(vacationPolicyService.endpoint + param(id), data),

  delete: (id: number) =>
    api.delete(vacationPolicyService.endpoint + param(id)),
}



// VACATION PERIOD 
export const vacationPeriodService = {
  endpoint: API_URL + "vacation-periods/",

  getAll: (): Promise<ApiResponse<VacationPeriod[]>> =>
    api.get(vacationPeriodService.endpoint),

  getById: (id: number): Promise<ApiResponse<VacationPeriod>> =>
    api.get(vacationPeriodService.endpoint + param(id)),

  create: (data: {
    employee_id: number
    year: number
    days_assigned: number
    days_used: number
    days_remaining: number
    enabled?: boolean
  }) =>
    api.post(vacationPeriodService.endpoint, data),

  update: (id: number, data: Partial<{
    employee_id: number
    year: number
    days_assigned: number
    days_used: number
    days_remaining: number
    enabled: boolean
  }>) =>
    api.patch(vacationPeriodService.endpoint + param(id), data),

  delete: (id: number) =>
    api.delete(vacationPeriodService.endpoint + param(id)),
}



// EMPLOYMENT HISTORY
export const employmentHistoryService = {
  endpoint: API_URL + "employment-history/",

  get: (id?: number): Promise<ApiResponse<EmploymentHistory | EmploymentHistory[]>> =>
    api.get(employmentHistoryService.endpoint + param(id)),

  getAll: (): Promise<ApiResponse<EmploymentHistory[]>> =>
    api.get(employmentHistoryService.endpoint),

  getById: (id: number): Promise<ApiResponse<EmploymentHistory>> =>
    api.get(employmentHistoryService.endpoint + param(id)),

  create: (
    dataOrDescription: {
      description: string
      employee?: number
      employee_id?: number
      last_job_position?: number
      last_job_position_id?: number
      new_job_position?: number
      new_job_position_id?: number
    } | string,
    employee?: number,
    last_job_position?: number,
    new_job_position?: number,
  ) => {
    const rawPayload = typeof dataOrDescription === "string"
      ? {
          description: dataOrDescription,
          employee_id: employee ?? 0,
          last_job_position_id: last_job_position ?? 0,
          new_job_position_id: new_job_position ?? 0,
        }
      : dataOrDescription

    const payload = {
      ...rawPayload,
      employee_id: rawPayload.employee_id ?? rawPayload.employee,
      last_job_position_id: rawPayload.last_job_position_id ?? rawPayload.last_job_position,
      new_job_position_id: rawPayload.new_job_position_id ?? rawPayload.new_job_position,
    }

    return api.post(employmentHistoryService.endpoint, payload)
  },
}



// INCIDENTS
export const incidentService = {
  endpoint: API_URL + "incidents/",

  get: (id?: number): Promise<ApiResponse<Incident | Incident[]>> =>
    api.get(incidentService.endpoint + param(id)),

  getAll: (): Promise<ApiResponse<Incident[]>> =>
    api.get(incidentService.endpoint),

  getById: (id: number): Promise<ApiResponse<Incident>> =>
    api.get(incidentService.endpoint + param(id)),

  create: (data: {
    employee_id: number
    type: string
    justified: string
    notes: string
    enabled?: boolean
  }) =>
    api.post(incidentService.endpoint, data),

  update: (id: number, data: Partial<{
    type: string
    justified: string
    notes: string
    enabled: boolean
  }>) =>
    api.patch(incidentService.endpoint + param(id), data),

  delete: (id: number) =>
    api.delete(incidentService.endpoint + param(id)),
}



// INCIDENT JUSTIFICATION
export const incidentJustificationService = {
  endpoint: API_URL + "incident-justifications/",

  getAll: (): Promise<ApiResponse<IncidentJustification[]>> =>
    api.get(incidentJustificationService.endpoint),

  getById: (id: number): Promise<ApiResponse<IncidentJustification>> =>
    api.get(incidentJustificationService.endpoint + param(id)),

  create: (data: {
    incident_id: number
    reason: string
    evidence: string
    status: string
    notes: string
    enabled?: boolean
  }) =>
    api.post(incidentJustificationService.endpoint, data),

  update: (id: number, data: Partial<{
    reason: string
    evidence: string
    status: string
    notes: string
    enabled: boolean
  }>) =>
    api.patch(incidentJustificationService.endpoint + param(id), data),

  delete: (id: number) =>
    api.delete(incidentJustificationService.endpoint + param(id)),
}



// VACATION REQUESTS
export const vacationRequestService = {
  endpoint: API_URL + "vacation-requests/",

  get: (id?: number): Promise<ApiResponse<VacationRequest | VacationRequest[]>> =>
    api.get(vacationRequestService.endpoint + param(id)),

  getAll: (): Promise<ApiResponse<VacationRequest[]>> =>
    api.get(vacationRequestService.endpoint),

  getById: (id: number): Promise<ApiResponse<VacationRequest>> =>
    api.get(vacationRequestService.endpoint + param(id)),

  create: (data: {
    employee_id: number
    status: string
    enabled?: boolean
  }) =>
    api.post(vacationRequestService.endpoint, data),

  update: (id: number, data: Partial<{
    employee_id: number
    status: string
    enabled: boolean
  }>) =>
    api.patch(vacationRequestService.endpoint + param(id), data),

  delete: (id: number) =>
    api.delete(vacationRequestService.endpoint + param(id)),
}



// VACATION DETAILS
export const vacationDetailService = {
  endpoint: API_URL + "vacation-details/",

  get: (id?: number): Promise<ApiResponse<VacationDetail | VacationDetail[]>> =>
    api.get(vacationDetailService.endpoint + param(id)),

  getAll: (): Promise<ApiResponse<VacationDetail[]>> =>
    api.get(vacationDetailService.endpoint),

  getById: (id: number): Promise<ApiResponse<VacationDetail>> =>
    api.get(vacationDetailService.endpoint + param(id)),

  create: (data: {
    vacation_request_id: number
    selected_day: string
    enabled?: boolean
  }) =>
    api.post(vacationDetailService.endpoint, data),

  update: (id: number, data: Partial<{
    vacation_request_id: number
    selected_day: string
    enabled: boolean
  }>) =>
    api.patch(vacationDetailService.endpoint + param(id), data),

  delete: (id: number) =>
    api.delete(vacationDetailService.endpoint + param(id)),
}


// VACATION APPROVALS
export const vacationApprovalService = {
  endpoint: API_URL + "vacation-approvals/",

  get: (id?: number): Promise<ApiResponse<VacationApproval | VacationApproval[]>> =>
    api.get(vacationApprovalService.endpoint + param(id)),

  getAll: (): Promise<ApiResponse<VacationApproval[]>> =>
    api.get(vacationApprovalService.endpoint),

  getById: (id: number): Promise<ApiResponse<VacationApproval>> =>
    api.get(vacationApprovalService.endpoint + param(id)),

  create: (data: {
    vacation_request_id: number
    approver_id: number
    decision: string
    note: string
    enabled?: boolean
  }) =>
    api.post(vacationApprovalService.endpoint, data),

  update: (id: number, data: Partial<{
    decision: string
    note: string
    enabled: boolean
  }>) =>
    api.patch(vacationApprovalService.endpoint + param(id), data),

  delete: (id: number) =>
    api.delete(vacationApprovalService.endpoint + param(id)),
}


// TERMINATIONS
export const employeeTerminationService = {
  endpoint: API_URL + "employee-terminations/",

  get: (id?: number): Promise<ApiResponse<EmployeeTermination | EmployeeTermination[]>> =>
    api.get(employeeTerminationService.endpoint + param(id)),

  getAll: (): Promise<ApiResponse<EmployeeTermination[]>> =>
    api.get(employeeTerminationService.endpoint),

  getById: (id: number): Promise<ApiResponse<EmployeeTermination>> =>
    api.get(employeeTerminationService.endpoint + param(id)),

  create: (
    dataOrEmployee: {
      employee: number
      type: string
      reason: string
    } | number,
    type?: string,
    reason?: string,
  ) => {
    const payload = typeof dataOrEmployee === "number"
      ? {
          employee: dataOrEmployee,
          type: type ?? "",
          reason: reason ?? "",
        }
      : dataOrEmployee

    return api.post(employeeTerminationService.endpoint, payload)
  },
}


//ANNOUNCEMENTS
export const announcementService = {
  endpoint: API_URL + "announcements/",

  getAll: (): Promise<ApiResponse<Announcement[]>> =>
    api.get(announcementService.endpoint),

  getById: (id: number): Promise<ApiResponse<Announcement>> =>
    api.get(announcementService.endpoint + param(id)),

  create: (data: {
    title: string
    content: string
    priority: string
    author_id?: number
    enabled?: boolean
  }) =>
    api.post(announcementService.endpoint, data),

  update: (id: number, data: Partial<{
    title: string
    content: string
    priority: string
    enabled: boolean
  }>) =>
    api.patch(announcementService.endpoint + param(id), data),

  delete: (id: number) =>
    api.delete(announcementService.endpoint + param(id)),
}



// REPORT HISTORY
export const reportHistoryService = {
  endpoint: API_URL + "report-history/",

  getAll: (): Promise<ApiResponse<ReportHistory[]>> =>
    api.get(reportHistoryService.endpoint),

  getById: (id: number): Promise<ApiResponse<ReportHistory>> =>
    api.get(reportHistoryService.endpoint + param(id)),

  create: (data: {
    employee_id: number
    type: string
    start_at: string
    end_at: string
    notes: string
    enabled?: boolean
  }) =>
    api.post(reportHistoryService.endpoint, data),

  update: (id: number, data: Partial<{
    type: string
    start_at: string
    end_at: string
    notes: string
    enabled: boolean
  }>) =>
    api.patch(reportHistoryService.endpoint + param(id), data),

  delete: (id: number) =>
    api.delete(reportHistoryService.endpoint + param(id)),
}



//ROLES
export const roleService = {
  endpoint: API_URL + "roles/",

  getAll: (): Promise<ApiResponse<Role[]>> =>
    api.get(roleService.endpoint),

  getById: (id: number): Promise<ApiResponse<Role>> =>
    api.get(roleService.endpoint + param(id)),
}

export const incidentsService = incidentService
export const vacationRequestsService = vacationRequestService
export const vacationDetailsService = vacationDetailService
export const vacationApprovalsService = vacationApprovalService
