import axios from 'axios'
import { getAuthData } from '../services/auth'

const request = axios.create({
  baseURL: process.env.REACT_APP_API_SERVER,
  headers: {},
})

request.interceptors.request.use(function (config) {
  // get the authentication token from local storage if it exists
  const token = getAuthData()

  config.headers = {
    ...config.headers,
    authorization: token ? `Bearer ${token}` : '',
  }

  return config
})

export default request
