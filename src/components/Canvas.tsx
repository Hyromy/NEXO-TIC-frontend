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
/**
 * Canvas component. Used to display a sidebar that can be toggled. It can be placed on the left, right, top or bottom of the screen.
 * 
 * @example
 * <Canvas id="myCanvas" title="My Canvas" placement="end">
 *   <p>This is the content of the canvas.</p>
 * </Canvas>
 * 
 * @param id - The id of the canvas. This is used to target the canvas when opening or closing it.
 * @param title - The title of the canvas. This is displayed in the header of the canvas.
 * @param children - The content of the canvas. This can be any ReactNode.
 * @param isStatic - If true, the canvas will not close when clicking outside of it or pressing the escape key. Default is false (canvas can be closed by clicking outside or pressing escape).
 * @param scrolling - If true, the body of the canvas will be scrollable when the content exceeds the height of the viewport. Default is false (body is not scrollable).
 * @param notBackdrop - If true, the canvas will not have a backdrop. Default is false (canvas has a backdrop).
 * @param placement - The placement of the canvas on the screen. Can be "start" (left), "end" (right), "top" or "bottom". Default is "start" (left).
 */
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

/**
 * Function to programmatically open a canvas by its id. It uses the Bootstrap Offcanvas JavaScript API to show the canvas. The function first retrieves the canvas element by its id, then creates an instance of the Offcanvas class for that element (or retrieves the existing instance if it already exists) and calls the show() method to display the canvas.
 * 
 * @example
 * <Canvas id="myCanvas" title="My Canvas">
 *   <p>This is the content of the canvas.</p>
 * </Canvas>
 * 
 * // To open the canvas programmatically, you can call the openCanvas function with the id of the canvas:
 * openCanvas("myCanvas")
 * 
 * @param id - The id of the canvas to open. This should match the id prop of the Canvas component you want to open.
 */
export function openCanvas(id: string) {
  const canvas = document.getElementById(id)
  if (canvas) {
    Offcanvas.getOrCreateInstance(canvas).show()
  }
}

/**
 * Function to programmatically close a canvas by its id. It uses the Bootstrap Offcanvas JavaScript API to hide the canvas. The function first retrieves the canvas element by its id, then creates an instance of the Offcanvas class for that element (or retrieves the existing instance if it already exists) and calls the hide() method to close the canvas.
 * 
 * @example
 * <Canvas id="myCanvas" title="My Canvas">
 *   <p>This is the content of the canvas.</p>
 * </Canvas>
 * 
 * // To close the canvas programmatically, you can call the closeCanvas function with the id of the canvas:
 * closeCanvas("myCanvas")
 * 
 * @param id - The id of the canvas to close. This should match the id prop of the Canvas component you want to close.
 */
export function closeCanvas(id: string) {
  const canvas = document.getElementById(id)
  if (canvas) {
    Offcanvas.getOrCreateInstance(canvas).hide()
  }
}
