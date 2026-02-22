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

export function showPopover(element: HTMLElement) {
  BSPopover.getOrCreateInstance(element).show()
}

export function hidePopover(element: HTMLElement) {
  BSPopover.getOrCreateInstance(element).hide()
}
