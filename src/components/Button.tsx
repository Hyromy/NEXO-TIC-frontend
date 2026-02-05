import { type ReactNode } from "react"

import { type variants } from "./variants"

type ButtonProps = {
  children: ReactNode
  variant?: variants
  onClick?: () => void
}
export function Button({
  children,
  variant = "primary",
  onClick
}: ButtonProps) {
  return (
    <button type="button" className={"btn btn-" + variant} onClick={onClick}>
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
