import { type ReactNode } from "react"

import { type variants } from "./variants"

type buttonTypes = "button" | "submit" | "reset"
type size = "sm" | "lg"

type ButtonProps = {
  children: ReactNode
  type?: buttonTypes
  variant?: variants
  fat?: boolean
  isLoading?: boolean
  position?: "relative"
  outLine?: boolean
  size?: size
  onClick?: () => void
}
export function Button({
  children,
  type = "button",
  variant = "primary",
  fat,
  isLoading,
  position,
  outLine,
  size,
  onClick,
}: ButtonProps) {
  let classes = `btn btn-${outLine ? "outline-" : ""}${variant}`
  if (fat) classes += " w-100"
  if (isLoading) classes += " disabled"
  if (position) classes += ` position-${position}`
  if (size) classes += ` btn-${size}`

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

export function downloadFile(path: string, filename: string) {
  const link = document.createElement('a')
  link.href = "/" + path
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
