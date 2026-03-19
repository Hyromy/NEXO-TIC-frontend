import {
  type ReactNode,
  useEffect,
  useRef,
} from "react"
import { Popover as BSPopover } from "bootstrap"

type PopoverProps = {
  children: ReactNode
  title?: string
  content: string
  placement?: "top" | "bottom" | "left" | "right"
  trigger?: "click" | "hover" | "focus" | "manual"
  html?: boolean
}
/**
 * Popover component using Bootstrap 5. To trigger the popover, use the showPopover and hidePopover functions with the corresponding element.
 * 
 * @example
 * <Popover
 *   title="Meaning"
 *   content="Modal is a dialog that appears on top of the current page."
 * >
 *   <Badge text="use a modal" />
 * </Popover>
 * 
 * @param children - The element that will trigger the popover.
 * @param title - The title of the popover.
 * @param content - The content of the popover.
 * @param placement - The placement of the popover, can be "top", "bottom", "left", or "right". Default is "top".
 * @param trigger - The trigger for the popover, can be "click", "hover", "focus", or "manual". Default is "click".
 * @param html - If true, the content will be treated as HTML. Default is false.
 */
export function Popover({
  children,
  title,
  content,
  placement = "top",
  trigger = "click",
  html = false,
}: PopoverProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const popover = new BSPopover(ref.current, {
      title,
      content,
      placement,
      trigger,
      html,
    })

    return () => popover.dispose()
  }, [title, content, placement, trigger, html])

  return (
    <span ref={ref}>
      {children}
    </span>
  )
}

/**
 * Function to show the popover. It can be used in an event handler to show the popover when a certain event occurs (e.g., onClick, onMouseEnter, etc.).
 * 
 * @example
 * const pop = useRef<HTMLSpanElement>(null)
 * 
 * <Popover content="This is a popover" ref={pop}>
 * 
 * <Button onClick={() => showPopover(pop.current!)}>Show Popover</Button>
 * 
 * @param element - The HTML element that triggers the popover. This should be the same element that is used as the trigger in the Popover component. 
 */
export function showPopover(element: HTMLElement) {
  BSPopover.getOrCreateInstance(element).show()
}

/**
 * Function to hide the popover. It can be used in an event handler to hide the popover when a certain event occurs (e.g., onClick, onMouseLeave, etc.).
 * 
 * @example
 * const pop = useRef<HTMLSpanElement>(null)
 * 
 * <Popover content="This is a popover" ref={pop}>
 * 
 * <Button onClick={() => hidePopover(pop.current!)}>Hide Popover</Button>
 * 
 * @param element - The HTML element that triggers the popover. This should be the same element that is used as the trigger in the Popover component.
 */
export function hidePopover(element: HTMLElement) {
  BSPopover.getOrCreateInstance(element).hide()
}
