import type { Employee } from "./Employee"

export type VacationPeriod = {
  id: number
  year: number
  days_assigned: number
  days_used: number
  days_remaining: number
  enabled: boolean
  employee: Employee
}