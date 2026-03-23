import { type ReactNode } from "react"

import { type variants } from "./variants"

type buttonTypes = "button" | "submit" | "reset"
type size = "sm" | "lg"
type padding = 0 | 1 | 2 | 3 | 4 | 5

export type ButtonProps = {
  children: ReactNode
  type?: buttonTypes
  variant?: variants
  fat?: boolean
  isLoading?: boolean
  position?: "relative"
  outLine?: boolean
  size?: size
  h_padding?: padding
  onClick?: () => void
}
/**
 * Button component. Used to trigger an action or navigate to another page. It can be a submit button, a reset button or a regular button.
 * 
 * @example
 * <Button variant="success" onClick={() => alert("Button clicked!")}>
 *   Click Me
 * </Button>
 * 
 * @param children - The content of the button. Can be text or any ReactNode.
 * @param type - The type of the button. Can be "button", "submit" or "reset". Default is "button".
 * @param variant - The color variant of the button. Can be "primary", "secondary", "success", "danger", "warning", "info", "light" or "dark". Default is "primary".
 * @param fat - If true, the button will take the full width of its container. Default is false (width is determined by content).
 * @param isLoading - If true, the button will be disabled and show a loading spinner. Default is false.
 * @param position - If provided, the button will have the specified CSS position property. Default is undefined (static positioning).
 * @param outLine - If true, the button will use the outline variant of the specified color. Default is false (solid color).
 * @param size - The size of the button. Can be "sm" for small or "lg" for large. Default is undefined (normal size).
 * @param h_padding - The horizontal padding of the button. Can be 0, 1, 2, 3, 4 or 5 (corresponding to Bootstrap's spacing scale). Default is undefined (Bootstrap's default padding).
 * @param onClick - The function to call when the button is clicked. Default is undefined (no action).
 */
export function Button({
  children,
  type = "button",
  variant = "primary",
  fat,
  isLoading,
  position,
  outLine,
  size,
  h_padding,
  onClick,
}: ButtonProps) {
  let classes = `btn btn-${outLine ? "outline-" : ""}${variant}`
  if (fat) classes += " w-100"
  if (isLoading) classes += " disabled"
  if (position) classes += ` position-${position}`
  if (size) classes += ` btn-${size}`
  if (h_padding != null) classes += ` px-${h_padding}`

  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  )
}

type ButtonGroupProps = {
  children: ReactNode
  size?: size
  vertical?: boolean
}
/**
 * ButtonGroup component. Used to group multiple buttons together. It can be a horizontal or vertical group.
 * 
 * @example
 * <ButtonGroup size="lg">
 *   <Button variant="primary">Button 1</Button>
 *   <Button variant="secondary">Button 2</Button>
 * </ButtonGroup>
 * 
 * @param children - The buttons to group together. Should be one or more Button components.
 * @param size - The size of the buttons in the group. Can be "sm" for small or "lg" for large. Default is undefined (normal size).
 * @param vertical - If true, the buttons will be stacked vertically. Default is false (buttons are arranged horizontally).
 */
export function ButtonGroup({
  children,
  size,
  vertical,
}: ButtonGroupProps) {
  let classes = `btn-group${vertical ? "-vertical" : ""}`
  if (size) classes += ` btn-group-${size}`

  return (
    <div className={classes} role="group">
      {children}
    </div>
  )
}

/**
 * Utility function to trigger a file download in the browser. It creates a temporary anchor element, sets its href to the specified file path, and programmatically clicks it to start the download. After the click, the anchor element is removed from the DOM.
 * 
 * @example
 * downloadFile("files/report.pdf", "report.pdf")
 * 
 * @param path - The relative path to the file to be downloaded. This should be a valid URL or a path to a file on the server.
 * @param filename - The name that the downloaded file should have. This is the value that will be set in the "download" attribute of the anchor element, which suggests a default filename for the downloaded file.
 */
export function downloadFile(path: string, filename: string) {
  const link = document.createElement('a')
  link.href = "/" + path
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
