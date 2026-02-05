import { type ReactNode } from "react"

import { type variants } from "./variants"

type ToastProps = {
  variant?: variants
  children: ReactNode
}
export function Toast({
  variant,
  children
}: ToastProps) {
  return (
    <div className={`toast align-items-center ${variant ? `text-bg-${variant} border-0` : ""}`} role="alert" aria-live="assertive" aria-atomic="true">
      <div className="d-flex">
        <div className="toast-body">
          {children}
        </div>
        <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  )
}
