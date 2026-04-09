import Main from "../../layout/Main"
import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import useUser from "../../hooks/useUser"
import useApi from "../../hooks/useApi"
import { Card } from "../../components/Card"
import { List } from "../../components/List"
import { Alert } from "../../components/Alert"
import {
  RowContainer,
  ColContainer,
  StackContainer,
  ScrollableContainer
} from "../../layout/Containers"
import type { ReactNode } from "react"

import { type icons, type variants } from "../../components/variants"
import { getHumanName, getAccessToken } from "../../utils/getters"
import { decodeJWT } from "../../utils/jwt"
import {
  vacationPeriodService,
  vacationRequestService,
  employeeService,
  announcementService,
  incidentService
} from "../../services/nexotic"

const defaultHeight = 192
const defaultPadding = 2
const defaultGap = 3

const asCollection = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) return value as T[]
  if (!value || typeof value != "object") return []

  const source = value as Record<string, unknown>
  if (Array.isArray(source.results)) return source.results as T[]
  if (Array.isArray(source.data)) return source.data as T[]

  return []
}

const isAnnouncementEnabled = (value: unknown) => {
  if (value == null) return true
  if (typeof value == "boolean") return value
  if (typeof value == "string") return value.toLowerCase() != "false"
  return Boolean(value)
}

const sortByDateDesc = <T extends Record<string, unknown>>(items: T[]) => {
  return [...items].sort((a, b) => {
    const aDate = new Date(String(a.date || "")).getTime()
    const bDate = new Date(String(b.date || "")).getTime()
    return bDate - aDate
  })
}

const mapAnnouncementsToAlerts = (
  announcements: any[],
  options?: { withPriority?: boolean }
): AlertObject[] => {
  const withPriority = options?.withPriority !== false

  const priorityIcons: Record<string, icons> = {
    Alta: "warning",
    Media: "warning",
    Baja: "info",
  }

  const priorityVariants: Record<string, variants> = {
    Alta: "danger",
    Media: "warning",
    Baja: "info",
  }

  return sortByDateDesc(announcements)
    .filter((a) => isAnnouncementEnabled(a?.enabled))
    .map((a) => {
      const title = String(a?.title || "Aviso")
      const content = String(a?.content || "")

      return {
        icon: withPriority ? (priorityIcons[a?.priority] || "info") : "info",
        variant: withPriority ? (priorityVariants[a?.priority] || "info") : "info",
        children: (
          <div key={a?.id || `${title}-${content}`}>
            <strong>{title}</strong>
            {content ? <div>{content}</div> : null}
          </div>
        )
      }
    })
}

export default function Dashboard() {
  const { canAccessEmployee, canAccessRRHH } = useUser()

  const main = () => {
    if (canAccessRRHH()) return <RRHHDashboard />
    if (canAccessEmployee()) return <EmployeeDashboard />
    return <Navigate to="/" />
  }

  return (
    <Main>
      {main()}
    </Main>
  )
}

function DaysForHolidays({days}: {days: number}) {
  return (
    <Card header="Dias de vacaciones disponibles" padding={defaultPadding}>
      <StackContainer center height={defaultHeight}>
        <h2>{days} días</h2>
      </StackContainer>
    </Card>
  )
}

type ItemsCardViewProps = {
  forceNumber?: number
  items?: string[]
  height?: number
}
function PendingRequests({
  forceNumber,
  items,
  height = defaultHeight,
}: ItemsCardViewProps) {
  const container = (content: ReactNode) => (
    <StackContainer center height={defaultHeight}>
      {content}
    </StackContainer>
  )

  const content = forceNumber != null
    ? container(<h2>{forceNumber}</h2>)
    : items && items.length > 0
      ? <List items={items} flush />
      : container("No hay solicitudes pendientes")

  return (
    <Card header="Solicitudes pendientes" padding={defaultPadding}>
      <ScrollableContainer height={height} forceHeight>
        {content}
      </ScrollableContainer>
    </Card>
  )
}

type AlertObject = {
  icon?: icons
  children: ReactNode
  variant?: variants
}
type NoticesProps = {
  items: AlertObject[]
  height?: number
}
function Notices({
  items,
  height = defaultHeight * 2 + 74,
}: NoticesProps) {
  const content = items.length > 0
    ? items.map((item, index) => (
      <Alert key={index} notDismissible icon={item.icon} type={item.variant} timeout={false}>
        {item.children}
      </Alert>)
    )
    : <StackContainer center height={height}>
        No hay avisos o informes
      </StackContainer>

  return (
    <Card header="Avisos e informes" padding={defaultPadding}>
      <ScrollableContainer height={height} forceHeight>
        {content}
      </ScrollableContainer>
    </Card>
  )
}

type IncidentsProps = {
  forceNumber?: number
  items?: IndicentObject[]
  height?: number
}
function Incidents({
  forceNumber,
  items,
  height = defaultHeight,
}: IncidentsProps) {
  const container = (content: ReactNode) => (
    <StackContainer center height={defaultHeight}>
      {content}
    </StackContainer>
  )

  const content = forceNumber != null
    ? container(<h2>{forceNumber}</h2>)
    : items && items.length > 0
      ? <List
          items={items.map((item, index) => (
            <StackContainer key={index}>
              {item.title} - {item.date}
            </StackContainer>
          ))}
          flush
        />
      : container("No hay incidencias pendientes")

  return (
    <Card header="Incidencias pendientes" padding={defaultPadding}>
      <ScrollableContainer height={height} forceHeight>
        {content}
      </ScrollableContainer>
    </Card>
  )
}

type IndicentObject = {
  title: string
  date: string
}

