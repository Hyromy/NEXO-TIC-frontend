import { decodeJWT } from "./jwt"

/**
 * Extracts data from a FormData object and returns it as a plain object.
 * 
 * @example
 * const formData = new FormData()
 * formData.append('username', 'john_doe')
 * formData.append('email', 'john_doe@example.com')
 * 
 * const data = getDataFromForm(formData)
 * console.log(data) // Output: { username: 'john_doe', email: 'john_doe@example.com' }
 * 
 * @param formData - The FormData object containing the form data to be extracted.
 * 
 * @returns The plain object containing the extracted form data.
 */
export function getDataFromForm(formData: FormData) {
  const data: Record<string, string> = {}
  formData.forEach((value, key) => {
    data[key] = value as string
  })

  return data
}

/**
 * Retrieves the access token from local storage.
 * 
 * @returns The access token or an empty string if not found.
 */
export function getAccessToken() {
  return localStorage.getItem("accessToken") || ""
}

/**
 * Retrieves the refresh token from local storage.
 * 
 * @returns The refresh token or an empty string if not found.
 */
export function getRefreshToken() {
  return localStorage.getItem("refreshToken") || ""
}


/**
 * Retrieves both the access token and refresh token from local storage.
 * 
 * @returns An object containing the access token and refresh token.
 */
export function getPairTokens() {
  return {
    accessToken: getAccessToken(),
    refreshToken: getRefreshToken(),
  }
}

/**
 * Retrieves the human-readable name of the user from the access token.
 * 
 * @returns The user's name or null if not found.
 */
export function getHumanName() {
  const token = getAccessToken()
  if (!token) return null

  const decoded = decodeJWT(token)
  if (!decoded) return null

  const firstName = decoded.first_name || ""
  const lastName = decoded.last_name || ""
  const userName = decoded.username || ""

  return firstName
    ? `${firstName}${lastName ?? ""}`
    : userName
}

/**
 * Retrieves the theme preference from local storage.
 * 
 * @returns The theme preference or null if not found.
 */
export function getTheme() {
  return localStorage.getItem("theme")
}
