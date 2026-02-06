import { type variants } from "./variants"

type SpinnerProps = {
  variant?: variants
  label?: string
  growing?: boolean
  small?: boolean
}
export function Spinner({
  variant,
  label = "Cargando...",
  growing = false,
  small = false
}: SpinnerProps) {
  return (
    <div className={`spinner-${growing ? "grow" : "border"} ${variant ? `text-${variant}` : ""} ${small ? "spinner-sm" : ""}`} role="status">
      <span className="visually-hidden">
        {label}
      </span>
    </div>
  )
}
