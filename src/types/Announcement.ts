import type { Employee } from "./Employee"

export type Announcement = {
  id: number
  title: string
  content: string
  date: string
  priority: string
  enabled: boolean
  author: Employee
}