import { useEffect, useState } from "react"
import Main from "../../layout/Main"
import { Navigate } from "react-router-dom"
import { Table } from "../../components/Table"
import { ColContainer, RowContainer, StackContainer } from "../../layout/Containers"
import useApi from "../../hooks/useApi"
import {
  userService, type user,
  employeeService, type employee, type completeEmployee,
  departmentService, type department,
  jobPositionService, type jobPosition,
  employeeTerminationService,
} from "../../services/nexotic"
import { Spinner } from "../../components/Spinner"
import { parseEmployee, type EmployeeRecords } from "../../utils/parser"
import { Button } from "../../components/Button"
import { closeModal, Modal, openModal } from "../../components/Modal"
import {
  Form,
  TextField,
  Select,
  Option,
  GroupField,
  GroupFieldText,
  mapObjectToFormValues,
  setFormValues,
} from "../../components/Form"
import { isEmail, isPhone } from "../../utils/validator"
import { Card } from "../../components/Card"
import { Badge } from "../../components/Badge"

const newEmployeeModalId = "add-employee-modal"
const deleteEmployeeModalId = "delete-employee-modal"

const employeeFormDefaults = {
  name: "",
  last_name: "",
  email: "",
  phone: "",
  department: "",
  job_position: "",
}

const employeeFormMapper = {
  name: "user.first_name",
  last_name: "user.last_name",
  email: {
    path: "user.email",
    transform: (value: unknown) =>
      String(value || "").replace("@nexotic.com", ""),
  },
  phone: "phone",
  department: {
    path: "job_position.department.id",
    transform: (value: unknown) => String(value ?? ""),
  },
  job_position: {
    path: "job_position.id",
    transform: (value: unknown) => String(value ?? ""),
  },
}

const openAddEmployeeModal = (employee: completeEmployee | null = null) => {
  const modal = document.getElementById(newEmployeeModalId)!
  const isEditMode = !!employee

  modal.setAttribute("data-mode", isEditMode ? "edit" : "create")
  modal.setAttribute("data-employee-id", employee ? String(employee.id) : "")
  
  const updateLables = (isNew: boolean) => {
    modal.querySelector(".modal-title")!.textContent = isNew ? "Registrar nuevo empleado" : "Editar empleado"
    modal.querySelector("button[type='submit']")!.textContent = isNew ? "Registrar" : "Actualizar"
  }

  const setValues = (employee: completeEmployee | null) => {
    const form = modal.querySelector("form")!
    const values = mapObjectToFormValues(
      employee,
      employeeFormMapper,
      employeeFormDefaults
    )

    setFormValues(form, values)
    modal.setAttribute("data-department-value", values.department)
    modal.setAttribute("data-job-position-value", values.job_position)
  }

  updateLables(!employee)
  setValues(employee)
  openModal(newEmployeeModalId)
}

type viewType = "table" | "details"

type allData = {
  users: user[],
  departments: department[],
  jobPositions: jobPosition[],
  employees: employee[],
}

