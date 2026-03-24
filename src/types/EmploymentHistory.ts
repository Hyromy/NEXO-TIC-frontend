import type { Employee } from "./Employee"
import type { JobPosition } from "./JobPosition"

export type EmploymentHistory = {
  id: number
  update_at: string
  description: string
  enabled: boolean
  employee: Employee
  last_job_position: JobPosition
  new_job_position: JobPosition
}