import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { adminService } from "../services/adminService"

function AdminPage() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!user || !user.isAdmin()) {
            navigate('/trips')
            return
        }
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const data = await adminService.getUsers()
            setUsers(data)
        } catch (err) {
            setError('Failed to load users')
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Delete this user?')) return
        try {
            await adminService.deleteUser(id)
            await fetchUsers()
        } catch (err) {
            setError('Failed to delete user')
        }
    }

    if (loading) return <p>Loading...</p>
    if (error) return <p style={{ color: 'red'}}>{error}</p>

    return (
        <div>
            <h1>Admin Panel</h1>
            <h2>Users ({users.length})</h2>
            {users.map(u => (
                <div key={u.id}>
                    <p>{u.name} - {u.email} - {u.role}</p>
                    <button onClick={() => handleDeleteUser(u.id)}>Delete</button>
                </div>
            ))}
        </div>
    )
}

export default AdminPage