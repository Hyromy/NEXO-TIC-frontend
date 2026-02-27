import Main from "../../layout/Main"

import { Navigate } from "react-router-dom"
import useUser from "../../hooks/useUser"
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

const defaultHeight = 192
const defaultPadding = 2

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

type HolidaysCardProps = {
  days: number
}
function DaysForHolidays({days}: HolidaysCardProps) {
  return (
    <Card header="Dias de vacaciones disponibles" padding={defaultPadding}>
      <StackContainer center height={defaultHeight}>
        <h2>{days} días</h2>
      </StackContainer>
    </Card>
  )
}

type ItemsCardViewProps = {
  items: string[]
  height?: number
}
function PendingRequests({
  items,
  height = defaultHeight,
}: ItemsCardViewProps) {
  const content = items.length > 0
    ? <List items={items} flush />
    : <StackContainer center height={defaultHeight}>
        No hay solicitudes pendientes
      </StackContainer>

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
    : <StackContainer center height={defaultHeight}>
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
  items: IndicentObject[]
  height?: number
}
function Incidents({
  items,
  height = defaultHeight,
}: IncidentsProps) {
  return (
    <Card header="Incidencias pendientes" padding={defaultPadding}>
      <ScrollableContainer height={height} forceHeight>
        {items.length > 0
          ? <List
              items={items.map(item => (
                <StackContainer >
                  {item.title} - {item.date}
                </StackContainer>
              ))}
              flush
            />
          : <StackContainer center height={height}>
              No hay incidencias pendientes
            </StackContainer>
        }
      </ScrollableContainer>
    </Card>
  )
}

type IndicentObject = {
  title: string
  date: string
}
function EmployeeDashboard() {
  const pendingRequests = [
    "Solicitud de permiso 1",
    "Solicitud de permiso 2",
  ]
  const notices: AlertObject[] = [
    { icon: "info", children: "Información importante", variant: "info" },
    { icon: "warning", children: "Advertencia", variant: "warning" },
    { icon: "warning", children: "Advertencia", variant: "warning" },
  ]
  const incidents: IndicentObject[] = [
    { title: "Incidente 1", date: "2023-01-01" },
    { title: "Incidente 2", date: "2023-01-02" },
  ]

  return (
    <__EmployeeLayout
      first={<DaysForHolidays days={4} />}
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
  const gap = 3

  return (
    <RowContainer gap={gap}>
      <ColContainer defaultSize={8} sm={12} lg={8}>
        <StackContainer gap={gap}>
          <RowContainer gap={gap}>
            <ColContainer sm={12} lg={6}>
              {first}
            </ColContainer>
            <ColContainer sm={12} lg={6}>
              {second}
            </ColContainer>
          </RowContainer>
          <RowContainer gap={gap}>
            <ColContainer defaultSize={12}>
              {fat}
            </ColContainer>
          </RowContainer>
        </StackContainer>
      </ColContainer>
      <ColContainer defaultSize={4} sm={12} lg={4}>
        {tall}
      </ColContainer>
    </RowContainer>
  )
}

function RRHHDashboard() {
  return (
    <__RRHHLayout />
  )
}

function __RRHHLayout() {
  return (
    <h1>RRHH Layout</h1>
  )
}
