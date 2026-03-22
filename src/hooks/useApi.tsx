import { useState, useCallback } from "react"

/**
 * Hook for managing API calls, including loading and error states.
 * 
 * This hook provides a standardized way to handle API calls in React components. It manages the loading state, captures any errors that occur during the API call, and stores the response data.
 * 
 * @example
 * const { data, loading, error, execute } = useApi()
 * 
 * // Running an API call
 * useEffect(() => {
 *   execute(MyApi.getData())
 * }, [])
 *
 * // Handling loading, error, and data states
 * useEffect(() => {
 *   if (loading) {
 *     console.log('Loading data...')
 *   }
 *   if (error) {
 *     console.error('Error fetching data:', error)
 *   }
 *   if (data) {
 *     console.log('Data fetched successfully:', data)
 *   }
 * }, [loading, data, error])
 * 
 * @template T - The expected type of the API response data.
 * 
 * @returns An object containing the API response data, loading state, error message, and a function to execute the API call.
 */
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
