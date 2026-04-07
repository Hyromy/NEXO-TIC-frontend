import {
  type ReactNode,
  isValidElement,
  useEffect,
  useRef
} from "react"
import { createRoot } from "react-dom/client"
import { Alert as BSAlert } from "bootstrap"

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
  timeout?: number | false
}
export function Alert({
  children,
  type = "primary",
  notDismissible,
  icon,
  timeout = 5000,
}: AlertProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (timeout && ref.current) {
      const timer = setTimeout(() => {
        BSAlert.getOrCreateInstance(ref.current!).close()
      }, timeout)
      return () => clearTimeout(timer)
    }
  }, [timeout])

  return (
    <div ref={ref} className={`alert alert-${type}${!notDismissible ? " alert-dismissible" : ""}${icon ? " d-flex align-items-center" : ""} fade show`} role="alert">
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
export function launchAlert(
  containerId: string,
  alert: ReactNode,
  clear: boolean = false,
  limit: number = 5,
) {
  const placeholder = document.getElementById(containerId)

  if (!placeholder) throw new Error(`Container with ID "${containerId}" not found.`)
  if (!(isValidElement(alert) && alert.type == Alert)) throw new Error("The alert must be a valid React element of type Alert.")
  if (clear) placeholder.innerHTML = ""
  if (limit <= placeholder.children.length) placeholder.removeChild(placeholder.firstElementChild!)

  const wrapper = document.createElement("div")
  placeholder.appendChild(wrapper)

  const root = createRoot(wrapper)
  root.render(alert)
}
