import { api } from "./api"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/'

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
export const userService = {
  endpoint: API_URL + "users/",

  get: (id: number = 0): Promise<user | user[]> => (
    api.get(userService.endpoint + param(id))
  ),

  create: (data: {username: string, password: string}) => (
    api.post(userService.endpoint, data)
  ),
}

export const authService = {
  endpoint: API_URL + "auth/",

  login: (username: string, password: string) => (
    api.post(
      authService.endpoint + "login/",
      {
        username,
        password,
      },
      true
    )
  ),

  refresh: (refreshToken?: string) => {
    if (!refreshToken) return null
    return api.post(authService.endpoint + "refresh/", {
      refresh: refreshToken,
    })
  },

  signup: (username: string, email: string) => (
    api.post(authService.endpoint + "signup/", {
      username,
      email,
    })
  ),

  recover: (username: string, email: string) => (
    api.post(authService.endpoint + "recover/", {
      username,
      email,
    })
  ),

  logout: (refresh: string) => (
    api.post(authService.endpoint + "logout/", {
      refresh,
    })
  ),

  changePassword: (new_password: string) => (
    api.post(authService.endpoint + "reset-password/", {
      new_password,
    })
  ),
}

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
