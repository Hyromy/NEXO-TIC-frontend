import { type variants } from "./variants"

type AlertProps = {
  text: string
  type?: variants
}
export function Alert({
  text,
  type = "primary"
}: AlertProps) {
  return (
    <div className={`alert alert-${type}`} role="alert">
      {text}
    </div>
  )
}
