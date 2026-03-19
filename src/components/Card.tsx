import { type ReactNode } from "react"

type CardProps = {
  header?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  shadow?: boolean
  padding?: 0 | 1 | 2 | 3 | 4 | 5
}
/**
 * Card component. Used to display content in a card layout. It can have a header, body and footer. The body can have custom padding and the card can have a shadow.
 * 
 * @example
 * <Card
 *   header=<h2>Card Header</h2>
 *   footer=<small>Footer Text</small>
 *   shadow
 * >
 *   This is the body of the card with custom padding and shadow.
 * </Card>
 * 
 * @param header - The content to display in the card header. Can be any ReactNode.
 * @param children - The content to display in the card body. Can be any ReactNode.
 * @param footer - The content to display in the card footer. Can be any ReactNode.
 * @param shadow - If true, the card will have a shadow. Default is false (no shadow).
 * @param padding - The padding for the card body. Can be 0, 1, 2, 3, 4 or 5 (corresponding to Bootstrap's spacing scale). Default is 4.
 */
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
/**
 * CardPagination component. Used to display a pagination in the card header. It can be used to switch between different tabs in the card body.
 * 
 * @example
 * <Card header={
 *   <CardPagination
 *     tabs={[
 *       { label: "Tab 1" },
 *       { label: "Tab 2", disabled: true },
 *       { label: "Tab 3", href: "/tab3" },
 *     ]}
 *     onTabChange={(index) => console.log("Selected tab index:", index)}
 *   />
 * }>
 *   This is the body of the card
 * </Card>
 * 
 * @param tabs - An array of tab objects to display in the pagination. Each tab object should have a "label" property for the tab text, and can optionally have an "href" property for navigation and a "disabled" property to disable the tab.
 * @param activeIndex - The index of the currently active tab. Default is 0 (first tab).
 * @param onTabChange - A callback function that is called when a tab is clicked. It receives the index of the clicked tab as an argument.
 */
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
