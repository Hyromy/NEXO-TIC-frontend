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
/**
 * Progress component to display a progress bar.
 * 
 * @example
 * <Progress value={50} label="Loading..." />
 * 
 * @param value - The current value of the progress.
 * @param max - The maximum value of the progress. Default is 100.
 * @param variant - The color variant of the progress bar. Default is "primary".
 * @param label - The label to display inside the progress bar.
 * @param striped - If true, the progress bar will have stripes. Default is false.
 * @param animated - If true, the progress bar will be animated. Default is false.
 * @param _stacked - Internal prop to indicate if the progress bar is inside a ProgressStack. Do not use this prop directly. 
 */
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
/**
 * ProgressStack component to display multiple progress bars stacked.
 * 
 * @example
 * <ProgressStack>
 *   <Progress value={50} label="Copying" />
 *   <Progress value={30} variant="success" label="Processing" />
 * </ProgressStack>
 * 
 * @param children - The Progress components to stack. Only Progress components will be stacked, other elements will be rendered as is.
 */
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