function EmployeeDashboard() {  
  const { execute: fetchData } = useApi<any>()
  const [pendingHolidays, setPendingHolidays] = useState(0)
  const [pendingRequests, setPendingRequests] = useState<string[]>([])
  const [notices, setNotices] = useState<AlertObject[]>([])
  const [incidents, setIncidents] = useState<IndicentObject[]>([])

  const token = getAccessToken()
  const decoded: any = token ? decodeJWT(token) : null
  const userId = decoded?.user_id

 useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const annRes = await fetchData(announcementService.getAll())
        const announcements = asCollection<any>(annRes)
        setNotices(mapAnnouncementsToAlerts(announcements, { withPriority: true }))

        if (!userId) return

        const empRes = await fetchData(employeeService.getAll())
        const employees = asCollection<any>(empRes)
        const employee = employees.find((e: any) => Number(e.user?.id || e.user) === Number(userId))

        if (!employee) return

        const [periodRes, reqRes, incRes] = await Promise.all([
          fetchData(vacationPeriodService.getAll()),
          fetchData(vacationRequestService.getAll()),
          fetchData(incidentService.getAll())
        ])

        const periods = asCollection<any>(periodRes)
        const requests = asCollection<any>(reqRes)
        const incidentsData = asCollection<any>(incRes)

        const myPeriod = periods.find((p: any) => (p.employee?.id || p.employee) === employee.id)
        setPendingHolidays(myPeriod?.days_remaining || 0)

        setPendingRequests(requests
          .filter((r: any) => (r.employee?.id || r.employee) === employee.id && r.status === "pending")
          .map((r: any) => `Solicitud #${r.id} - ${new Date(r.date).toLocaleDateString()}`)
        )

        setIncidents(incidentsData
          .filter((i: any) => (i.employee?.id || i.employee) === employee.id && i.enabled)
          .map((i: any) => ({ title: i.type, date: new Date(i.date).toLocaleDateString() }))
        )

      } catch (e) { console.error(e) }
    }
    loadDashboardData()
  }, [userId, fetchData])

  return (
    <__EmployeeLayout
      first={<DaysForHolidays days={pendingHolidays} />}
      second={<PendingRequests items={pendingRequests} />}
      tall={<Notices items={notices} />}
      fat={<Incidents items={incidents} />}
    />
  )
}
type EmployeeLayoutProps = {
  first: ReactNode
  second: ReactNode
  tall: ReactNode
  fat: ReactNode
}
function __EmployeeLayout({
  first,
  second,
  tall,
  fat,
}: EmployeeLayoutProps) {
  return (
    <RowContainer gap={defaultGap}>
      <ColContainer defaultSize={12} lg={8}>
        <StackContainer gap={defaultGap}>
          <RowContainer gap={defaultGap}>
            <ColContainer defaultSize={12} lg={6}>
              {first}
            </ColContainer>
            <ColContainer defaultSize={12} lg={6}>
              {second}
            </ColContainer>
          </RowContainer>
          <RowContainer gap={defaultGap}>
            <ColContainer defaultSize={12}>
              {fat}
            </ColContainer>
          </RowContainer>
        </StackContainer>
      </ColContainer>
      <ColContainer defaultSize={12} lg={4}>
        {tall}
      </ColContainer>
    </RowContainer>
  )
}

function RRHHDashboard() {
  const { execute: fetchData } = useApi<any>()
  const [pendingRequests, setPendingRequests] = useState(0)
  const [pendingIncidents, setPendingIncidents] = useState(0)
  const [daysForHolidays, setDaysForHolidays] = useState(0)
  const [notices, setNotices] = useState<AlertObject[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const anns = await fetchData(announcementService.getAll())
        const announcements = asCollection<any>(anns)
        setNotices(mapAnnouncementsToAlerts(announcements, { withPriority: true }))

        const [reqs, incs, periods] = await Promise.all([
          fetchData(vacationRequestService.getAll()),
          fetchData(incidentService.getAll()),
          fetchData(vacationPeriodService.getAll()),
        ])

        const requests = asCollection<any>(reqs)
        const incidentsData = asCollection<any>(incs)
        const periodsData = asCollection<any>(periods)

        setPendingRequests(requests.filter((r: any) => r.status === "pending").length)
        setPendingIncidents(incidentsData.filter((i: any) => i.enabled).length)
        setDaysForHolidays(periodsData.reduce((acc: number, p: any) => acc + (p.days_remaining || 0), 0))

      } catch (e) { console.error(e) }
    }
    loadData()
  }, [fetchData])

  return (
    <__RRHHLayout
      first={<PendingRequests forceNumber={pendingRequests} />}
      second={<Incidents forceNumber={pendingIncidents} />}
      third={<DaysForHolidays days={daysForHolidays} />}
      fat={<Notices items={notices} />}
    />
  )
}

type RRHHLayoutProps = {
  first: ReactNode
  second: ReactNode
  third: ReactNode
  fat: ReactNode
}
function __RRHHLayout({
  first,
  second,
  third,
  fat,
}: RRHHLayoutProps) {
  return (
    <StackContainer gap={defaultGap}>
      <h2>¡Hola, {getHumanName()}!👋</h2>
      <h4>Aquí tiene un resumen de la actividad</h4>
      <RowContainer gap={defaultGap}>
        <ColContainer defaultSize={12} lg={4}>
          {first}
        </ColContainer>
        <ColContainer defaultSize={12} lg={4}>
          {second}
        </ColContainer>
        <ColContainer defaultSize={12} lg={4}>
          {third}
        </ColContainer>
      </RowContainer>
      <RowContainer gap={defaultGap}>
        <ColContainer defaultSize={12}>
          {fat}
        </ColContainer>
      </RowContainer>
    </StackContainer>
  )
}