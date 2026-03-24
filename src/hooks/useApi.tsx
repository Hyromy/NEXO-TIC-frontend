import { useState, useCallback } from "react"
import type { ApiResponse } from "../services/api"

export default function useApi<T>() {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async (...apiCalls: Promise<ApiResponse<T>>[]) => {
    setLoading(true)
    setError(null)

    try {
      const isSingle = apiCalls.length === 1

      const results = isSingle
        ? await apiCalls[0]
        : await Promise.all(apiCalls)

      if (isSingle) {
        if ((results as any).error) {
          throw new Error(
            (results as any).originalError?.error ||
            (results as any).originalError?.detail ||
            (results as any).message
          )
        }

        setData(results as T)
        return results as T

      } else {
        const errorInBatch = (results as any[]).find(r => r.error)

        if (errorInBatch) {
          throw new Error(
            errorInBatch.originalError?.error ||
            errorInBatch.originalError?.detail ||
            errorInBatch.message
          )
        }

        setData(results as unknown as T)
        return results
      }

    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado.")
      return null

    } finally {
      setLoading(false)
    }
  }, [])

  return {
    data,
    loading,
    error,
    execute
  }
}
