import React, { type ReactNode } from "react"

import { type variants } from "./variants"

type directions = "up" | "start" | "end"

type DropdownProps = {
  variant?: variants
  children: ReactNode
  items: ReactNode[]
  direction?: directions
  inverted?: boolean
  size?: "sm" | "lg"
}
/**
 * Dropdown component that can be used to create a dropdown menu. It uses Bootstrap's dropdown classes and functionality. The `items` prop can contain any ReactNode, but if it contains a `DropdownDivider`, it will render a divider instead of a menu item.
 * 
 * @example
 * <Dropdown items={[
 *   "Item 1",
 *   "Item 2",
 *   "Item 3",
 * ]}>
 *  Text to show on the dropdown button
 * </Dropdown>
 * 
 * @param variant - The variant of the dropdown button (e.g., "primary", "secondary", etc.).
 * @param children - The content to display on the dropdown button.
 * @param items - An array of ReactNodes to display as dropdown items. If an item is a `DropdownDivider`, it will render a divider.
 * @param direction - The direction in which the dropdown should open (e.g., "up", "start", "end").
 * @param inverted - If true, the dropdown menu will be aligned to the right.
 * @param size - The size of the dropdown button (e.g., "sm" for small, "lg" for large).
 */
export function Dropdown({
  variant = "primary",
  children,
  items,
  direction,
  inverted,
  size,
}: DropdownProps) {
  return (
    <div className={`dropdown ${direction ? `drop${direction}` : ''}`}>
      <button className={"btn btn-" + variant + " dropdown-toggle" + (size ? ` btn-${size}` : "")} type="button" data-bs-toggle="dropdown" aria-expanded="false">
        {children}
      </button>
      <ul className={`dropdown-menu ${inverted ? "dropdown-menu-end" : ""}`}>
        {items.map((item, index) => (
          React.isValidElement(item) && item.type == DropdownDivider
            ? <DropdownDivider key={index} />
            : (
              <li key={index}>
                <a className="dropdown-item">
                  {item}
                </a>
              </li>
            )
        ))}
      </ul>
    </div>
  )
}

/**
 * A divider component for the Dropdown. It renders a horizontal line to separate dropdown items. This component should be used as an item in the `items` prop of the `Dropdown` component to render a divider between items.
 * 
 * @example
 * <Dropdown items={[
 *   "Item 1",
 *   <DropdownDivider />,
 *   "Item 2",
 * ]}>
 *   Text to show on the dropdown button
 * </Dropdown>
 */
export function DropdownDivider() {
  return (
    <li className="dropdown-divider">
      <hr/>
    </li>
  )
}
