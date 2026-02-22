import { type ReactNode } from "react"

import { Offcanvas } from "bootstrap"

type placement = "start" | "end" | "top" | "bottom"

type CanvasProps = {
  id: string
  title: string
  children?: ReactNode
  isStatic?: boolean
  scrolling?: boolean
  notBackdrop?: boolean
  placement?: placement
}
export function Canvas({
  id,
  title,
  children,
  isStatic,
  scrolling,
  notBackdrop,
  placement = "start"
}: CanvasProps) {
  return (
    <div 
      className={`offcanvas offcanvas-${placement}`}
      tabIndex={-1}
      id={id}
      aria-labelledby={`${id}Label`}
      {...(isStatic && { "data-bs-backdrop": "static", "data-bs-keyboard": "false" })}
      {...(scrolling && { "data-bs-scroll": "true" })}
      {...(notBackdrop && { "data-bs-backdrop": "false" })}
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id={`${id}Label`}>
          {title}
        </h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div className="offcanvas-body">
        {children}
      </div>
    </div>
  )
}

export function openCanvas(id: string) {
  const canvas = document.getElementById(id)
  if (canvas) {
    Offcanvas.getOrCreateInstance(canvas).show()
  }
}

export function closeCanvas(id: string) {
  const canvas = document.getElementById(id)
  if (canvas) {
    Offcanvas.getOrCreateInstance(canvas).hide()
  }
}

