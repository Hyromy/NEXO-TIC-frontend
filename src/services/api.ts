import { isTokenExpired } from '../utils/jwt'
import { getAccessToken, getRefreshToken } from '../utils/getters'
import { setPairTokens, clearTokens } from '../utils/setters'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/'
const REFRESH_ENDPOINT = API_URL + 'auth/refresh/'

let isRefreshing = false
let refreshPromise: Promise<boolean> | null = null

const getCommonHeaders = () => {
  const token = getAccessToken()
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

async function request(
  endpoint: string,
  options: RequestInit = {},
  ignoreAuth: boolean = false
) {
  const accessToken = getAccessToken()
  if (accessToken && isTokenExpired(accessToken) && !ignoreAuth) {
    const refreshed = await refreshAccessToken()
    if (!refreshed) {
      throw new Error("Session outdated. Please log in again.")
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

    if (response.status == 401) {
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
          throw {
            error: true,
            status: retryResponse.status,
            message: retryData.message || "Error in the request after token refresh",
            originalError: retryData
          }
        }
      } else {
        throw new Error('Session expired. Please log in again.')
      }
    }

    const data = await response.json().catch(() => ({})) 

    if (response.ok) {
      return data

    } else {
      throw {
        error: true,
        status: response.status,
        message: data.message || 'Error in the request.',
        originalError: data
      }
    }

  } catch (err: any) {
    if (err.error) return err

    return {
      error: true,
      message: err.message || 'Network error or server is unreachable.',
      object: err,
    }
  }
}

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

const apiHeaders = (
  method: string = "GET",
  body: object | null = null
) => {
  return {
    method,
    ...(body && { body: JSON.stringify(body) }),
  }
}

export const api = {
  get: (endpoint: string, ignoreAuth: boolean = false) => 
    request(endpoint, apiHeaders(), ignoreAuth),

  post: (endpoint: string, body: object, ignoreAuth: boolean = false) =>
    request(endpoint, apiHeaders("POST", body), ignoreAuth),

  put: (endpoint: string, body: object, ignoreAuth: boolean = false ) =>
    request(endpoint, apiHeaders("PUT", body), ignoreAuth),

  patch: (endpoint: string, body: object, ignoreAuth: boolean = false) =>
    request(endpoint, apiHeaders("PATCH", body), ignoreAuth),

  delete: (endpoint: string, ignoreAuth: boolean = false) => 
    request(endpoint, apiHeaders("DELETE"), ignoreAuth),
}
