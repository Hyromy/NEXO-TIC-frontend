/**
 * Decodes a JWT (JSON Web Token) and returns its payload.
 * 
 * @param token - The JWT to decode.
 * @returns The decoded payload or null if decoding fails.
 */
export function decodeJWT(token: string): any {
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
    return null
  }
}

/**
 * Checks if a JWT (JSON Web Token) is expired.
 * 
 * @param token - The JWT to check.
 * @param bufferSeconds - The buffer time in seconds to consider the token as expired.
 * @returns True if the token is expired, false otherwise.
 */
export function isTokenExpired(token: string, bufferSeconds: number = 5): boolean {
  if (!token) return true
  
  const decoded = decodeJWT(token)
  if (!decoded) return false
  if (!decoded.exp) return true
  
  const now = Date.now() / 1000
  return decoded.exp - bufferSeconds < now
}

/**
 * Retrieves the remaining time for a JWT (JSON Web Token) to expire.
 * 
 * @param token - The JWT to check.
 * @returns The remaining time in seconds or 0 if the token is invalid or expired.
 */
export function getTokenRemainingTime(token: string): number {
  if (!token) return 0
  
  const decoded = decodeJWT(token)
  if (!decoded || !decoded.exp) return 0
  
  const now = Date.now() / 1000
  return Math.max(0, decoded.exp - now)
}
