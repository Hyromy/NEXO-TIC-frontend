import { useEffect } from "react"

import { userService } from "../../services/nexotic"
import useApi from "../../hooks/useApi"

import Main from "../../layout/Main"

export default function Dashboard() {
  const { execute, data, error, loading } = useApi<any>()

  useEffect(() => {
    execute(userService.get())
  }, [execute])

  console.log("Dashboard data:", data)
  console.log("Dashboard error:", error)
  console.log("Dashboard loading:", loading)

  return (
    <Main>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>
    </Main>
  )
}
