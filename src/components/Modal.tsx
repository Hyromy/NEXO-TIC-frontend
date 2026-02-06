import { type ReactNode } from "react"

type ModalProps = {
  id?: string
  header?: ReactNode
  children: ReactNode,
  footer?: ReactNode
} 
export function Modal({
  id = "modal",
  header,
  children,
  footer
}: ModalProps) {
  return (
    <div className="modal fade" id={id} tabIndex={-1} aria-labelledby={id + "Label"} aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            {header && header}
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {children}
          </div>
          {
            footer && (
              <div className="modal-footer">
                {footer}
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
