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
