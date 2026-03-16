import { type ReactNode } from "react"

import { Modal as BSModal } from "bootstrap"

type ModalProps = {
  id?: string
  header?: ReactNode
  children: ReactNode,
  footer?: ReactNode
  isStatic?: boolean
  size?: "sm" | "lg" | "xl"
} 
export function Modal({
  id = "modal",
  header,
  children,
  footer,
  isStatic,
  size
}: ModalProps) {
  return (
    <div 
      className="modal fade"
      id={id}
      tabIndex={-1}
      aria-labelledby={id + "Label"}
      aria-hidden="true"
      {...(isStatic && { "data-bs-backdrop": "static", "data-bs-keyboard": "false" })}
    >
      <div className={`modal-dialog${size ? " modal-" + size : ""}`}>
        <div className="modal-content">
          <div className="modal-header">
            {header && <h2 className="modal-title">{header}</h2>}
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

export function openModal(id: string) {
  const modalElement = document.getElementById(id)
  if (modalElement) {
    BSModal.getOrCreateInstance(modalElement).show()
  }
}

export function closeModal(id: string) {
  const modalElement = document.getElementById(id)
  if (modalElement) {
    BSModal.getOrCreateInstance(modalElement).hide()
  }
}
