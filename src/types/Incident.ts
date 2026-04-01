import type { Employee } from "./Employee"

export type Incident = {
  id: number
  type: string
  date: string
  justified: string
  notes: string
  enabled: boolean
  employee: Employee
}