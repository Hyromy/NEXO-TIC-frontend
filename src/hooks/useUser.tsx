import { useState, useEffect } from "react"
import { decodeJWT } from "../utils/jwt"
import { getAccessToken } from "../utils/getters"

export type UserType = "employee" | "rrhh" | "admin" | null

/**
 * Hook for managing user authentication and access control based on JWT tokens.
 * 
 * @example
 * const { userType, loading, canAccessEmployee, canAccessRRHH, canAccessAdmin } = useUser()
 * 
 * // Handling user access in a component
 * useEffect(() => {
 *   if (loading) {
 *     console.log('Checking user authentication...')
 *   }
 *   if (userType) {
 *     console.log('User type:', userType)
 *   }
 * }, [loading, userType])
 *
 * if (canAccessAdmin()) {
 *   console.log('User has admin access')
 * }
 * if (canAccessRRHH()) {
 *   console.log('User has RRHH access')
 * }
 * if (canAccessEmployee()) {
 *   console.log('User has employee access')
 * }
 * 
 * @returns An object containing the user type, loading state, and access control functions.
 */
export default function useUser() {
  const [userType, setUserType] = useState<UserType>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getAccessToken()
    if (token) {
      const decoded = decodeJWT(token)
      if (decoded) {
        let userType = "employee"

        if (decoded.is_staff) userType = "rrhh"
        else if (decoded.is_superuser) userType = "admin"

        setUserType(userType as UserType)
      }
    }
    setLoading(false)
  }, [])

  const canAccessEmployee = () => userType == "employee" || userType == "rrhh"
  const canAccessRRHH = () => userType == "rrhh" || userType == "admin"
  const canAccessAdmin = () => userType == "admin"

  return {
    userType,
    loading,
    canAccessEmployee,
    canAccessRRHH,
    canAccessAdmin,
  }
}
