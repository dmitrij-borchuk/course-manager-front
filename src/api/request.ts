import axios from 'axios'

// TODO: do we need it?
const request = axios.create({
  baseURL: process.env.REACT_APP_API_SERVER,
  headers: {},
})

request.interceptors.request.use(function (config) {
  config.headers = {
    ...config.headers,
  }

  return config
})

export default request
