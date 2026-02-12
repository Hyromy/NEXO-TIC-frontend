import { type ReactNode } from "react"

type MenuProps = {
  modules: ReactNode[]
  bottom?: ReactNode[]
}
export default function Menu({
  modules,
  bottom = [
    "Reglamento",
    "Términos y políticas",
  ],
}: MenuProps) {
  const modulesCount = modules.length
  return (
    <>
      <ul className="d-none d-md-flex flex-column h-100">
        {modules.map((module, index) => (
          <li key={index}>{module}</li>
        ))}
        <div className="mt-auto">
          {bottom.map((item, index) => (
            <li key={index + modulesCount}>{item}</li>
          ))}
        </div>
      </ul>
      <ul className="d-md-none">
        {modules.map((module, index) => (
          <li key={index}>{module}</li>
        ))}
        <hr className="my-2" />
        {bottom.map((item, index) => (
          <li key={index + modulesCount}>{item}</li>
        ))}
      </ul>
    </>
  )
}
