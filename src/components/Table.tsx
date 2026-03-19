import { type ReactNode } from "react"

type TableProps = {
  headers: ReactNode[]
  rows: any[]
  trDrawer: (item: any) => ReactNode[]
}
/**
 * Table component to display data in a tabular format.
 * 
 * @example
 * const headers = ["Name", "Age", "City"]
 * const rows = [
 *   { name: "Alice", age: 30, city: "New York" },
 *   { name: "Bob", age: 25, city: "Los Angeles" },
 * ]
 * const trDrawer = (item) => [
 *   item.name,
 *   item.age,
 *   item.city
 * ]
 * 
 * <Table
 *   headers={headers}
 *   rows={rows}
 *   trDrawer={trDrawer}
 * />
 * 
 * @param headers - An array of React nodes to be used as table headers.
 * @param rows - An array of data objects to be displayed in the table.
 * @param trDrawer - A function that takes a data object and returns an array of React nodes to be displayed in each cell of the corresponding row.
 */
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
