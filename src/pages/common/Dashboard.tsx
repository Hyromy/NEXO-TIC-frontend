import { useEffect } from "react"

import { userService } from "../../services/nexotic"
import useApi from "../../hooks/useApi"

import Main from "../../layout/Main"

import { Spinner } from "../../components/Spinner"

export default function Dashboard() {
  const { execute, data, error, loading } = useApi<any>()

  useEffect(() => {
    execute(userService.get())
  }, [])

  useEffect(() => {
    if (error) {
      console.error("Error fetching user data:", error)
      alert("Error consiguiendo información de usuarios")
    }
  }, [error])

  const content = loading
  ? <Spinner />
  : (
    <>
      <h1>Dashboard</h1>
      <p>The content below is for debugging purposes only:</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  )

  return (
    <Main>
      {content}
    </Main>
  )
}
