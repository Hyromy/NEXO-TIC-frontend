import React, { type ReactNode } from "react"

import { type variants } from "./variants"

type DropdownProps = {
  variant?: variants
  children: ReactNode
  items: ReactNode[]
}
export function Dropdown({
  variant = "primary",
  children,
  items
}: DropdownProps) {
  return (
    <div className="dropdown">
      <button className={"btn btn-" + variant + " dropdown-toggle"} type="button" data-bs-toggle="dropdown" aria-expanded="false">
        {children}
      </button>
      <ul className="dropdown-menu">
        {items.map((item, index) => (
          React.isValidElement(item) && item.type == DropdownDivider
            ? <DropdownDivider key={index} />
            : (
              <li key={index} className="dropdown-item">
                {item}
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
