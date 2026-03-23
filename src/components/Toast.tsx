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
/**
 * Toast component to display a notification.
 *
 * @example
 * <Toast id="my-toast">
 *   <p>Hello, world!</p>
 * </Toast>
 *
 * @param id - The unique identifier for the toast.
 * @param children - The content to be displayed in the toast.
 * @param autohide - Whether the toast should automatically hide. Default is true.
 * @param delay - The delay before the toast automatically hides. Default is 5000.
 * @param variant - The color variant of the toast. Default is "primary".
 * @param header - The header content for the toast. Default is undefined.
 */
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
/**
 * Toast container component to hold and position toasts.
 * 
 * @example
 * <ToastContainer>
 *   <Toast id="my-toast">
 *     <p>Hello, world!</p>
 *   </Toast>
 * </ToastContainer>
 * 
 * @param children - The toast components to be displayed inside the container.
 * @param position - The position of the toast container on the screen. Default is "bottom-end".
 */
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

/**
 * Function to programmatically show a toast by its id.
 * 
 * @example
 * showToast("my-toast")
 * 
 * @param id - The unique identifier of the toast to be shown.
 */
export function showToast(id: string) {
  const el = document.getElementById(id)
  if (!el) throw new Error(`Toast with id "${id}" not found`)
  BSToast.getOrCreateInstance(el).show()
}

/**
 * Function to programmatically hide a toast by its id.
 * 
 * @example
 * hideToast("my-toast")
 * 
 * @param id - The unique identifier of the toast to be hidden.
 */
export function hideToast(id: string) {
  const el = document.getElementById(id)
  if (!el) throw new Error(`Toast with id "${id}" not found`)
  BSToast.getOrCreateInstance(el).hide()
}