export default function Gestion_Empleados() {
  const [view, setView] = useState<viewType>('table')
  const [requestData, setRequestData] = useState<allData | null>(null)
  const [currentEmployee, setCurrentEmployee] = useState<completeEmployee | null>(null)

  const { data, error, loading, execute } = useApi<[
    user[],
    department[],
    jobPosition[],
    employee[]
  ]>()

  const getData = () => {
    execute(
      userService.get(),
      departmentService.get(),
      jobPositionService.get(),
      employeeService.get(),
    )
  }

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    if (data) {
      const nextRequestData = {
        users: data[0] as user[],
        departments: data[1] as department[],
        jobPositions: data[2] as jobPosition[],
        employees: data[3] as employee[],
      }

      setRequestData(nextRequestData)

      const parsedEmployees = parseEmployee([
        nextRequestData.users,
        nextRequestData.departments,
        nextRequestData.jobPositions,
        nextRequestData.employees,
      ])

      setCurrentEmployee((prev) => {
        if (!prev) return prev
        return parsedEmployees.find((employee) => employee.id === prev.id) || prev
      })
    }

    if (error) {
      alert('Error: ' + error)
      console.error('Error:', error)
    }
  }, [data, error])

  const render = () => {
    switch (view) {
      case 'table':
        return <TableView
          data={requestData}
          loading={loading}
          refreshData={getData}
          goTo={setView}
          setEmployee={setCurrentEmployee}
        />

      case 'details':
        return <DetailsView
          employee={currentEmployee}
          goBack={() => {
            setCurrentEmployee(null)
            getData()
            setView('table')
          }}
        />
      
      default:
        return <Navigate to="/" />
    }
  }

  return (
    <Main>
      {render()}
      <NewEmployeeModal
        departments={requestData?.departments || []}
        jobPositions={requestData?.jobPositions || []}
        refreshData={getData}
      />
    </Main>
  )
}

type TableViewProps = {
  data: allData | null
  loading: boolean
  refreshData: () => void
  goTo: (view: viewType) => void
  setEmployee: (employee: completeEmployee | null) => void
}
function TableView ({
  data,
  loading,
  goTo,
  setEmployee,
}: TableViewProps) {
  const records: EmployeeRecords | null = data
    ? [data.users, data.departments, data.jobPositions, data.employees]
    : null

  const goToDetails = (employee: completeEmployee) => {
    setEmployee(employee)
    goTo('details')
  }

  const trDrawer = (row: completeEmployee) => {
    const name = row.user.first_name
      ? `${row.user.first_name}${row.user.last_name && ` ${row.user.last_name}`}`
      : "-"

    return [
      name,
      row.job_position.department.name || "-",
      row.job_position.name || "-",
      <Badge 
        type={row.enabled ? "primary" : "warning"} 
        text={row.enabled ? "Activo" : "Inactivo"}
      />,
      <Button variant="success" onClick={() => goToDetails(row)}>
        Detalles
      </Button>,
    ]
  }

  return (
    <StackContainer>
      <RowContainer>
        <ColContainer defaultSize={9}>
          <h2>Gestión de Empleados</h2>
        </ColContainer>
        <ColContainer defaultSize={3}>
          <Button fat onClick={() => openAddEmployeeModal()}>
            Nuevo Empleado
          </Button>
        </ColContainer>
      </RowContainer>
      { loading ? <Spinner /> : (
        <Table
          headers={["Nombre", "Departamento", "Puesto", "Estatus", "Acciones"]}
          rows={parseEmployee(records)}
          trDrawer={trDrawer}
        />
      )}
    </StackContainer>
  )
}

