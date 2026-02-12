import { type ReactNode } from "react"

type StackContainerProps = {
  children: ReactNode
  orientation?: "column" | "row"
  gap?: 0 | 1 | 2 | 3 | 4 | 5
  center?: boolean
}
export function StackContainer({
  children,
  orientation = "column",
  gap = 2,
  center,
}: StackContainerProps) {
  return (
    <div className={`d-flex flex-${orientation} gap-${gap} ${center ? "justify-content-center align-items-center" : ""}`}>
      {children}
    </div>
  )
}
