import { type ReactNode, isValidElement } from "react"
import { createRoot } from "react-dom/client"

import { type variants, type icons } from "./variants"

const _icons: Record<icons, { className: string, label: string }> = {
  success: { className: "bi bi-check-circle-fill", label: "Success:" },
  info:    { className: "bi bi-info-circle-fill",  label: "Info:" },
  warning: { className: "bi bi-exclamation-triangle-fill", label: "Warning:" },
  error:   { className: "bi bi-x-circle-fill",     label: "Danger:" },
}

type AlertProps = {
  children?: ReactNode
  type?: variants
  notDismissible?: boolean
  icon?: icons
}
/**
 * Alert component that displays a message to the user. It can be dismissible or not, and can optionally include an icon corresponding to the alert type.
 * 
 * @example
 * <Alert type="success" icon="success">
 *   This is a success alert with an icon and a close button.
 * </Alert>
 * 
 * @param children - The content of the alert. Can be text or any ReactNode.
 * @param type - The type of the alert. Can be "primary", "secondary", "success", "danger", "warning", "info", "light" or "dark". Default is "primary".
 * @param notDismissible - If true, the alert will not have a close button and cannot be dismissed by the user. Default is false.
 * @param icon - If provided, an icon corresponding to the alert type will be displayed on the left side of the alert. Default is undefined (no icon).
 */
export function Alert({
  children,
  type = "primary",
  notDismissible,
  icon,
}: AlertProps) {
  return (
    <div className={`alert alert-${type}${!notDismissible ? " alert-dismissible" : ""}${icon ? " d-flex align-items-center" : ""} fade show`} role="alert">
      {icon && (
        <i className={`${_icons[icon].className} flex-shrink-0 me-2`} role="img" aria-label={_icons[icon].label}></i>
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
/**
 * 
 * @example
 * <Alert type="info">
 *   Navigate to other 
 *   <AlertLink href="https://www.example.com" text="site" newWindow />
 * </Alert>
 * 
 * @param href - The URL that the link points to. Default is "#".
 * @param text - The text to display for the link.
 * @param newWindow - If true, the link will open in a new window. Default is false (opens in the same window).
 */
export function AlertLink({
  href = "#",
  text,
  newWindow
}: AlertLinkProps) {
  return (
    <a href={href} className="alert-link" target={newWindow ? "_blank" : undefined}>{text}</a>
  )
}

/**
 * Launches a new alert in the specified container. The alert must be a valid React element of type Alert.
 * 
 * @example
 * function SomeComponent() {
 *   const idContainer = "container"
 * 
 *   launchAlert(
 *     idContainer,
 *     <Alert>Page Loaded</Alert>
 *   )
 * 
 *   return (
 *    <div id={idContainer}></div>
 *   )
 * }
 * 
 * @param containerId 
 * @param alert 
 */
export function launchAlert(containerId: string, alert: ReactNode) {
  const placeholder = document.getElementById(containerId)
  if (!placeholder) throw new Error(`Container with ID "${containerId}" not found.`)

  if (!(isValidElement(alert) && alert.type == Alert)) throw new Error("The alert must be a valid React element of type Alert.")

  const wrapper = document.createElement("div")
  placeholder.appendChild(wrapper)

  const root = createRoot(wrapper)
  root.render(alert)
}
