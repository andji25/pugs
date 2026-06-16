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
  const [editingTrip, setEditingTrip] = useState(null)
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
    if (!window.confirm('Delete this trip?')) return
    try {
      await adminService.deleteTrip(id)
      setTrips(trips.filter(t => t.id != id))
    } catch (err) {
      setError('Failed to delete trip')
    }
  }

  const handleUpdateTrip = async (e) => {
    e.preventDefault()
    try {
      const updated = await adminService.updateTrip(editingTrip.id, editingTrip)
      setTrips(trips.map(t => t.id === updated.id ? updated : t))
      setEditingTrip(null)
    } catch (err) {
      setError('Failed to update trip')
    }
  }

  if (loading) return <p className="text-center mt-10 text-teal-700">Loading...</p>
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-sky-100 to-blue-200 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-teal-900 mb-6">Admin Panel</h1>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'users' ? 'bg-teal-600 text-white' : 'bg-white/60 text-teal-700 hover:bg-white/80'}`}>
            👤 Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('trips')}
            className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'trips' ? 'bg-teal-600 text-white' : 'bg-white/60 text-teal-700 hover:bg-white/80'}`}>
            ✈️ Trips ({trips.length})
          </button>
        </div>

        {activeTab === 'users' && (
          <div className="flex flex-col gap-3">
            {users.map(u => (
              <div key={u.id} className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl shadow-sm">
                <span className="text-gray-700">
                  👤 <span className="font-medium">{u.name}</span> — {u.email} —{' '}
                  <span className={`text-sm font-semibold ${u.role === 1 ? 'text-purple-600' : 'text-teal-600'}`}>
                    {u.role === 1 ? 'Admin' : 'User'}
                  </span>
                </span>
                <button
                  onClick={() => handleDeleteUser(u.id)}
                  className="border border-orange-400 text-orange-500 rounded-lg px-3 py-1 hover:bg-orange-50 transition">
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'trips' && (
          <div className="flex flex-col gap-3">
            {trips.map(t => (
              <div key={t.id} className="p-4 bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl shadow-sm">
                {editingTrip?.id === t.id ? (
                  <form onSubmit={handleUpdateTrip} className="space-y-2">
                    <input
                      className="w-full px-3 py-2 rounded-lg border border-sky-200 bg-white text-gray-800 focus:ring-2 focus:ring-teal-400 outline-none"
                      value={editingTrip.name}
                      onChange={e => setEditingTrip({ ...editingTrip, name: e.target.value })}
                      placeholder="Name" />
                    <input
                      className="w-full px-3 py-2 rounded-lg border border-sky-200 bg-white text-gray-800 focus:ring-2 focus:ring-teal-400 outline-none"
                      value={editingTrip.description || ''}
                      onChange={e => setEditingTrip({ ...editingTrip, description: e.target.value })}
                      placeholder="Description" />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="date"
                        className="px-3 py-2 rounded-lg border border-sky-200 bg-white text-gray-800 focus:ring-2 focus:ring-teal-400 outline-none"
                        value={editingTrip.startDate?.split('T')[0]}
                        onChange={e => setEditingTrip({ ...editingTrip, startDate: e.target.value })} />
                      <input type="date"
                        className="px-3 py-2 rounded-lg border border-sky-200 bg-white text-gray-800 focus:ring-2 focus:ring-teal-400 outline-none"
                        value={editingTrip.endDate?.split('T')[0]}
                        onChange={e => setEditingTrip({ ...editingTrip, endDate: e.target.value })} />
                    </div>
                    <input type="number"
                      className="w-full px-3 py-2 rounded-lg border border-sky-200 bg-white text-gray-800 focus:ring-2 focus:ring-teal-400 outline-none"
                      value={editingTrip.budget}
                      onChange={e => setEditingTrip({ ...editingTrip, budget: parseFloat(e.target.value) })}
                      placeholder="Budget" />
                    <div className="flex gap-2">
                      <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-1 rounded-lg text-sm transition">Save</button>
                      <button type="button" onClick={() => setEditingTrip(null)} className="border border-sky-200 text-teal-700 px-4 py-1 rounded-lg text-sm hover:bg-white/80 transition">Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-teal-900">✈️ {t.name}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(t.startDate).toLocaleDateString('en-GB')} — {new Date(t.endDate).toLocaleDateString('en-GB')}
                      </p>
                      <p className="text-sm text-gray-500">
                        Budget: {t.budget}€ | Spent: {t.totalExpenses}€ | Remaining: {t.remainingBudget}€
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/trips/${t.id}`)}
                        className="border border-sky-400 text-sky-600 rounded-lg px-3 py-1 hover:bg-sky-50 transition">
                        👁️
                      </button>
                      <button
                        onClick={() => setEditingTrip(t)}
                        className="border border-teal-400 text-teal-600 rounded-lg px-3 py-1 hover:bg-teal-50 transition">
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteTrip(t.id)}
                        className="border border-orange-400 text-orange-500 rounded-lg px-3 py-1 hover:bg-orange-50 transition">
                        🗑️
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPage