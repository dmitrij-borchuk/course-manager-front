import axios, { AxiosError } from 'axios'

const headers: Record<string, string | undefined> = {}
const request = axios.create({
  baseURL: process.env.REACT_APP_API_GATEWAY,
  headers: headers,
})

request.interceptors.request.use(function (config) {
  config.headers = {
    ...config.headers,
    ...headers,
  }

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
}

export default request

export function isAxiosError(error: any): error is AxiosError {
  return error.isAxiosError
}
