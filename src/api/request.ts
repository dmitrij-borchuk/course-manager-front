import axios, { AxiosError } from 'axios'

const headers: Record<string, string> = {}
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
  function (config) {
    if (config.response.status === 401) {
      window.location.assign('/login')
    }

    return config
  }
)

export function setHeader(key: string, value: string) {
  headers[key] = value
}

export default request

export function isAxiosError(error: any): error is AxiosError {
  return error.isAxiosError
}
