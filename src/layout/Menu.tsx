import { type ReactNode } from "react"

import useUser from "../hooks/useUser"

import { Spinner } from "../components/Spinner"

type MenuProps = {
  modules?: ReactNode[]
  bottom?: ReactNode[]
}
export default function Menu({
  modules,
  bottom,
}: MenuProps) {
  const { loading } = useUser()

  const modulesCount = modules ? modules.length : 0

  return loading
  ? <Spinner />
  : (
    <>
      <ul className="d-none d-md-flex flex-column h-100" style={{ listStyle: 'none', paddingLeft: 0, gap: '0.5rem' }}>
        {modules?.map((module, index) => (
          <li key={index}>{module}</li>
        ))}
        <div className="mt-auto">
          {bottom?.map((item, index) => (
            <li key={index + modulesCount}>{item}</li>
          ))}
        </div>
      </ul>
      <ul className="d-md-none" style={{ listStyle: 'none', paddingLeft: 0, gap: '0.5rem', display: 'flex', flexDirection: 'column' }}>
        {modules?.map((module, index) => (
          <li key={index}>{module}</li>
        ))}
        <hr className="my-2" />
        {bottom?.map((item, index) => (
          <li key={index + modulesCount}>{item}</li>
        ))}
      </ul>
    </>
  )
}
