import { type ReactNode } from "react"

type CanvasProps = {
  id?: string
  title: string
  children?: ReactNode
}
export function Canvas({
  id = "canvas",
  title,
  children
}: CanvasProps) {
  return (
    <div className="offcanvas offcanvas-start show" tabIndex={-1} id={id} aria-labelledby={`${id}Label`}>
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
