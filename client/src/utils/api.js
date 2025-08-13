import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true
})

// attach token if present
api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('user')
  if (raw) {
    try {
      const { token } = JSON.parse(raw)
      if (token) config.headers.Authorization = `Bearer ${token}`

      return config
    } catch {
      console.error("Error parsing stored user:", err);
    }
  }
  return config
})

export default api
