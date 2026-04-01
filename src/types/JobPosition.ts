import type { Department } from "./Department"

export type JobPosition = {
  id: number
  name: string
  description: string
  enabled: boolean
  department: Department
}