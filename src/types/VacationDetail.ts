import type { VacationRequest } from "./VacationRequest"

export type VacationDetail = {
  id: number
  selected_day: string
  enabled: boolean
  vacation_request: VacationRequest
}