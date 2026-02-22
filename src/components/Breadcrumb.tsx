type BreadcrumbProps = {
  items: Array<{
    label: string
    href: string
  }>
  divider?: string
}
export function Breadcrumb({
  items,
  divider = "/",
}: BreadcrumbProps) {
  const lastIndex = items.length - 1
  
  return (
    <nav aria-label="breadcrumb" style={divider != null ? { "--bs-breadcrumb-divider": `'${divider}'` } as React.CSSProperties : undefined}>
      <ol className="breadcrumb">
        {items.map((item, index) => {
          const isLast = index == lastIndex
          
          return (
            <li key={index} className={"breadcrumb-item" + (isLast ? " active" : "")} aria-current={isLast ? "page" : undefined}>
              {isLast 
                ? item.label
                : <a href={item.href}>{item.label}</a>
              }
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
