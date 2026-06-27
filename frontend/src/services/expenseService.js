const API_URL = import.meta.env.VITE_TRIP_SERVICE_URL

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
})

export const expenseService = {
  async getByTrip(tripId) {
    const response = await fetch(`${API_URL}/api/expenses/trip/${tripId}`, {
      headers: getHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch expenses')
    return response.json()
  },

  async getExpensesPublic(tripId) {
    const response = await fetch(`${API_URL}/api/expenses/trip/${tripId}`)
    if (!response.ok) throw new Error('Failed to fetch expenses')
    return response.json()
  },

  async create(dto) {
    const response = await fetch(`${API_URL}/api/expenses`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(dto)
    })
    if (!response.ok) throw new Error('Failed to create expense')
    return response.json()
  },

  async update(id, dto) {
    const response = await fetch(`${API_URL}/api/expenses/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(dto)
    })
    if (!response.ok) throw new Error('Failed to update expense')
    return response.json()
  },

  async delete(id) {
    const response = await fetch(`${API_URL}/api/expenses/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    if (!response.ok) throw new Error('Failed to delete expense')
  }
}