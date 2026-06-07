import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { adminService } from '../services/adminService'

function AdminTripDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [destinations, setDestinations] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDestinations, setShowDestinations] = useState(false)
  const [showActivities, setShowActivities] = useState(false)
  const [editingDestination, setEditingDestination] = useState(null)
  const [editingActivity, setEditingActivity] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [tripData, destData, actData] = await Promise.all([
        adminService.getTripById(id),
        adminService.getDestinationsByTrip(id),
        adminService.getActivitiesByTrip(id)
      ])
      setTrip(tripData)
      setDestinations(destData)
      setActivities(actData)
    } catch (err) {
      setError('Failed to load trip details')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateDestination = async (e) => {
    e.preventDefault()
    try {
      const updated = await adminService.updateDestination(editingDestination.id, editingDestination)
      setDestinations(destinations.map(d => d.id === updated.id ? updated : d))
      setEditingDestination(null)
    } catch (err) {
      setError('Failed to update destination')
    }
  }

  const handleDeleteDestination = async (destId) => {
    if (!window.confirm('Delete this destination?')) return
    try {
      await adminService.deleteDestination(destId)
      setDestinations(destinations.filter(d => d.id !== destId))
    } catch (err) {
      setError('Failed to delete destination')
    }
  }

  const handleUpdateActivity = async (e) => {
    e.preventDefault()
    try {
      const updated = await adminService.updateActivity(editingActivity.id, editingActivity)
      setActivities(activities.map(a => a.id === updated.id ? updated : a))
      setEditingActivity(null)
    } catch (err) {
      setError('Failed to update activity')
    }
  }

  const handleDeleteActivity = async (actId) => {
    if (!window.confirm('Delete this activity?')) return
    try {
      await adminService.deleteActivity(actId)
      setActivities(activities.filter(a => a.id !== actId))
    } catch (err) {
      setError('Failed to delete activity')
    }
  }

  if (loading) return <p className="text-center mt-10 text-teal-700">Loading...</p>
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>
  if (!trip) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-sky-100 to-blue-200 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-800 font-medium text-sm mb-6 transition">
          ← Back to Admin
        </button>

        <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm mb-6">
          <h1 className="text-3xl font-bold text-teal-900">{trip.name}</h1>
          {trip.description && <p className="text-gray-500 mt-1">{trip.description}</p>}
          <p className="text-sm text-gray-400 mt-1">
            {new Date(trip.startDate).toLocaleDateString()} — {new Date(trip.endDate).toLocaleDateString()}
          </p>
          <div className="flex gap-4 mt-3 text-sm">
            <span className="text-teal-600 font-medium">Budget: {trip.budget}€</span>
            <span className="text-orange-500 font-medium">Spent: {trip.totalExpenses}€</span>
            <span className="text-blue-500 font-medium">Remaining: {trip.remainingBudget}€</span>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-4 shadow-sm mb-4">
          <button
            onClick={() => setShowDestinations(!showDestinations)}
            className="flex items-center justify-between w-full text-teal-900 font-semibold">
            <span>📍 Destinations ({destinations.length})</span>
            <span>{showDestinations ? '▲' : '▼'}</span>
          </button>

          {showDestinations && (
            <div className="mt-4 flex flex-col gap-3">
              {destinations.length === 0 ? (
                <p className="text-gray-400 text-sm">No destinations.</p>
              ) : destinations.map(d => (
                <div key={d.id} className="bg-white/80 rounded-xl p-4 border border-sky-200">
                  {editingDestination?.id === d.id ? (
                    <form onSubmit={handleUpdateDestination} className="space-y-2">
                      <input
                        className="w-full px-3 py-2 rounded-lg border border-sky-200 bg-white text-gray-800 outline-none focus:ring-2 focus:ring-teal-400"
                        value={editingDestination.name}
                        onChange={e => setEditingDestination({ ...editingDestination, name: e.target.value })}
                        placeholder="Name" />
                      <input
                        className="w-full px-3 py-2 rounded-lg border border-sky-200 bg-white text-gray-800 outline-none focus:ring-2 focus:ring-teal-400"
                        value={editingDestination.location}
                        onChange={e => setEditingDestination({ ...editingDestination, location: e.target.value })}
                        placeholder="Location" />
                      <div className="grid grid-cols-2 gap-2">
                        <input type="date"
                          className="px-3 py-2 rounded-lg border border-sky-200 bg-white text-gray-800 outline-none focus:ring-2 focus:ring-teal-400"
                          value={editingDestination.arrivalDate?.split('T')[0]}
                          onChange={e => setEditingDestination({ ...editingDestination, arrivalDate: e.target.value })} />
                        <input type="date"
                          className="px-3 py-2 rounded-lg border border-sky-200 bg-white text-gray-800 outline-none focus:ring-2 focus:ring-teal-400"
                          value={editingDestination.departureDate?.split('T')[0]}
                          onChange={e => setEditingDestination({ ...editingDestination, departureDate: e.target.value })} />
                      </div>
                      <div className="flex gap-2">
                        <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-1 rounded-lg text-sm transition">Save</button>
                        <button type="button" onClick={() => setEditingDestination(null)} className="border border-sky-200 text-teal-700 px-4 py-1 rounded-lg text-sm hover:bg-white/80 transition">Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-teal-900">📍 {d.name}</h4>
                        <p className="text-sm text-gray-500">{d.location}</p>
                        <p className="text-sm text-gray-400">
                          {new Date(d.arrivalDate).toLocaleDateString()} — {new Date(d.departureDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingDestination(d)}
                          className="border border-teal-400 text-teal-600 px-3 py-1 rounded-lg text-sm hover:bg-teal-50 transition">✏️</button>
                        <button onClick={() => handleDeleteDestination(d.id)}
                          className="border border-orange-400 text-orange-500 px-3 py-1 rounded-lg text-sm hover:bg-orange-50 transition">🗑️</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-4 shadow-sm">
          <button
            onClick={() => setShowActivities(!showActivities)}
            className="flex items-center justify-between w-full text-teal-900 font-semibold">
            <span>🎯 Activities ({activities.length})</span>
            <span>{showActivities ? '▲' : '▼'}</span>
          </button>

          {showActivities && (
            <div className="mt-4 flex flex-col gap-3">
              {activities.length === 0 ? (
                <p className="text-gray-400 text-sm">No activities.</p>
              ) : activities.map(a => (
                <div key={a.id} className="bg-white/80 rounded-xl p-4 border border-sky-200">
                  {editingActivity?.id === a.id ? (
                    <form onSubmit={handleUpdateActivity} className="space-y-2">
                      <input
                        className="w-full px-3 py-2 rounded-lg border border-sky-200 bg-white text-gray-800 outline-none focus:ring-2 focus:ring-teal-400"
                        value={editingActivity.name}
                        onChange={e => setEditingActivity({ ...editingActivity, name: e.target.value })}
                        placeholder="Name" />
                      <div className="grid grid-cols-2 gap-2">
                        <input type="date"
                          className="px-3 py-2 rounded-lg border border-sky-200 bg-white text-gray-800 outline-none focus:ring-2 focus:ring-teal-400"
                          value={editingActivity.date?.split('T')[0]}
                          onChange={e => setEditingActivity({ ...editingActivity, date: e.target.value })} />
                        <input type="time"
                          className="px-3 py-2 rounded-lg border border-sky-200 bg-white text-gray-800 outline-none focus:ring-2 focus:ring-teal-400"
                          value={editingActivity.time || ''}
                          onChange={e => setEditingActivity({ ...editingActivity, time: e.target.value })} />
                      </div>
                      <input
                        className="w-full px-3 py-2 rounded-lg border border-sky-200 bg-white text-gray-800 outline-none focus:ring-2 focus:ring-teal-400"
                        value={editingActivity.location || ''}
                        onChange={e => setEditingActivity({ ...editingActivity, location: e.target.value })}
                        placeholder="Location" />
                      <div className="flex gap-2">
                        <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-1 rounded-lg text-sm transition">Save</button>
                        <button type="button" onClick={() => setEditingActivity(null)} className="border border-sky-200 text-teal-700 px-4 py-1 rounded-lg text-sm hover:bg-white/80 transition">Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-teal-900">🎯 {a.name}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(a.date).toLocaleDateString()} {a.time && `at ${a.time}`}
                        </p>
                        {a.location && <p className="text-sm text-gray-400">📍 {a.location}</p>}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingActivity(a)}
                          className="border border-teal-400 text-teal-600 px-3 py-1 rounded-lg text-sm hover:bg-teal-50 transition">✏️</button>
                        <button onClick={() => handleDeleteActivity(a.id)}
                          className="border border-orange-400 text-orange-500 px-3 py-1 rounded-lg text-sm hover:bg-orange-50 transition">🗑️</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminTripDetailPage