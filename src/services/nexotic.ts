import { api } from "./api"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/'

/**
 * Generates a URL parameter string for a request ID if it is a valid positive integer.
 * 
 * @example
 * console.log(param(5)) // Output: "5/"
 * console.log(param(-3)) // Output: ""
 * console.log(param(0)) // Output: ""
 * console.log(param(2.5)) // Output: ""
 * 
 * @param id - The request ID.
 * @returns The URL parameter string or an empty string if the ID is invalid.
 */
const param = (id: number) => (
  Number.isInteger(id) && id > 0
    ? `${id}/`
    : ""
)

/**
 * Service for managing user-related API calls.
 * 
 * The userService object provides methods for interacting with the user-related endpoints of the API. It includes methods for retrieving user information and creating new users.
 */
export const userService = {
  endpoint: API_URL + "users/",

  get: (id: number = 0) => (
    api.get(userService.endpoint + param(id))
  ),

  create: (data: {username: string, password: string}) => (
    api.post(userService.endpoint, data)
  ),
}

/**
 * Service for managing authentication-related API calls.
 * 
 * The authService object provides methods for interacting with the authentication endpoints of the API. It includes methods for logging in, refreshing tokens, signing up, recovering accounts, logging out, and changing passwords.
 */
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

  changePassword: (new_password: string) => (
    api.post(authService.endpoint + "reset-password/", {
      new_password,
    })
  ),
}
