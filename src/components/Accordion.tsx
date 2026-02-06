type AccordionProps = {
  items: Array<{
    header: string
    body: string
  }>
  id?: string
}
export function Accordion({ 
  items,
  id = "accordion",
}: AccordionProps) {
  return (
    <div className="accordion" id={id}>
      {items.map((item, index) => (
        <div className="accordion-item" key={index}>
          <h2 className="accordion-header">
            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#accordion-collapse-${index}`} aria-expanded="true" aria-controls={`accordion-collapse-${index}`}>
              {item.header}
            </button>
          </h2>
          <div id={`accordion-collapse-${index}`} className="accordion-collapse collapse show" data-bs-parent={`#${id}`}>
            <div className="accordion-body">
              {item.body}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
