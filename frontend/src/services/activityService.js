const API_URL = import.meta.env.VITE_TRIP_SERVICE_URL

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
})

export const activityService = {
  async getByTrip(tripId) {
    const response = await fetch(`${API_URL}/api/activities/trip/${tripId}`, {
      headers: getHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch activities')
    return response.json()
  },

  async create(dto) {
    const response = await fetch(`${API_URL}/api/activities`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(dto)
    })
    if (!response.ok) throw new Error('Failed to create activity')
    return response.json()
  },

  async update(id, dto) {
    const response = await fetch(`${API_URL}/api/activities/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(dto)
    })
    if (!response.ok) throw new Error('Failed to update activity')
    return response.json()
  },

  async updateStatus(id, status) {
    const response = await fetch(`${API_URL}/api/activities/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(status)
    })
    if (!response.ok) throw new Error('Failed to update activity status')
  },

  async delete(id) {
    const response = await fetch(`${API_URL}/api/activities/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    if (!response.ok) throw new Error('Failed to delete activity')
  }
}