type AccordionProps = {
  items: Array<{
    header: string
    body: string
  }>
  id?: string
  flush?: boolean
  openIndex?: number
}
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
