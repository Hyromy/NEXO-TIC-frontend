import type { VacationRequest } from "./VacationRequest"
import type { Employee } from "./Employee"

export type VacationApproval = {
  id: number
  date: string
  decision: string
  note: string
  enabled: boolean
  vacation_request: VacationRequest
  approver: Employee
}