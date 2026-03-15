import { useState, useCallback } from "react"

export default function useApi<T>() {
	const [data, setData] = useState<T | null>(null)
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async (...apiCalls: Promise<any>[]) => {
		setLoading(true)
		setError(null)

		try {
      const isSingle = apiCalls.length === 1
      const results = isSingle 
        ? await apiCalls[0] 
        : await Promise.all(apiCalls)

      if (isSingle) {
        if (results.error) {
          throw new Error(results.originalError?.error || results.originalError?.detail)
        }
      } else {
        const errorInBatch = (results as any[]).find(r => r.error)
        if (errorInBatch) {
          throw new Error(errorInBatch.originalError?.error || errorInBatch.originalError?.detail)
        }
      }

      setData(results)
      return results
		
		} catch (err: any) {
			setError(err.message || 'Ocurrió un error inesperado.')
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
