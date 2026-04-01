import axios from 'axios'

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('@devburger:token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('@devburger:token')
      localStorage.removeItem('@devburger:user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
