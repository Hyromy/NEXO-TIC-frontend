const getCommonHeaders = () => {
  const token = localStorage.getItem('accessToken')
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

export async function request(endpoint: string, options: RequestInit = {}) {
  const config: RequestInit = {
    ...options,
    headers: {
      ...getCommonHeaders(),
      ...options.headers,
    },
  }

  try {
    const response = await fetch(endpoint, config)

    const data = await response.json().catch(() => ({})) 

    if (response.ok) {
      return data

    } else {
      throw {
        error: true,
        status: response.status,
        message: data.message || 'Error en la petición',
        originalError: data
      }
    }

  } catch (err: any) {
    if (err.error) return err

    return {
      error: true,
      message: err.message || 'Ocurrió un error inesperado de red.',
      object: err,
    }
  }
}

export const api = {
  get: (endpoint: string) => 
    request(endpoint, { method: "GET" }),

  post: (endpoint: string, body: object) =>
    request(endpoint, { method: "POST", body: JSON.stringify(body) }),

  put: (endpoint: string, body: object) =>
    request(endpoint, { method: "PUT", body: JSON.stringify(body) }),

  patch: (endpoint: string, body: object) =>
    request(endpoint, { method: "PATCH", body: JSON.stringify(body) }),

  delete: (endpoint: string) => 
    request(endpoint, { method: "DELETE" }),
}
