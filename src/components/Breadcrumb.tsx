type BreadcrumbProps = {
  items: Array<{
    label: string
    href: string
  }>
}
export function Breadcrumb({
  items
}: BreadcrumbProps) {
  const lastIndex = items.length - 1
  
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        {items.map((item, index) => {
          const isLast = index == lastIndex
          
          const content = <li className={"breadcrumb-item" + (isLast ? " active" : "")} aria-current={isLast ? "page" : undefined}>
            {isLast 
              ? item.label
              : <a href={item.href}>{item.label}</a>
            }
          </li>

          return (
            <li className="breadcrumb-item">
              {content}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
