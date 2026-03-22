import { type variants } from "./variants"

type BadgeProps = {
  text?: string
  type?: variants
  pill?: boolean
  onTop?: boolean
  hidden?: string
}
/**
 * Badge component. Used to display a small badge with a text. It can be used to display a notification or a status.
 * 
 * @example
 * const someObject = {
 *   name: "John Doe",
 *   active: true,
 * }
 * 
 * <Badge
 *   text={someObject.name}
 *   type={someObject.active ? "success" : "danger"}
 * />
 * 
 * @param text - The text to display inside the badge. If not provided, the badge will be rendered as a small dot.
 * @param type - The color variant of the badge. Can be "primary", "secondary", "success", "danger", "warning", "info", "light" or "dark". Default is "primary".
 * @param pill - If true, the badge will have a rounded appearance. Default is false (normal badge shape).
 * @param onTop - If true, the badge will be positioned on top of its parent element. Default is false (inline with content).
 * @param hidden - If provided, this text will be added as a visually hidden element inside the badge for accessibility purposes. This can be used to provide additional context to screen readers when the badge itself does not contain text (e.g., when using the badge as a notification dot).
 */
export function Badge({
  text,
  type = "primary",
  pill,
  onTop,
  hidden,
}: BadgeProps) {
  return (
    <span className={`badge bg-${type} text-bg-${type}${pill ? " rounded-pill" : ""}${onTop ? " position-absolute top-0 start-100 translate-middle" : ""}`}>
      {text ? text : <>&nbsp;</>}
      {hidden && <span className="visually-hidden">{hidden}</span>}
    </span>
  )
}
