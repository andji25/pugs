const API_URL = import.meta.env.VITE_TRIP_SERVICE_URL

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
})

export const destinationService = {
  async getByTrip(tripId) {
    const response = await fetch(`${API_URL}/api/destinations/trip/${tripId}`, {
      headers: getHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch destinations')
    return response.json()
  },

  async create(dto) {
    const response = await fetch(`${API_URL}/api/destinations`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(dto)
    })
    if (!response.ok) throw new Error('Failed to create destination')
    return response.json()
  },

  async update(id, dto) {
    const response = await fetch(`${API_URL}/api/destinations/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(dto)
    })
    if (!response.ok) throw new Error('Failed to update destination')
    return response.json()
  },

  async delete(id) {
    const response = await fetch(`${API_URL}/api/destinations/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    if (!response.ok) throw new Error('Failed to delete destination')
  }
}