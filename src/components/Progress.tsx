import { type variants } from "./variants"

type ProgressProps = {
  value: number
  max?: number
  variant?: variants
  label?: string
  striped?: boolean
  animated?: boolean
}
export default function Progress({
  value,
  max = 100,
  variant = "primary",
  label,
  striped = false,
  animated = false
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="progress" role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
      <div className={`progress-bar bg-${variant} ${striped ? "progress-bar-striped" : ""} ${animated ? "progress-bar-animated" : ""}`} style={{ width: `${percentage}%` }}>
        {label && label}
      </div>
    </div>
  )
}