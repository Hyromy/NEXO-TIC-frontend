import {
  type ReactNode,
  cloneElement,
  isValidElement
} from "react"

import { type variants } from "./variants"

type ListProps = {
	items: ReactNode[]
  flush?: boolean
  numbered?: boolean
  horizontal?: boolean
}
export function List({
	items,
  flush,
  numbered,
  horizontal,
}: ListProps) {
  let classes = "list-group"
  if (flush) classes += " list-group-flush"
  if (numbered) classes += " list-group-numbered"
  if (horizontal) classes += " list-group-horizontal"

	return (
		<ul className={classes}>
			{items.map((item, index) => (
        isValidElement(item) && item.type == ListItem
          ? cloneElement(item, { key: index })
          : <li key={index} className="list-group-item">{item}</li>
      ))}
		</ul>
	)
}

type ListItemProps = {
  children: ReactNode,
  variant?: variants
  hover?: boolean
  active?: boolean
  onClick?: () => void
}
export function ListItem({
  children,
  variant,
  hover,
  active,
  onClick,
}: ListItemProps) {
  let classes = "list-group-item"
  if (variant) classes += ` list-group-item-${variant}`
  if (hover) classes += " list-group-item-action"
  if (active) classes += " active"

  return (
    <li className={classes} onClick={onClick}>
      {children}
    </li>
  )
}
