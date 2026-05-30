const API_URL = import.meta.env.VITE_SHARING_SERVICE_URL

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
})

export const sharingService = {
  async createToken(dto) {
    const response = await fetch(`${API_URL}/api/share-tokens`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(dto)
    })
    if (!response.ok) throw new Error('Failed to create share token')
    return response.json()
  },

  async validateToken(token) {
    const response = await fetch(`${API_URL}/api/share-tokens/validate/${token}`, {
      headers: { 'Content-Type': 'application/json' }
    })
    if (!response.ok) throw new Error('Invalid or expired token')
    return response.json()
  },

  async getByTrip(tripId) {
    const response = await fetch(`${API_URL}/api/share-tokens/trip/${tripId}`, {
      headers: getHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch share tokens')
    return response.json()
  },

  async deactivateToken(id) {
    const response = await fetch(`${API_URL}/api/share-tokens/${id}/deactivate`, {
      method: 'PATCH',
      headers: getHeaders()
    })
    if (!response.ok) throw new Error('Failed to deactivate token')
  }
}