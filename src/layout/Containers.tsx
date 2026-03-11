import { type ReactNode } from "react"

type BasicRange = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
type ShortRange = 0 | 1 | 2 | 3 | 4 | 5

type StackContainerProps = {
  children: ReactNode
  orientation?: "column" | "row"
  gap?: ShortRange
  center?: boolean
  height?: number
}
export function StackContainer({
  children,
  orientation = "column",
  gap = 2,
  center,
  height,
}: StackContainerProps) {
  let classes = `d-flex flex-${orientation} gap-${gap}`
  if (center) classes += " justify-content-center align-items-center"

  return (
    <div className={classes} style={{height}}>
      {children}
    </div>
  )
}

type RowContainerProps = {
  children: ReactNode
  gap?: ShortRange
}
export function RowContainer({
  children,
  gap = 2,
}: RowContainerProps) {
  return (
    <div className={`row gx-${gap} gy-${gap}`}>
      {children}
    </div>
  )
}

type ColContainerProps = {
  children: ReactNode
  defaultSize?: BasicRange | true
  xsm?: BasicRange
  sm?: BasicRange
  md?: BasicRange
  lg?: BasicRange
  xl?: BasicRange
  xxl?: BasicRange
  noPadding?: boolean
}
export function ColContainer({
  children,
  defaultSize = true,
  xsm,
  sm,
  md,
  lg,
  xl,
  xxl,
  noPadding = false,
}: ColContainerProps) {
  let classes = noPadding ? "px-0" : ""
  if (defaultSize == true) classes += " col"
  else if (Number.isInteger(defaultSize)) classes += ` col-${defaultSize}`

  if (xsm) classes += ` col-xsm-${xsm}`
  if (sm) classes += ` col-sm-${sm}`
  if (md) classes += ` col-md-${md}`
  if (lg) classes += ` col-lg-${lg}`
  if (xl) classes += ` col-xl-${xl}`
  if (xxl) classes += ` col-xxl-${xxl}`

  return (
    <div className={classes}>
      {children}
    </div>
  )
}

type ScrollableContainerProps = {
  children: ReactNode
  height?: string | number
  forceHeight?: boolean
}
export function ScrollableContainer({
  children,
  height = 256,
  forceHeight
}: ScrollableContainerProps) {
  return (
    <div style={{ maxHeight: height, overflowY: "auto", height: forceHeight ? height : "auto" }}>
      {children}
    </div>
  )
}

type FloatContainerProps = {
  children?: ReactNode
  id?: string
  currentWith?: string | number
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left"
  padding?: ShortRange
}
export function FloatContainer({
  children,
  id,
  currentWith = 384,
  position = "bottom-right",
  padding = 2,
}: FloatContainerProps) {
  const style: React.CSSProperties = { position: "fixed" }
  
  if (position.includes("bottom")) style.bottom = 0
  if (position.includes("top")) style.top = 0
  if (position.includes("right")) style.right = 0
  if (position.includes("left")) style.left = 0

  if (currentWith) style.width = currentWith

  return (
    <div
      id={id}
      className={`p-${padding}`}
      style={style}
    >
      {children}
    </div>
  )
}
