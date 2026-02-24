export function setPairTokens(access: string, refresh: string) {
  localStorage.setItem("accessToken", access)
  localStorage.setItem("refreshToken", refresh)
}

export function clearTokens() {
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
}

export function setTheme(theme: string) {
  localStorage.setItem("theme", theme)
}