type DetailsViewProps = {
  employee: completeEmployee | null
  goBack: () => void
}
function DetailsView ({
  employee,
  goBack,
}: DetailsViewProps) {
  const header = (
    <RowContainer>
      <ColContainer defaultSize={12} md={6}>
        <h2>Detalles del empleado</h2>
      </ColContainer>
      <ColContainer defaultSize={12} md={2}>
        <Button variant="success" onClick={() => openAddEmployeeModal(employee)} fat>
          Editar
        </Button>
      </ColContainer>
      <ColContainer defaultSize={12} md={2}>
        <Button variant="danger" onClick={() => openModal(deleteEmployeeModalId)} fat>
          Eliminar
        </Button>
      </ColContainer>
      <ColContainer defaultSize={12} md={2}>
        <Button variant="secondary" onClick={goBack} fat>
          Volver
        </Button>
      </ColContainer>
    </RowContainer>
  )

  const lastName = employee?.user.last_name
  const employeeName = `${employee?.user.first_name}${lastName && ` ${lastName}`}`
  const summary = (
    <RowContainer>
      <ColContainer defaultSize={6} xl={3}>
        <Card header="Nombre" padding={3}>
          {employeeName}
        </Card>
      </ColContainer>
      <ColContainer defaultSize={6} xl={3}>
        <Card header="Fecha de ingreso" padding={3}>
          {employee?.join_date}
        </Card>
      </ColContainer>
      <ColContainer defaultSize={6} xl={3}>
        <Card header="Departamento" padding={3}>
          {employee?.job_position.department.name}
        </Card>
      </ColContainer>
      <ColContainer defaultSize={6} xl={3}>
        <Card header="Puesto" padding={3}>
          {employee?.job_position.name}
        </Card>
      </ColContainer>
    </RowContainer>
  )

  const rowsHistory = [
    {
      date: "2025-02-01",
      oldDepartment: "RH",
      oldJobPosition: "Analista",
      newDepartment: "Finanzas",
      newJobPosition: "Analista Senior",
    },
    {
      date: "2025-06-15",
      oldDepartment: "Finanzas",
      oldJobPosition: "Analista Senior",
      newDepartment: "Finanzas",
      newJobPosition: "Gerente de Finanzas",
    },
  ]
  const historyTrDrawer = (row: typeof rowsHistory[0]) => [
    row.date,
    row.oldDepartment,
    row.oldJobPosition,
    row.newDepartment,
    row.newJobPosition,
  ]
  const history = (
    <Card header="Historial laboral" padding={3}>
      <Table
        headers={["Fecha de cambio", "Departamento anterior", "Puesto anterior", "Nuevo departamento ", "Nuevo puesto"]}
        rows={rowsHistory}
        trDrawer={historyTrDrawer}
      />
    </Card>
  )

  const rowIncidences = [
    {
      type: "Falta",
      status: "No justificada",
      date: "2025-03-10",
    },
    {
      type: "Tardanza",
      status: "Justificada",
      date: "2025-04-05",
    }
  ]
  const incidenceTrDrawer = (row: typeof rowIncidences[0]) => [
    row.type,
    row.status,
    row.date,
  ]
  const rowHolidays = [
    {
      days: 4,
      status: "Aprobada",
      start: "2025-05-01",
    },
    {
      days: 2,
      status: "Rechazada",
      start: "2025-06-20",
    }
  ]
  const holidaysTrDrawer = (row: typeof rowHolidays[0]) => [
    row.days + ` día${row.days > 1 && "s"}`,
    row.status,
    row.start,
  ]
  const details = (
    <RowContainer>
      <ColContainer defaultSize={12} lg={6}>
        <Card header="Incidencias" padding={3}>
          <Table
            headers={[]}
            rows={rowIncidences}
            trDrawer={incidenceTrDrawer}
          />
        </Card>
      </ColContainer>
      <ColContainer defaultSize={12} lg={6}>
        <Card header="Vacaciones" padding={3}>
          <Table
            headers={[]}
            rows={rowHolidays}
            trDrawer={holidaysTrDrawer}
          />
        </Card>
      </ColContainer>
    </RowContainer>
  )

  return (
    <>
      <StackContainer gap={4}>
        {header}
        {summary}
        {history}
        {details}
      </StackContainer>
      <DeleteEmployeeModal employee={employee!} />
    </>
  )
}

type newEmployeeExpectedData = {
  name: string,
  last_name: string,
  department: string,
  job_position: string,
  phone: string,
  email: string,
}

