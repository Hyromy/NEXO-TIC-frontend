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
/**
 * A container that stacks its children either horizontally or vertically.
 * 
 * The StackContainer component is a flexible layout component that allows you to stack its children in either a column or row orientation. You can specify the gap between the children, center them, and set a specific height for the container.
 * 
 * @example
 * <StackContainer orientation="row" gap={3} center height={200}>
 *   <div>Child 1</div>
 *   <div>Child 2</div>
 * </StackContainer>
 * 
 * @param children - The child components to be stacked.
 * @param orientation - The direction to stack the children, either "column" or "row". Default is "column".
 * @param gap - The gap between the children, specified as a number from 0 to 5. Default is 2.
 * @param center - Whether to center the children both horizontally and vertically. Default is false.
 * @param height - The height of the container, specified as a number (in pixels) or a string (e.g., "100%"). Default is undefined (auto).
 */
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

/**
 * A container that arranges its children in a row with a specified gap.
 * 
 * The RowContainer component is a flexible layout component that allows you to arrange its children in a row with a specified gap between them.
 * 
 * @example
 * <RowContainer gap={3}>
 *   <ColContainer>Colum</ColContainer>
 * </RowContainer>
 * 
 * @param children - The child components to be arranged in a row.
 * @param gap - The gap between the children, specified as a number from 0 to 5. Default is 2.
 */
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
/**
 * A container that represents a column in the grid system.
 * 
 * The ColContainer component is a flexible layout component that allows you to define the size and behavior of a column in the grid system.
 * The breakpoints (xsm, sm, md, lg, xl, xxl) allow you to specify how the column should behave at different screen sizes. The defaultSize prop allows you to set a default size for the column when no specific breakpoint is defined.
 * 
 * @example
 * <RowContainer>
 *   // This column will take up 12 columns on extra small screens, 6 columns on medium screens, and 4 columns on large screens or larger.
 *   <ColContainer defaultSize={12} md={6} lg={4}>Colum 1</ColContainer>
 *   <ColContainer defaultSize={12} md={6} lg={4}>Colum 2</ColContainer>
 *   <ColContainer defaultSize={12} md={6} lg={4}>Colum 3</ColContainer>
 *   <ColContainer defaultSize={12} md={6} lg={4}>Colum 4</ColContainer>
 * </RowContainer>
 * 
 * @param children - The child components to be placed inside the column.
 * @param defaultSize - The default size of the column when no specific breakpoint is defined. Can be a number from 0 to 12 or true (which defaults to 1). Default is true.
 * @param xsm - The size of the column on extra small screens (less than 576px), specified as a number from 0 to 12.
 * @param sm - The size of the column on small screens (576px and up), specified as a number from 0 to 12.
 * @param md - The size of the column on medium screens (768px and up), specified as a number from 0 to 12.
 * @param lg - The size of the column on large screens (992px and up), specified as a number from 0 to 12.
 * @param xl - The size of the column on extra large screens (1200px and up), specified as a number from 0 to 12.
 * @param xxl - The size of the column on extra extra large screens (1400px and up), specified as a number from 0 to 12.
 * @param noPadding - Whether to remove horizontal padding from the column. Default is false.
 */
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
/**
 * A container that provides a scrollable area with a specified height.
 * 
 * The ScrollableContainer component is a layout component that creates a scrollable area with a fixed height. It is useful for displaying content that may exceed the available space.
 * The height prop allows you to specify the maximum height of the container, while the forceHeight prop determines whether to set a fixed height or allow it to grow based on content.
 * 
 * @example
 * <ScrollableContainer height={300} forceHeight>
 *   <div>Content that may exceed the height of the container...</div>
 * </ScrollableContainer>
 * 
 * @param children - The child components to be placed inside the scrollable container.
 * @param height - The maximum height of the container, specified as a number (in pixels) or a string (e.g., "100%"). Default is 256 pixels.
 * @param forceHeight - Whether to set a fixed height for the container. If true, the container will have a fixed height equal to the specified height. If false, the container will grow based on its content up to the maximum height. Default is false.
 */
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
