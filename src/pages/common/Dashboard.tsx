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
import { getHumanName } from "../../utils/getters"

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
  const pendingHolidays = 4
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
  const pendingRequests = 16
  const pendingIncidents = 27
  const daysForHolidays = 4
  const notices: AlertObject[] = [
    { icon: "info", children: "Información importante", variant: "info" },
    { icon: "warning", children: "Advertencia", variant: "warning" },
    { icon: "warning", children: "Advertencia", variant: "warning" },
  ]

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
