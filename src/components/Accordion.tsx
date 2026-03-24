import type { ReactNode } from "react"

type AccordionProps = {
  items: Array<{
    header: ReactNode
    body: ReactNode
  }>
  id?: string
  flush?: boolean
  openIndex?: number
}
/**
 * Accordion with multiple items. each item has a header and a body. Only one item can be open at a time.
 * 
 * @example
 * <Accordion
 *   items={[
 *     { 
 *       header: "Dog",
 *       body: "The best friend of humans"
 *     },
 *     { 
 *       header: <h2>Cat</h2>,
 *       body: <p>The domesticated feline</p>
 *     },
 *   ]}
 * />
 * 
 * @param items - Array of items to display in the accordion. Each item has a header and a body.
 * @param id - Id for the accordion. Used for the collapse functionality. Default is "accordion".
 * @param flush - If true, removes the default background-color, some borders, and some rounded corners to render accordions edge-to-edge with their parent container. Default is false.
 * @param openIndex - Index of the item that should be open by default. Default is -1 (no item open). 
 */
export function Accordion({ 
  items,
  id = "accordion",
  flush,
  openIndex = -1
}: AccordionProps) {
  if (openIndex >= items.length) {
    throw new Error("openIndex must be less than the number of items")
  }

  return (
    <div className={`accordion${flush ? " accordion-flush" : ""}`} id={id}>
      {items.map((item, index) => (
        <div className="accordion-item" key={index}>
          <h2 className="accordion-header">
            <button 
              className={`accordion-button${index !== openIndex ? " collapsed" : ""}`} 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target={`#accordion-collapse-${index}`} 
              aria-expanded={index === openIndex ? "true" : "false"} 
              aria-controls={`accordion-collapse-${index}`}
            >
              {item.header}
            </button>
          </h2>
          <div id={`accordion-collapse-${index}`} className={`accordion-collapse collapse ${index == openIndex ? "show" : ""}`} data-bs-parent={`#${id}`}>
            <div className="accordion-body">
              {item.body}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
