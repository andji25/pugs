import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { adminService } from "../services/adminService"


function AdminPage() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('users')
    const [users, setUsers] = useState([])
    const [trips, setTrips] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!user || !user.isAdmin()) {
            navigate('/trips')
            return
        }
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [usersData, tripsData] = await Promise.all([
                adminService.getUsers(),
                adminService.getAllTrips()
            ])
            setUsers(usersData)
            setTrips(tripsData)
        } catch (err) {
            setError('Failed to load data')
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Delete this user and all their trips?')) return
        try {
            await adminService.deleteUserTrips(id)
            await adminService.deleteUser(id)
            setUsers(users.filter(u => u.id !== id))
        } catch (err) {
            setError('Failed to delete user')
        }
    }

    const handleDeleteTrip = async (id) => {
        if(!window.confirm('Delete this trip?')) return
        try {
            await adminService.deleteTrip(id)
            setTrips(trips.filter(t => t.id != id))
        } catch (err) {
            setError('Failed to delete trip')
        }
    }

    if (loading) return <p>Loading...</p>
    if (error) return <p style={{ color: 'red'}}>{error}</p>

    return (
        <div>
            <h1>Admin Panel</h1>
            <div>
                <button onClick={() => setActiveTab('users')}>Users ({users.length})</button>
                <button onClick={() => setActiveTab('trips')}>Trips ({trips.length})</button>
            </div>

            {activeTab === 'users' && (
                <div>
                    <h2>All Users</h2>
                    {users.map(u => (
                        <div key={u.id}>
                            <p>{u.name} — {u.email} — {u.role === 1 ? 'Admin' : 'User'}</p>
                            <button onClick={() => handleDeleteUser(u.id)}>Delete</button>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'trips' && (
                <div>
                    <h2>All Trips</h2>
                    {trips.map(t => (
                        <div key={t.id}>
                            <h3>{t.name}</h3>
                            <p>User ID: {t.userId} | Budget: {t.budget}€ | Spent: {t.totalExpenses}€</p>
                            <p>{new Date(t.startDate).toLocaleDateString()} - {new Date(t.endDate).toLocaleDateString()}</p>
                            <button onClick={() => navigate(`/admin/trips/${t.id}`)}>View Details</button>
                            <button onClick={() => handleDeleteTrip(t.id)}>Delete</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default AdminPage