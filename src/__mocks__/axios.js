import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

export const mock = new MockAdapter(axios)

export default axios

export class AxiosHeaders {
  constructor() {
    this.headers = {}
  }

  setHeaders(headers) {
    this.headers = headers
  }

  getHeaders() {
    return this.headers
  }
}
