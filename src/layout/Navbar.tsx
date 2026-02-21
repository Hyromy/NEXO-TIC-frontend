import { useEffect, type ReactNode } from "react"

import { getHumanName } from "../utils/getters"
import { clearTokens } from "../utils/setters"

import { useAuth } from "../context/Auth"

import { Dropdown } from "../components/Dropdown"
import { Button } from "../components/Button"
import { Modal, openModal, closeModal } from "../components/Modal"
import { StackContainer } from "./Containers"
import { Form, PasswordField } from "../components/Form"
import { Spinner } from "../components/Spinner"
import useApi from "../hooks/useApi"
import { authService } from "../services/nexotic"

type NavbarGroupProps = {
  children?: ReactNode
  gap?: number
}
function NavbarGroup({
  children,
  gap = 2
}: NavbarGroupProps) {
  return (
    <div className={`navbar-group d-flex align-items-center gap-${gap}`}>
      {children}
    </div>
  )
}

export default function Navbar() {
  const { logout, checkAuth } = useAuth()

  const logoutHandler = () => {
    const confirmation = confirm("¿Estás seguro que quieres cerrar sesión?")
    if (confirmation) {
      logout()
      clearTokens()
      checkAuth()
    }
  }

  const changePasswordModalId = "changePasswordModal"

  const dropdownItems = [
    <Button
      variant="secondary"
      onClick={() => openModal(changePasswordModalId)}
      fat
    >
      Cambiar contraseña
    </Button>,
    <Button
      variant="danger"
      onClick={logoutHandler}
      fat
    >
      Cerrar sesión 
    </Button>
  ]

  return (
    <>
      <nav className="navbar bg-body-tertiary navbar-expand-sm px-0 sticky-top">
        <div className="container-xxl d-flex justify-content-between align-items-center">
          <button
            className="btn d-md-none mx-2 p-0"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#menuCanvas"
            aria-controls="menuCanvas"
          >
            <i className="bi bi-list fs-3"></i>
          </button>
          <NavbarGroup />
          <NavbarGroup>
            <Dropdown items={dropdownItems} variant="light" inverted>
              <i className="bi bi-person-circle me-2"></i>
              Hola {getHumanName()}
            </Dropdown>
          </NavbarGroup>
        </div>
      </nav>
      <ThisModal id={changePasswordModalId} />
    </>
  )
}

const validateData = (data: expectedData) => {
  const { password, password2 } = data
  if (password != password2) {
    return "Las contraseñas no coinciden"
  }
  
  return "ok"
}

type expectedData = {
  password: string
  password2: string
}

function ThisModal({ id }: { id: string }) {
  const { data, error, execute, loading } = useApi<any>()

  useEffect(() => {
    if (data) {
      closeModal(id)
      alert("Contraseña cambiada exitosamente")
    }
    if (error) {
      console.error(error)
      alert("Error cambiando contraseña")
    }
  }, [data, error, id])

  const submitHandler = (data: expectedData) => {
    const validation = validateData(data)
    if (validation != "ok") {
      alert(validation)
      return
    }

    execute(authService.changePassword(data.password))
  }

  return (
    <Modal 
      id={id}
      header={<h1 className="modal-title fs-5" id={id + "Label"}>Cambiar contraseña</h1>}
      isStatic
      size="sm"
    >
      <Form onSubmit={submitHandler}>
        <StackContainer gap={4}>
          <div>
            <PasswordField name="password" label="Nueva contraseña" />
          </div>
          <div>
            <PasswordField name="password2" label="Confirmar nueva contraseña" />
          </div>
          <Button type="submit" isLoading={loading} fat>
            {
              loading
                ? <Spinner small />
                : "Cambiar contraseña"
            }
          </Button>
        </StackContainer>
      </Form>
    </Modal>
  )
}
