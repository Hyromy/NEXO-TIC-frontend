/**
 * Sets both the access token and refresh token in local storage.
 * 
 * @param access - The access token to set.
 * @param refresh - The refresh token to set.
 */
export function setPairTokens(access: string, refresh: string) {
  localStorage.setItem("accessToken", access)
  localStorage.setItem("refreshToken", refresh)
}

/**
 * Clears both the access token and refresh token from local storage.
 * 
 * This function is typically used during logout or when token refresh fails to ensure that no invalid tokens remain in local storage.
 */
export function clearTokens() {
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
}

/**
 * Sets the theme preference in local storage.
 * 
 * @param theme - The theme preference to set.
 */
export function setTheme(theme: string) {
  localStorage.setItem("theme", theme)
}
