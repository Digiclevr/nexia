import axios from 'axios'

// Créer une instance axios simple pour le développement
export const api = axios.create({
  baseURL: 'http://localhost:6000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Log toutes les requêtes pour le debug
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Log toutes les réponses
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data)
    return response
  },
  (error) => {
    console.error('API Response Error:', error.message)
    if (error.response) {
      console.error('Response data:', error.response.data)
      console.error('Response status:', error.response.status)
    }
    return Promise.reject(error)
  }
)
