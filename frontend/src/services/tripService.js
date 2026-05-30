const API_URL = import.meta.env.VITE_TRIP_SERVICE_URL

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  })

  export const tripService = {
    async getAll() {
        const response = await fetch(`${API_URL}/api/trips`, {
            headers: getHeaders()
          })
          if (!response.ok) throw new Error('Failed to fetch trips')
          return response.json()
    },

    async getById(id) {
        const response = await fetch(`${API_URL}/api/trips/${id}`, {
          headers: getHeaders()
        })
        if (!response.ok) throw new Error('Failed to fetch trip')
        return response.json()
    },

    async create(dto) {
        const response = await fetch(`${API_URL}/api/trips`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(dto)
        })
        if (!response.ok) throw new Error('Failed to create trip')
        return response.json()
    },

    async update(id, dto) {
        const response = await fetch(`${API_URL}/api/trips/${id}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(dto)
        })
        if (!response.ok) throw new Error('Failed to update trip')
        return response.json()
    },

    async delete(id) {
        const response = await fetch(`${API_URL}/api/trips/${id}`, {
          method: 'DELETE',
          headers: getHeaders()
        })
        if (!response.ok) throw new Error('Failed to delete trip')
    }

}