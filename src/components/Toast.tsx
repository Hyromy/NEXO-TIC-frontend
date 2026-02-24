import {
  type ReactNode,
  useEffect,
  useRef
} from "react"
import { Toast as BSToast } from "bootstrap"

import { type variants } from "./variants"

type ToastProps = {
  id: string
  children: ReactNode
  autohide?: boolean
  delay?: number
  variant?: variants
  header?: ReactNode
}
export function Toast({
  id,
  children,
  autohide = true,
  delay = 5000,
  variant,
  header,
}: ToastProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const toast = new BSToast(ref.current, { autohide, delay })
    return () => toast.dispose()
  }, [autohide, delay])

  if (variant && !header) {
    return (
      <div
        id={id}
        ref={ref}
        className={`toast align-items-center text-bg-${variant} border-0`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex">
          <div className="toast-body">
            {children}
          </div>
          <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    )
  }

  return (
    <div
      id={id}
      ref={ref}
      className="toast"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      {header && (
        <div className="toast-header">
          {header}
          <button type="button" className="btn-close ms-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      )}
      <div className="toast-body">
        {children}
        {!header && (
          <div className="mt-2 pt-2 border-top">
            <button type="button" className="btn btn-primary btn-sm">Take action</button>
            <button type="button" className="btn btn-secondary btn-sm ms-1" data-bs-dismiss="toast">Close</button>
          </div>
        )}
      </div>
    </div>
  )
}

type ToastContainerProps = {
  children: ReactNode
  position?: "top-start" | "top-center" | "top-end" | "middle-start" | "middle-center" | "middle-end" | "bottom-start" | "bottom-center" | "bottom-end"
}
export function ToastContainer({
  children,
  position = "bottom-end"
}: ToastContainerProps) {
  return (
    <div className={`toast-container position-fixed p-3 ${position}`}>
      {children}
    </div>
  )
}

export function showToast(id: string) {
  const el = document.getElementById(id)
  if (!el) throw new Error(`Toast with id "${id}" not found`)
  BSToast.getOrCreateInstance(el).show()
}

export function hideToast(id: string) {
  const el = document.getElementById(id)
  if (!el) throw new Error(`Toast with id "${id}" not found`)
  BSToast.getOrCreateInstance(el).hide()
}
