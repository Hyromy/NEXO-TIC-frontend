import { decodeJWT } from "./jwt"

export function getDataFromForm(formData: FormData) {
  const data: Record<string, string> = {}
  formData.forEach((value, key) => {
    data[key] = value as string
  })

  return data
}

export function getAccessToken() {
  return localStorage.getItem("accessToken") || ""
}

export function getRefreshToken() {
  return localStorage.getItem("refreshToken") || ""
}

export function getPairTokens() {
  return {
    accessToken: getAccessToken(),
    refreshToken: getRefreshToken(),
  }
}

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

export function getTheme() {
  return localStorage.getItem("theme")
}
