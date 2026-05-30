const API_URL = import.meta.env.VITE_TRIP_SERVICE_URL

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
})

export const checklistService = {
  async getByTrip(tripId) {
    const response = await fetch(`${API_URL}/api/checklist-items/trip/${tripId}`, {
      headers: getHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch checklist')
    return response.json()
  },

  async create(dto) {
    const response = await fetch(`${API_URL}/api/checklist-items`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(dto)
    })
    if (!response.ok) throw new Error('Failed to create checklist item')
    return response.json()
  },

  async toggle(id) {
    const response = await fetch(`${API_URL}/api/checklist-items/${id}/toggle`, {
      method: 'PATCH',
      headers: getHeaders()
    })
    if (!response.ok) throw new Error('Failed to toggle checklist item')
    return response.json()
  },

  async delete(id) {
    const response = await fetch(`${API_URL}/api/checklist-items/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    if (!response.ok) throw new Error('Failed to delete checklist item')
  }
}