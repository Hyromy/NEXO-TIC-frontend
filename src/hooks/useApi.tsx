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

  const execute = useCallback(async (apiCall: Promise<any>) => {
		setLoading(true)
		setError(null)

		try {
			const response = await apiCall
			if (response.error) {
				throw new Error(
					response.originalError.error
					|| response.originalError.detail
				)
			}
			setData(response)
			return response
		
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
