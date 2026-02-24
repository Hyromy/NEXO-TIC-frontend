import { type ReactNode, isValidElement } from "react"
import { createRoot } from "react-dom/client"

import { type variants } from "./variants"

type icon = "success" | "info" | "warning" | "error"

const icons: Record<icon, { className: string, label: string }> = {
  success: { className: "bi bi-check-circle-fill", label: "Success:" },
  info:    { className: "bi bi-info-circle-fill",  label: "Info:" },
  warning: { className: "bi bi-exclamation-triangle-fill", label: "Warning:" },
  error:   { className: "bi bi-x-circle-fill",     label: "Danger:" },
}

type AlertProps = {
  children?: ReactNode
  type?: variants
  notDismissible?: boolean
  icon?: icon
}
export function Alert({
  children,
  type = "primary",
  notDismissible,
  icon,
}: AlertProps) {
  return (
    <div className={`alert alert-${type}${!notDismissible ? " alert-dismissible" : ""}${icon ? " d-flex align-items-center" : ""} fade show`} role="alert">
      {icon && (
        <i className={`${icons[icon].className} flex-shrink-0 me-2`} role="img" aria-label={icons[icon].label}></i>
      )}
      <div>{children}</div>
      {!notDismissible && (
        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      )}
    </div>
  )
}

type AlertLinkProps = {
  href?: string
  text: string
  newWindow?: boolean
}
export function AlertLink({
  href = "#",
  text,
  newWindow
}: AlertLinkProps) {
  return (
    <a href={href} className="alert-link" target={newWindow ? "_blank" : undefined}>{text}</a>
  )
}

export function launchAlert(containerId: string, alert: ReactNode) {
  const placeholder = document.getElementById(containerId)
  if (!placeholder) throw new Error(`Container with ID "${containerId}" not found.`)

  if (!(isValidElement(alert) && alert.type == Alert)) throw new Error("The alert must be a valid React element of type Alert.")

  const wrapper = document.createElement("div")
  placeholder.appendChild(wrapper)

  const root = createRoot(wrapper)
  root.render(alert)
}
