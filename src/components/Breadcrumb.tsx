type BreadcrumbProps = {
  items: Array<{
    label: string
    href: string
  }>
  divider?: string
}
/**
 * Breadcrumb component. Used to display a breadcrumb navigation. It can be used to display the current page and its ancestors.
 * 
 * @example
 * <Breadcrumb
 *   items={[
 *     { label: "Home", href: "/" },
 *     { label: "Library", href: "/library" },
 *     { label: "Data", href: "/library/data" },
 *   ]}
 * />
 * 
 * @param items - Array of breadcrumb items. Each item must have a label and an href.
 * @param divider - Custom divider character or string to separate breadcrumb items. Default is "/". If set to null, the default divider will be used.
 */
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
