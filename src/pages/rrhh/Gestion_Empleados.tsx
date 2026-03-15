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
  GroupFieldText
} from "../../components/Form"
import { isEmail, isPhone } from "../../utils/validator"

type viewType = 'table'

type allData = {
  users: user[],
  departments: department[],
  jobPositions: jobPosition[],
  employees: employee[],
}

export default function Gestion_Empleados() {
  const [view] = useState<viewType>('table')

  const [requestData, setRequestData] = useState<allData | null>(null)

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
      setRequestData({
        users: data[0] as user[],
        departments: data[1] as department[],
        jobPositions: data[2] as jobPosition[],
        employees: data[3] as employee[],
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
        />
      
      default:
        return <Navigate to="/" />
    }
  }

  return (
    <Main>
      {render()}
    </Main>
  )
}

type TableViewProps = {
  data: allData | null
  loading: boolean
  refreshData: () => void
}
function TableView ({
  data,
  loading,
  refreshData,
}: TableViewProps) {
  const records: EmployeeRecords | null = data
    ? [data.users, data.departments, data.jobPositions, data.employees]
    : null

  const trDrawer = (row: completeEmployee) => {
    const name = row.user.first_name
      ? `${row.user.first_name}${row.user.last_name && ` ${row.user.last_name}`}`
      : "-"

    return [
      name,
      row.job_position.department.name || "-",
      row.job_position.name || "-",
      row.enabled ? "Activo" : "Inactivo",
      <StackContainer orientation="row">
        <Button variant="success">
          Editar
        </Button>
        <Button variant="info">
          Detalles
        </Button>
      </StackContainer>,
    ]
  }

  const addEmployeeModalId = "add-employee-modal"

  return (
    <>
      <StackContainer>
        <RowContainer>
          <ColContainer defaultSize={9}>
            <h2>Gestión de Empleados</h2>
          </ColContainer>
          <ColContainer defaultSize={3}>
            <Button fat onClick={() => openModal(addEmployeeModalId)}>
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
      <NewEmployeeModal
        id={addEmployeeModalId}
        data={data}
        refreshData={refreshData}
      />
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
  id: string,
  data: allData | null
  refreshData: () => void,
}
function NewEmployeeModal ({
  id,
  data,
  refreshData,
}: NewEmployeeModalProps) {
  const [currentDepartment, setCurrentDepartment] = useState<number | null>(null)
  const [currentJobPosition, setCurrentJobPosition] = useState<string>("")

  const { execute, loading, error, data: apiData } = useApi<any>()

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

  useEffect(() => {
    if (apiData as employee) {
      console.log("Empleado creado:", apiData)

      alert("Empleado registrado exitosamente. El empleado recibirá un correo para configurar su cuenta.")
      refreshData()
      closeModal(id)
    }

    if (error) {
      alert('Error: ' + error)
      console.error('Error:', error)
    }
  }, [apiData, error])

  const currentDepartmentValue = currentDepartment?.toString() || ""

  const departmentsOptions = [
    <Option key={0} text="Seleccione un departamento" value="" disabled />,
    ...(data ? data.departments.map((d) => (
      <Option key={d.id} text={d.name} value={d.id.toString()} />
    )) : [])
  ]

  const filteredJobPositions = data && currentDepartment
    ? data.jobPositions.filter((jp) => jp.department == currentDepartment)
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
    <Modal id={id} header="Registrar nuevo empleado" size="lg">
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
              { loading ? <Spinner small /> : "Registrar" }
            </Button>
          </StackContainer>
        </StackContainer>
      </Form>
    </Modal>
  )
}
