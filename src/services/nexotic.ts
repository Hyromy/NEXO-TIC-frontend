import { api } from "./api"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/'

const param = (id: number) => (
  Number.isInteger(id) && id > 0
    ? `${id}/`
    : ""
)

export const userService = {
  endpoint: API_URL + "users/",

  get: (id: number = 0) => (
    api.get(userService.endpoint + param(id))
  ),

  create: (data: {username: string, password: string}) => (
    api.post(userService.endpoint, data)
  ),
}

export const authService = {
  endpoint: API_URL + "auth/",

  login: (username: string, password: string) => (
    api.post(
      authService.endpoint + "login/",
      {
        username,
        password,
      },
      true
    )
  ),

  refresh: (refreshToken?: string) => {
    if (!refreshToken) return null
    return api.post(authService.endpoint + "refresh/", {
      refresh: refreshToken,
    })
  },

  signup: (username: string, email: string) => (
    api.post(authService.endpoint + "signup/", {
      username,
      email,
    })
  ),

  recover: (username: string, email: string) => (
    api.post(authService.endpoint + "recover/", {
      username,
      email,
    })
  ),

  logout: (refresh: string) => (
    api.post(authService.endpoint + "logout/", {
      refresh,
    })
  ),
}
