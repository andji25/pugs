const API_URL = import.meta.env.VITE_USER_SERVICE_URL

const getHeaders = () => ({
    'Content-Type': 'application-json',
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
    }
}