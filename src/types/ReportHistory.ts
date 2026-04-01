import type { Employee } from "./Employee"

export type ReportHistory = {
  id: number
  type: string
  start_at: string
  end_at: string
  registered_at: string
  notes: string
  enabled: boolean
  employee: Employee
}