const API_URL = import.meta.env.VITE_USER_SERVICE_URL
const TRIP_API_URL = import.meta.env.VITE_TRIP_SERVICE_URL

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
})

export const adminService = {
  async getUsers() {
    const response = await fetch(`${API_URL}/api/admin/users`, {
      headers: getHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch users')
    return response.json()
  },

  async deleteUser(id) {
    const response = await fetch(`${API_URL}/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch users')
  },

  async deleteUserTrips(userId) {
    const response = await fetch(`${TRIP_API_URL}/api/admin/trips/user/${userId}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    if (!response.ok) throw new Error('Failed to delete user trips')
  },

  async getAllTrips() {
    const response = await fetch(`${TRIP_API_URL}/api/admin/trips`, {
      headers: getHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch trips')
    return response.json()
  },

  async getTripById(id) {
    const response = await fetch(`${TRIP_API_URL}/api/admin/trips/${id}`, {
      headers: getHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch trip')
    return response.json()
  },

  async updateTrip(id, dto) {
    const response = await fetch(`${TRIP_API_URL}/api/admin/trips/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(dto)
    })
    if (!response.ok) throw new Error('Failed to update trip')
    return response.json()
  },

  async deleteTrip(id) {
    const response = await fetch(`${TRIP_API_URL}/api/admin/trips/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    if (!response.ok) throw new Error('Failed to delete trip')
  },

  async getDestinationsByTrip(tripId) {
    const response = await fetch(`${TRIP_API_URL}/api/admin/destinations/trip/${tripId}`, {
      headers: getHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch destinations')
    return response.json()
  },

  async updateDestination(id, dto) {
    const response = await fetch(`${TRIP_API_URL}/api/admin/destinations/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(dto)
    })
    if (!response.ok) throw new Error('Failed to update destination')
    return response.json()
  },

  async deleteDestination(id) {
    const response = await fetch(`${TRIP_API_URL}/api/admin/destinations/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    if (!response.ok) throw new Error('Failed to delete destination')
  },

  async getActivitiesByTrip(tripId) {
    const response = await fetch(`${TRIP_API_URL}/api/admin/activities/trip/${tripId}`, {
      headers: getHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch activities')
    return response.json()
  },

  async updateActivity(id, dto) {
    const response = await fetch(`${TRIP_API_URL}/api/admin/activities/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(dto)
    })
    if (!response.ok) throw new Error('Failed to update activity')
    return response.json()
  },

  async deleteActivity(id) {
    const response = await fetch(`${TRIP_API_URL}/api/admin/activities/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    if (!response.ok) throw new Error('Failed to delete activity')
  },

  async getExpensesByTrip(tripId) {
    const response = await fetch(`${TRIP_API_URL}/api/admin/expenses/trip/${tripId}`, {
      headers: getHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch expenses')
    return response.json()
  },

  async updateExpense(id, dto) {
    const response = await fetch(`${TRIP_API_URL}/api/admin/expenses/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(dto)
    })
    if (!response.ok) throw new Error('Failed to update expense')
    return response.json()
  },
  
  async deleteExpense(id) {
    const response = await fetch(`${TRIP_API_URL}/api/admin/expenses/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    if (!response.ok) throw new Error('Failed to delete expense')
  },

  async getChecklistByTrip(tripId) {
    const response = await fetch(`${TRIP_API_URL}/api/admin/checklist/trip/${tripId}`, {
      headers: getHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch checklist')
    return response.json()
  },
  
  async deleteChecklistItem(id) {
    const response = await fetch(`${TRIP_API_URL}/api/admin/checklist/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    if (!response.ok) throw new Error('Failed to delete checklist item')
  }
}