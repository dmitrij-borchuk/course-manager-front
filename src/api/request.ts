import axios, { AxiosError } from 'axios'

// TODO: probably we don't need it
const headers: Record<string, string | undefined> = {}
const request = axios.create({
  baseURL: import.meta.env.VITE_API_GATEWAY,
  headers: headers,
})

request.interceptors.request.use(function (config) {
  return config
})

request.interceptors.response.use(
  function (config) {
    return config
  },
  function (error) {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      // Redirect ot login page when unauthorized
      window.location.assign('/login')
    }

    throw error
  }
)

export function setHeader(key: string, value?: string) {
  headers[key] = value
  request.defaults.headers.common[key] = value
}

export default request

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isAxiosError<T = unknown>(error: any): error is AxiosError<T> {
  return error.isAxiosError
}
