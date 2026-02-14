import { type ReactNode } from "react"

type CardProps = {
  header?: ReactNode
  children: ReactNode
  footer?: ReactNode
  shadow?: boolean
  padding?: 0 | 1 | 2 | 3 | 4 | 5
}
export function Card({
  header,
  children,
  footer,
  shadow,
  padding = 4
}: CardProps) {
  return (
    <div className={`card ${shadow ? "shadow" : ""}`}>
      {header && <div className="card-header">{header}</div>}
      <div className={`card-body p-${padding}`}>{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  )
}
