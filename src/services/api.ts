import { isTokenExpired } from '../utils/jwt'
import { getAccessToken, getRefreshToken } from '../utils/getters'
import { setPairTokens, clearTokens } from '../utils/setters'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/'
const REFRESH_ENDPOINT = API_URL + 'auth/refresh/'

let isRefreshing = false
let refreshPromise: Promise<boolean> | null = null

/**
 * Gets the common headers for API requests, including the authorization header if an access token is available.
 * 
 * @example 
 * const headers = getCommonHeaders()
 * console.log(headers)
 * // Output might be: 
 * // {
 * //   'Content-Type': 'application/json',
 * //   'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...'
 * // }
 * 
 * @returns The common headers object.
 */

export type ApiResponse<T> = T | {
  error: true
  message: string
  status?: number
  object?: any
  originalError?: any
}

const getCommonHeaders = () => {
  const token = getAccessToken()
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

/**
 * Sends a request to the API endpoint with the specified options.
 * The function automatically handles token expiration by attempting to refresh the access token if it has expired. If the refresh is successful, it retries the original request with the new token. If the refresh fails, it returns an error indicating that the session has expired.
 * 
 * @example
 * const response = await request('/api/data', { method: 'GET' })
 * 
 * // Handling the response
 * if (response.error) {
 *   console.error('Error:', response.message)
 * } else {
 *   console.log('Data:', response)
 * }
 * 
 * @param endpoint - The API endpoint to which the request will be sent.
 * @param options - The options for the fetch request, such as method, headers, and body.
 * @param ignoreAuth - A boolean flag indicating whether to ignore authentication errors. If true, the function will not attempt to refresh the token on a 401 response and will return the error directly.
 *
 * @returns A promise that resolves to the response data if the request is successful, or an error object if there is an error in the request or token refresh process.
 * - On success: The response data from the API.
 * - On error: An object containing an `error` boolean, a `message` string describing the error, and optionally the original error object for debugging.
 */
export async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  ignoreAuth: boolean = false
): Promise<ApiResponse<T>> {
  const accessToken = getAccessToken()
  if (accessToken && isTokenExpired(accessToken) && !ignoreAuth) {
    const refreshed = await refreshAccessToken()
    if (!refreshed) {
      return {
        error: true,
        message: "Session outdated. Please log in again."
      }
    }
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...getCommonHeaders(),
      ...options.headers,
    },
  }

  try {
    const response = await fetch(endpoint, config)

    if (response.status == 401 && !ignoreAuth) {
      const refreshed = await refreshAccessToken()
      
      if (refreshed) {
        const retryConfig: RequestInit = {
          ...options,
          headers: {
            ...getCommonHeaders(),
            ...options.headers,
          },
        }
        const retryResponse = await fetch(endpoint, retryConfig)
        const retryData = await retryResponse.json().catch(() => ({}))

        if (retryResponse.ok) {
          return retryData
        } else {
          return {
            error: true,
            status: retryResponse.status,
            message: retryData.message || "Error in the request after token refresh",
            originalError: retryData
          }
        }
      } else {
        return {
          error: true,
          message: 'Session expired. Please log in again.'
        }
      }
    }

    const data = await response.json().catch(() => ({})) 

    if (response.ok) {
      return data

    } else {
      return {
        error: true,
        status: response.status,
        message: data.message || 'Error en la petición',
        originalError: data
      }
    }

  } catch (err: any) {
    return {
      error: true,
      message: err.message || "Network error",
      object: err
    }
  }
}

/**
 * Refreshes the access token using the refresh token.
 * 
 * @example
 * const success = await refreshAccessToken()
 * 
 * if (success) {
 *   console.log('Token refreshed successfully')
 * } else {
 *   console.log('Failed to refresh token, user needs to log in again')
 * }
 * 
 * @returns A promise that resolves to a boolean indicating whether the token was successfully refreshed.
 */
async function refreshAccessToken(): Promise<boolean> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise
  }

  isRefreshing = true
  refreshPromise = (async () => {
    try {
      const refreshToken = getRefreshToken()
      if (!refreshToken) {
        clearTokens()
        return false
      }

      const response = await fetch(REFRESH_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.access) {
          setPairTokens(data.access, data.refresh || refreshToken)
          return true
        }
      }

      clearTokens()
      return false

    } catch (error) {
      console.error('Error refreshing token:', error)
      clearTokens()
      return false

    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  })()

  return refreshPromise
}

/**
 * Creates the headers for an API request based on the method and body.
 * 
 * @example
 * const headers = apiHeaders('POST', { name: 'John' })
 * console.log(headers)
 * // Output:
 * // {
 * //   method: 'POST',
 * //   body: '{"name":"John"}'
 * // }
 * 
 * @param method - The HTTP method for the request (e.g., 'GET', 'POST', 'PUT', 'DELETE'). Default is 'GET'.
 * @param body - The body of the request, which will be stringified as JSON if provided. Default is null.
 * 
 * @returns An object containing the method and body for the API request.
 * - `method`: The HTTP method for the request.
 * - `body`: The stringified JSON body of the request, if provided; otherwise, it is not included in the returned object.
 */
const apiHeaders = (
  method: string = "GET",
  body: object | null = null
) => {
  return {
    method,
    ...(body && { body: JSON.stringify(body) }),
  }
}

/**
 * An object containing methods for making API requests with automatic token handling.
 * 
 * The `api` object provides methods for making GET, POST, PUT, PATCH, and DELETE requests to the API. Each method automatically handles token expiration by attempting to refresh the access token if it has expired before making the request. If the token refresh is successful, the original request is retried with the new token. If the refresh fails, an error indicating that the session has expired is returned.
 * 
 * @example
 * // Making a GET request
 * const response = await api.get('/api/data')
 * 
 * // Making a POST request with a body
 * const postResponse = await api.post('/api/data', { name: 'John' })
 * 
 * // Handling the response
 * if (response.error) {
 *   console.error('Error:', response.message)
 * } else {
 *   console.log('Data:', response)
 * }
 */
export const api = {
  get: <T>(endpoint: string, ignoreAuth: boolean = false) =>
    request<T>(endpoint, apiHeaders(), ignoreAuth),

  post: <T>(endpoint: string, body: object, ignoreAuth: boolean = false) =>
    request<T>(endpoint, apiHeaders("POST", body), ignoreAuth),

  put: <T>(endpoint: string, body: object, ignoreAuth: boolean = false) =>
    request<T>(endpoint, apiHeaders("PUT", body), ignoreAuth),

  patch: <T>(endpoint: string, body: object, ignoreAuth: boolean = false) =>
    request<T>(endpoint, apiHeaders("PATCH", body), ignoreAuth),

  delete: <T>(endpoint: string, ignoreAuth: boolean = false) =>
    request<T>(endpoint, apiHeaders("DELETE"), ignoreAuth),
}
