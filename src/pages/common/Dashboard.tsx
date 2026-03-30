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
  vacationService,
  vacationRequestsService,
  employeeService,
  announcementsService,
  incidentsService
} from "../../services/nexotic"

const defaultHeight = 192
const defaultPadding = 2
const defaultGap = 3

export default function Dashboard() {
  const { canAccessEmployee, canAccessRRHH } = useUser()

  const main = () => {
    if (canAccessEmployee()) return <EmployeeDashboard />
    if (canAccessRRHH()) return <RRHHDashboard />
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
      <Alert key={index} notDismissible icon={item.icon} type={item.variant}>
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
          items={items.map(item => (
            <StackContainer >
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
      if (!userId) return
      try {
        const empRes = await fetchData(employeeService.get(userId))
        const employee = Array.isArray(empRes) ? empRes[0] : empRes
        if (employee) {
          const periodRes = await fetchData(vacationService.get())
          const myPeriod = Array.isArray(periodRes) 
            ? periodRes.find((p: any) => p.employee === employee.id)
            : null
          setPendingHolidays(myPeriod?.days_remaining || 0)

          const reqRes = await fetchData(vacationRequestsService.get())
          if (Array.isArray(reqRes)) {
            const myRequests = reqRes
              .filter((r: any) => r.employee === employee.id && r.status === "pending")
              .map((r: any) => `Solicitud #${r.id} - ${new Date(r.date).toLocaleDateString()}`)
            setPendingRequests(myRequests)
          }

          const incRes = await fetchData(incidentsService.get())
          if (Array.isArray(incRes)) {
            const myIncidents = incRes
              .filter((i: any) => i.employee === employee.id && i.enabled)
              .map((i: any) => ({ 
                title: i.type, 
                date: new Date(i.date).toLocaleDateString() 
              }))
            setIncidents(myIncidents)
          }

          const annRes = await fetchData(announcementsService.get())
          if (Array.isArray(annRes)) {
            const mappedAnn = annRes
              .filter((a: any) => a.enabled)
              .map((a: any) => ({
                icon: (a.priority === "high" ? "warning" : "info") as icons,
                variant: (a.priority === "high" ? "warning" : "info") as variants,
                children: (
                  <div>
                    <strong>{a.title}</strong>
                    <div>{a.content}</div>
                  </div>
                )
              }))
            setNotices(mappedAnn)
          }
        }
      } catch (e) {
        console.error("Dashboard Load Error:", e)
      }
    }
    loadDashboardData()
    // Solo se dispara cuando el userId o fetchData cambian
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
        const [reqs, incs, periods, anns] = await Promise.all([
          fetchData(vacationRequestsService.get()),
          fetchData(incidentsService.get()),
          fetchData(vacationService.get()),
          fetchData(announcementsService.get())
        ])

        setPendingRequests(reqs?.filter((r: any) => r.status === "pending").length || 0)
        setPendingIncidents(incs?.filter((i: any) => i.enabled).length || 0)
        setDaysForHolidays(periods?.reduce((acc: number, p: any) => acc + (p.days_remaining || 0), 0) || 0)

        const mapped = anns?.map((a: any) => ({
          icon: "info" as icons,
          variant: "info" as variants,
          children: <strong>{a.title}</strong>
        })) || []
        setNotices(mapped)

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