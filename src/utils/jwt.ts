export function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)

  } catch (error) {
    console.error('Error decoding JWT:', error)
    return null
  }
}

export function isTokenExpired(token: string, bufferSeconds: number = 5): boolean {
  if (!token) return true
  
  const decoded = decodeJWT(token)
  if (!decoded || !decoded.exp) return true
  
  const now = Date.now() / 1000
  return decoded.exp - bufferSeconds < now
}

export function getTokenRemainingTime(token: string): number {
  if (!token) return 0
  
  const decoded = decodeJWT(token)
  if (!decoded || !decoded.exp) return 0
  
  const now = Date.now() / 1000
  return Math.max(0, decoded.exp - now)
}
