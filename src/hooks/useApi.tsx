import { useState, useCallback } from "react"

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
				throw new Error(response.message || 'Error en la petición.')
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
