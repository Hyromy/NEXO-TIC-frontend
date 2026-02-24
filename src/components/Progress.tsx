import { type ReactNode, isValidElement, cloneElement, Children } from "react"

import { type variants } from "./variants"

type ProgressProps = {
  value: number
  max?: number
  variant?: variants
  label?: string
  striped?: boolean
  animated?: boolean
  _stacked?: boolean
}
export default function Progress({
  value,
  max = 100,
  variant = "primary",
  label,
  striped = false,
  animated = false,
  _stacked = false
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div 
      className="progress" 
      role="progressbar" 
      aria-label={label} 
      aria-valuenow={value} 
      aria-valuemin={0} 
      aria-valuemax={max}
      style={_stacked ? { width: `${percentage}%` } : undefined}
    >
      <div 
        className={`progress-bar bg-${variant}${striped ? " progress-bar-striped" : ""}${animated ? " progress-bar-animated" : ""}`} 
        style={!_stacked ? { width: `${percentage}%` } : undefined}
      >
        {label}
      </div>
    </div>
  )
}

type ProgressStackProps = {
  children: ReactNode
}
export function ProgressStack({ children }: ProgressStackProps) {
  return (
    <div className="progress-stacked">
      {Children.map(children, (child, index) =>
        isValidElement(child) && child.type == Progress
          ? cloneElement(child as React.ReactElement<ProgressProps>, { key: index, _stacked: true })
          : child
      )}
    </div>
  )
}
