import { useState, useEffect } from "react"
import { decodeJWT } from "../utils/jwt"
import { getAccessToken } from "../utils/getters"

export type UserType = "employee" | "rrhh" | "admin" | null

export default function useUser() {
  const [userType, setUserType] = useState<UserType>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getAccessToken()
    if (token) {
      const decoded = decodeJWT(token)
      if (decoded) {
        let userType = "employee"

        if (decoded.is_staff) userType = "admin"
        else if (decoded.is_superuser) userType = "rrhh"

        setUserType(userType as UserType)
      }
    }
    setLoading(false)
  }, [])

  const canAccessEmployee = () => userType == "employee" || userType == "admin"
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
