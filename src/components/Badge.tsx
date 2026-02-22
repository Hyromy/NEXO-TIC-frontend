import { type variants } from "./variants"

type BadgeProps = {
  text?: string
  type?: variants
  pill?: boolean
  onTop?: boolean
  hidden?: string
}
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
