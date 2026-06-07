const API_URL = import.meta.env.VITE_USER_SERVICE_URL

export const authService = {
  async login(email, password) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
      throw new Error('Invalid credentials')
    }

    return response.json()
  },

  async register(name, email, password) {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })

    if (!response.ok) {
      throw new Error('Registration failed')
    }

    return response.json()
  }
}