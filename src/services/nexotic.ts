import { api } from "./api"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/'

const param = (id: number) => (
  Number.isInteger(id) && id > 0
    ? `${id}/`
    : ""
)

export const userService = {
  endpoint: API_URL + "users/",

  get: (id: number = 0) => (
    api.get(userService.endpoint + param(id))
  ),

  create: (data: {username: string, password: string}) => (
    api.post(userService.endpoint, data)
  ),
}

export const authService = {
  endpoint: API_URL + "auth/",

  login: (username: string, password: string) => (
    api.post(
      authService.endpoint + "login/",
      {
        username,
        password,
      },
      true
    )
  ),

  refresh: (refreshToken?: string) => {
    if (!refreshToken) return null
    return api.post(authService.endpoint + "refresh/", {
      refresh: refreshToken,
    })
  },

  signup: (username: string, email: string) => (
    api.post(authService.endpoint + "signup/", {
      username,
      email,
    })
  ),

  recover: (username: string, email: string) => (
    api.post(authService.endpoint + "recover/", {
      username,
      email,
    })
  ),

  logout: (refresh: string) => (
    api.post(authService.endpoint + "logout/", {
      refresh,
    })
  ),

  changePassword: (new_password: string) => (
    api.post(authService.endpoint + "reset-password/", {
      new_password,
    })
  ),
}



export const reportService = {
  endpoint: API_URL + "reports/",

  download: async (data: {
    tipoReporte: string
    fechaInicio: string
    fechaFin: string
  }) => {
    const response = await fetch(reportService.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("No fue posible generar el reporte.")
    }

    const blob = await response.blob()

    const disposition = response.headers.get("Content-Disposition")
    let fileName = "reporte"

    if (disposition && disposition.includes("filename=")) {
      fileName = disposition
        .split("filename=")[1]
        .replace(/"/g, "")
        .trim()
    } else {
      if (data.tipoReporte === "excel") {
        fileName = "reporte.xlsx"
      } else {
        fileName = "reporte.pdf"
      }
    }

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  },
}