type NewEmployeeModalProps = {
  departments: department[]
  jobPositions: jobPosition[]
  refreshData: () => void,
}
function NewEmployeeModal ({
  departments,
  jobPositions,
  refreshData,
}: NewEmployeeModalProps) {
  const [currentDepartment, setCurrentDepartment] = useState<number | null>(null)
  const [currentJobPosition, setCurrentJobPosition] = useState<string>("")
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [submittedMode, setSubmittedMode] = useState<"create" | "edit" | null>(null)

  const { execute, loading, error, data } = useApi<any>()

  useEffect(() => {
    const modalElement = document.getElementById(newEmployeeModalId)
    if (!modalElement) return

    const syncSelectStateFromForm = () => {
      const form = modalElement.querySelector("form") as HTMLFormElement | null
      if (!form) return

      const mode = modalElement.getAttribute("data-mode") === "edit" ? "edit" : "create"
      setFormMode(mode)

      const departmentValue = modalElement.getAttribute("data-department-value")
        || (form.querySelector("select[name='department']") as HTMLSelectElement | null)?.value
        || ""
      const jobPositionValue = modalElement.getAttribute("data-job-position-value")
        || (form.querySelector("select[name='job_position']") as HTMLSelectElement | null)?.value
        || ""

      const parsedDepartment = departmentValue ? parseInt(departmentValue, 10) : null
      setCurrentDepartment(Number.isNaN(parsedDepartment as number) ? null : parsedDepartment)
      setCurrentJobPosition(jobPositionValue)
    }

    modalElement.addEventListener("shown.bs.modal", syncSelectStateFromForm)

    return () => {
      modalElement.removeEventListener("shown.bs.modal", syncSelectStateFromForm)
    }
  }, [])

  const validate = (data: newEmployeeExpectedData): string | "ok" => {
    const { name, last_name, department, job_position, phone, email } = data

    if (
      !name ||
      !last_name ||
      !department ||
      !job_position ||
      !phone ||
      !email
    ) {
      return "Todos los campos son obligatorios."
    }

    if (!isPhone(phone)) {
      return "El número de teléfono no es válido. Debe contener entre 7 y 15 dígitos."
    }

    if (!isEmail(email + "@nexotic.com")) {
      return "El correo electrónico no es válido."
    }

    return "ok"
  }

  const onSubmit = async (fd: newEmployeeExpectedData) => {
    const validation = validate(fd)
    if (validation != "ok") {
      return alert(validation)
    }

    const modalElement = document.getElementById(newEmployeeModalId)
    const mode = modalElement?.getAttribute("data-mode") || "create"
    const employeeId = parseInt(modalElement?.getAttribute("data-employee-id") || "", 10)
    const normalizedMode: "create" | "edit" = mode === "edit" ? "edit" : "create"
    setSubmittedMode(normalizedMode)

    if (mode == "edit" && Number.isInteger(employeeId) && employeeId > 0) {
      execute(
        employeeService.update(
          employeeId,
          fd.name,
          fd.last_name,
          parseInt(fd.department, 10),
          fd.email + "@nexotic.com",
          fd.phone,
          parseInt(fd.job_position, 10),
        )
      )
    } else {
      execute(
        employeeService.create(
          fd.name,
          fd.last_name,
          parseInt(fd.department, 10),
          fd.email + "@nexotic.com",
          fd.phone,
          parseInt(fd.job_position, 10),
        )
      )
    }
  }

  useEffect(() => {
    if (!submittedMode) return

    if (data as employee) {
      const successMessage = submittedMode === "edit"
        ? "Empleado actualizado exitosamente."
        : "Empleado registrado exitosamente. El empleado recibirá un correo para configurar su cuenta."

      alert(successMessage)
      refreshData()
      closeModal(newEmployeeModalId)
      setSubmittedMode(null)
      return
    }

    if (error) {
      alert('Error: ' + error)
      console.error('Error:', error)
      setSubmittedMode(null)
    }
  }, [data, error, submittedMode, refreshData])

  const currentDepartmentValue = currentDepartment?.toString() || ""

  const departmentsOptions = [
    <Option key={0} text="Seleccione un departamento" value="" disabled />,
    ...(departments ? departments.map((d) => (
      <Option key={d.id} text={d.name} value={d.id.toString()} />
    )) : [])
  ]

  const filteredJobPositions = jobPositions && currentDepartment
    ? jobPositions.filter((jp) => jp.department == currentDepartment)
    : []

  const jobPositionsOptions = [
    <Option
      key={0}
      text={currentDepartment ? "Seleccione un puesto" : "Seleccione un departamento primero"}
      value=""
      disabled
    />,
    ...filteredJobPositions.map((jp) => (
      <Option key={jp.id} text={jp.name} value={jp.id.toString()} />
    ))
  ]

  return (
    <Modal id={newEmployeeModalId} header="Registrar nuevo empleado" size="lg">
      <Form onSubmit={onSubmit}>
        <StackContainer gap={4}>
          <RowContainer>
            <ColContainer defaultSize={12} lg={6}>
              <TextField name="name" label="Nombre(s)"/>
            </ColContainer>
            <ColContainer defaultSize={12} lg={6}>
              <TextField name="last_name" label="Apellido(s)"/>
            </ColContainer>
          </RowContainer>
          <RowContainer>
            <ColContainer defaultSize={12} lg={6}>
              <GroupField label="Correo electrónico">
                <TextField name="email"/>
                <GroupFieldText text="@nexotic.com" />
              </GroupField>
            </ColContainer>
            <ColContainer defaultSize={12} lg={6}>
              <TextField name="phone" label="Número de teléfono" type="number"/>
            </ColContainer>
          </RowContainer>
          <RowContainer>
            <ColContainer defaultSize={12} lg={6}>
              <Select
                name="department"
                label="Departamento"
                value={currentDepartmentValue}
                options={departmentsOptions}
                onChange={(v) => {
                  const parsedDepartment = v ? parseInt(v, 10) : null
                  setCurrentDepartment(Number.isNaN(parsedDepartment as number) ? null : parsedDepartment)
                  setCurrentJobPosition("")
                }}
              />
            </ColContainer>
            <ColContainer defaultSize={12} lg={6}>
              <Select
                name="job_position"
                label="Puesto"
                disabled={!currentDepartment}
                value={currentJobPosition}
                options={jobPositionsOptions}
                onChange={(v) => setCurrentJobPosition(v)}
              />
            </ColContainer>
          </RowContainer>
          <StackContainer center>
            <Button 
              type="submit"
              h_padding={5}
              isLoading={loading}
            >
              { loading ? <Spinner small /> : (formMode === "edit" ? "Actualizar" : "Registrar") }
            </Button>
          </StackContainer>
        </StackContainer>
      </Form>
    </Modal>
  )
}

