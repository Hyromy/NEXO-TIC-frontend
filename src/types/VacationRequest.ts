import type { Employee } from "./Employee"

export type VacationRequest = {
  id: number
  date: string
  status: string
  enabled: boolean
  employee: Employee
}