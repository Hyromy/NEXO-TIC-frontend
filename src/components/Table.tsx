import { type ReactNode } from "react"

type TableProps = {
  headers: ReactNode[]
  rows: any[]
  trDrawer: (item: any) => ReactNode[]
}
export function Table ({
  headers,
  rows,
  trDrawer
}: TableProps) {
  return (
    <table className="w-100">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {trDrawer(row).map((cell, cellIndex) => (
              <td key={cellIndex}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )  
}