type DeleteEmployeeModalProps = {
  employee: completeEmployee
}
function DeleteEmployeeModal ({
  employee,
}: DeleteEmployeeModalProps) {
  const { data, error, execute, loading } = useApi()

  type expectedData = {
    reason: string
    type: string
  }

  const validate = (data: expectedData): string | "ok" => {
    if (!data.reason || !data.type) {
      return "Todos los campos son obligatorios."
    }

    return "ok"
  }

  const onSubmit = (data: expectedData) => {
    const validation = validate(data)
    if (validation != "ok") {
      return alert(validation)
    }

    execute(
      employeeTerminationService.create(
        employee.id,
        data.type,
        data.reason,
      )
    )
  }

  useEffect(() => {
    if (data) {
      console.log("Empleado eliminado:", data)
    }
    if (error) {
      alert('Error: ' + error)
      console.error('Error:', error)
    }
  }, [data, error])

  return (
    <Modal id={deleteEmployeeModalId} header="Dar de baja empleado">
      <Form onSubmit={onSubmit}>
        <StackContainer gap={4}>
          <div>
            <TextField name="type" label="Tipo de baja"/>
          </div>
          <div>
            <TextField name="reason" label="Motivo de baja" type="area"/>
          </div>
          <StackContainer center>
            <Button
              variant="danger"
              isLoading={loading}
              type="submit"
              h_padding={5}
            >
              Eliminar
            </Button>
          </StackContainer>
        </StackContainer>
      </Form>
    </Modal>
  )
}
