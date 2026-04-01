import type { Incident } from "./Incident"

export type IncidentJustification = {
  id: number
  reason: string
  evidence: string
  date: string
  status: string
  notes: string
  enabled: boolean
  incident: Incident
}