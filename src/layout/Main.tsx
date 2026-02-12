import { type ReactNode } from "react"

import Menu from "./Menu"
import Navbar from "./Navbar"
import Foot from "./Foot"

import { Canvas } from "../components/Canvas"

type MainProps = {
  children: ReactNode
  menuModules: ReactNode[]
}
export default function Main({
  children,
  menuModules
}: MainProps) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="flex-grow-1 d-flex">
        <aside
          className="bg-light border-end p-3 position-sticky d-none d-md-block"
          style={{ minWidth: 220, top: 0, height: '100vh', zIndex: 1020 }}
        >
          <Menu modules={menuModules} />
        </aside>
        <div className="flex-grow-1 d-flex flex-column">
          <Navbar />
          <div className="d-md-none">
            <Canvas id="menuCanvas" title="Menú de navegación">
              <Menu modules={menuModules} />
            </Canvas>
          </div>
          <main className="flex-grow-1 p-4">
            {children}
          </main>
        </div>
      </div>
      <Foot />
    </div>
  )
}
