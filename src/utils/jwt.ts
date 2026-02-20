export function decodeJWT(token: string): any {
  // Early validation - these are expected cases, no need to log
  if (!token || typeof token != 'string') return null
  
  const parts = token.split('.')
  if (parts.length != 3) return null
  
  const base64Url = parts[1]
  if (!base64Url) return null
  
  try {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)

  } catch (error) {
    // Invalid base64 or JSON - expected for malformed tokens, no need to log
    return null
  }
}

export function isTokenExpired(token: string, bufferSeconds: number = 5): boolean {
  if (!token) return true
  
  const decoded = decodeJWT(token)
  // If we can't decode the token, assume it's valid and let the server validate it
  if (!decoded) return false
  if (!decoded.exp) return true
  
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
