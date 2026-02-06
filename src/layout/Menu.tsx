import { type ReactNode } from "react"

type MenuProps = {
  modules: ReactNode[]
  bottom?: ReactNode[]
}
export default function Menu({
  modules,
  bottom = [
    <span>Reglamento</span>,
    <span>terminos y politicas</span>,
  ],
}: MenuProps) {
  const modulesCount = modules.length
  return (
    <ul>
      {modules.map((module, index) => (
        <li key={index}>{module}</li>
      ))}
      {bottom.map((item, index) => (
        <li key={index + modulesCount}>{item}</li>
      ))}
    </ul>
  )
}
