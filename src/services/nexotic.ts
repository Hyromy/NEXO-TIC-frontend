import { api } from "./api"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/'

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
