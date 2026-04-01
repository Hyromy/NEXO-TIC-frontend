import type { Employee } from "./Employee"

export type EmployeeTermination = {
  id: number
  date: string
  type: string
  reason: string
  enabled: boolean
  employee: Employee
}