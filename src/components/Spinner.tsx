import { type variants } from "./variants"

type SpinnerProps = {
  variant?: variants
  label?: string
  growing?: boolean
  small?: boolean
}
/**
 * Spinner component to display a loading indicator.
 * 
 * @example
 * <Spinner />
 * 
 * @param variant - The color variant of the spinner. Default is "primary".
 * @param label - The label to display for screen readers. Default is "Cargando...".
 * @param growing - If true, the spinner will use the "grow" style. Default is false (uses "border" style).
 * @param small - If true, the spinner will be smaller. Default is false.
 */
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
