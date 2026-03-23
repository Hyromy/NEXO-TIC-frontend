import {
  type ReactNode,
  useEffect,
  useRef
} from "react"
import { Tooltip as BSTooltip } from "bootstrap"

type TooltipProps = {
  children: ReactNode
  title: string
  placement?: "top" | "bottom" | "left" | "right"
  trigger?: "hover" | "focus" | "click" | "manual"
}
/**
 * Tooltip component to display a hint or description.
 * 
 * @example
 * <Tooltip title="This is a tooltip" placement="top">
 *   Hover me
 * </Tooltip>
 * 
 * @param children - The element that will trigger the tooltip.
 * @param title - The content of the tooltip.
 * @param placement - The position of the tooltip relative to the trigger element. Default is "top".
 * @param trigger - The event that will trigger the tooltip. Default is "hover".
 */
export function Tooltip({
  children,
  title,
  placement = "top",
  trigger = "hover",
}: TooltipProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const tooltip = new BSTooltip(ref.current, {
      title,
      placement,
      trigger,
    })

    return () => tooltip.dispose()
  }, [title, placement, trigger])

  return (
    <span ref={ref}>
      {children}
    </span>
  )
}

/**
 * Functions to programmatically show or hide the tooltip.
 * 
 * @example
 * showTooltip(ref.current)
 * 
 * @param element - The element that has the tooltip initialized. You can get this ref from the Tooltip component.
 */
export function showTooltip(element: HTMLElement) {
  BSTooltip.getOrCreateInstance(element).show()
}

/**
 * Functions to programmatically show or hide the tooltip.
 * 
 * @example
 * hideTooltip(ref.current)
 * 
 * @param element - The element that has the tooltip initialized. You can get this ref from the Tooltip component.
 */
export function hideTooltip(element: HTMLElement) {
  BSTooltip.getOrCreateInstance(element).hide()
}
