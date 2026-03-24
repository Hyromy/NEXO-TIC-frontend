import type { User } from "./User"
import type { JobPosition } from "./JobPosition"

export type Employee = {
  id: number
  user: User
  job_position: JobPosition
  join_date: string
  phone: string
  enabled: boolean
}