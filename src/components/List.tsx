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
/**
 * List component that renders a list of items. It can be flush, numbered, or horizontal.
 * 
 * @example
 * <List items={["Item 1", "Item 2", "Item 3"]} />
 * 
 * @param items - The items to render in the list. Can be strings or ListItem components.
 * @param flush - If true, the list will be flush (no borders).
 * @param numbered - If true, the list will be numbered.
 * @param horizontal - If true, the list will be horizontal.
 */
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
/**
 * ListItem component that renders a single item in a List. It can have different variants, hover effect, and active state.
 * 
 * @example
 * <List items={[
 *   <ListItem hover active onClick={() => alert("Clicked!")}>
 *     Item 1
 *   </ListItem>,
 *   <ListItem variant="secondary" hover onClick={() => alert("Clicked!")}>
 *     Item 2
 *   </ListItem>,
 * ]} />
 * 
 * @param children - The content of the list item.
 * @param variant - The variant of the list item (e.g., "primary", "secondary", etc.).
 * @param hover - If true, the list item will have a hover effect.
 * @param active - If true, the list item will be active (highlighted).
 * @param onClick - The function to call when the list item is clicked.
 */
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
