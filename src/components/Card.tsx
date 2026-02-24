import { type ReactNode } from "react"

type CardProps = {
  header?: ReactNode
  children?: ReactNode
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
    <div className={`card${shadow ? " shadow" : ""}`}>
      {header && <div className="card-header">{header}</div>}
      {children && <div className={`card-body p-${padding}`}>{children}</div>}
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  )
}

type CardPaginationProps = {
  tabs: Array<{
    label: string
    href?: string
    disabled?: boolean
  }>
  activeIndex?: number
  onTabChange?: (index: number) => void
}
export function CardPagination({
  tabs,
  activeIndex = 0,
  onTabChange,
}: CardPaginationProps) {
  return (
    <ul className="nav nav-tabs card-header-tabs">
      {tabs.map((tab, index) => (
        <li key={index} className="nav-item">
          <a
            className={`nav-link${index === activeIndex ? " active" : ""}${tab.disabled ? " disabled" : ""}`}
            aria-current={index === activeIndex ? "true" : undefined}
            aria-disabled={tab.disabled ? "true" : undefined}
            href={tab.href ?? "#"}
            onClick={(e) => {
              if (!tab.href) e.preventDefault()
              if (!tab.disabled) onTabChange?.(index)
            }}
          >
            {tab.label}
          </a>
        </li>
      ))}
    </ul>
  )
}
