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

export function showTooltip(element: HTMLElement) {
  BSTooltip.getOrCreateInstance(element).show()
}

export function hideTooltip(element: HTMLElement) {
  BSTooltip.getOrCreateInstance(element).hide()
}
