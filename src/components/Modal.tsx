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
/**
 * Modal component using Bootstrap 5. To trigger the modal, use the openModal function with the corresponding id.
 * 
 * @example
 * <Modal id="myModal" header="My Modal" footer="Footer Content">
 *   <p>Modal content goes here.</p>
 * </Modal>
 *
 * @param id - The id of the modal, used for triggering it.
 * @param header - The content to be displayed in the modal header.
 * @param children - The content to be displayed in the modal body.
 * @param footer - The content to be displayed in the modal footer.
 * @param isStatic - If true, the modal will not close when clicking outside of it or pressing the escape key.
 * @param size - The size of the modal, can be "sm", "lg", or "xl". 
 */
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

/**
 * Function to open a modal by its id. Make sure the modal component is rendered in the DOM before calling this function.
 * 
 * @example
 * const modalId = "myModal"
 * 
 * <Modal id={modalId} header="My Modal" footer="Footer Content">
 *   <p>Modal content goes here.</p>
 * </Modal>
 * 
 * <Button onClick={() => openModal(modalId)}>
 *   Open Modal
 * </Button>
 * 
 * @param id - The id of the modal to be opened.
 */
export function openModal(id: string) {
  const modalElement = document.getElementById(id)
  if (modalElement) {
    BSModal.getOrCreateInstance(modalElement).show()
  }
}

/**
 * Function to close a modal by its id. Make sure the modal component is rendered in the DOM before calling this function.
 * 
 * @example
 * const modalId = "myModal"
 * 
 * <Modal id={modalId} header="My Modal" footer="Footer Content">
 *   <p>Modal content goes here.</p>
 * </Modal>
 * 
 * <Button onClick={() => closeModal(modalId)}>
 *   Close Modal
 * </Button>
 * 
 * @param id - The id of the modal to be closed.
 */
export function closeModal(id: string) {
  const modalElement = document.getElementById(id)
  if (modalElement) {
    BSModal.getOrCreateInstance(modalElement).hide()
  }
}
