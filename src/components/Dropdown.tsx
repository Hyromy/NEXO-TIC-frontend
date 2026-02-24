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

export function DropdownDivider() {
  return (
    <li className="dropdown-divider">
      <hr/>
    </li>
  )
}
