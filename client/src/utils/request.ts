import axios from 'axios'
import { store } from '../store'

const baseURL = import.meta.env.VITE_BASE_URL

const request = axios.create({
  baseURL,
  timeout: 10000
})

// Request interceptor
request.interceptors.request.use(
  (config) => {
    const token = store.getState().userAuth.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
request.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error.response.data.errors)
  }
)

export default request
