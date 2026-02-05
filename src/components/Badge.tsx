import { type variants } from "./variants"

type BadgeProps = {
  text: string
  type?: variants
}
export function Badge({
  text,
  type = "primary"
}: BadgeProps) {
  return (
    <span className={`badge bg-${type}`}>
      {text}
    </span>
  )
}
