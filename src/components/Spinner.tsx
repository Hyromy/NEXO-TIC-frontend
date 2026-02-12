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
  const spinnerType = growing ? "grow" : "border"

  return (
    <div className={`spinner-${spinnerType} ${variant ? `text-${variant}` : ""} ${small ? `spinner-${spinnerType}-sm` : ""}`} role="status">
      <span className="visually-hidden">
        {label}
      </span>
    </div>
  )
}
