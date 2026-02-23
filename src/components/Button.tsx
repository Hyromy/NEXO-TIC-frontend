import { type ReactNode } from "react"

import { type variants } from "./variants"

type buttonTypes = "button" | "submit" | "reset"

type ButtonProps = {
  children: ReactNode
  type?: buttonTypes
  variant?: variants
  fat?: boolean
  isLoading?: boolean
  onClick?: () => void
}
export function Button({
  children,
  type = "button",
  variant = "primary",
  fat,
  isLoading,
  onClick,
}: ButtonProps) {
  return (
    <button type={type} className={"btn btn-" + variant + (fat ? " w-100" : "") + (isLoading ? " disabled" : "")} onClick={onClick}>
      {children}
    </button>
  )
}

type ButtonGroupProps = {
  children: ReactNode
}
export function ButtonGroup({
  children
}: ButtonGroupProps) {
  return (
    <div className="btn-group" role="group">
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
