import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { tripService } from "../services/tripService"

function TripsPage() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await tripService.getAll()
        setTrips(data)
      } catch (err) {
        setError('Failed to load trips')
      } finally {
        setLoading(false)
      }
    }
    fetchTrips()
  }, [])

  if (loading) return <p className="text-center mt-10 text-teal-700">Loading...</p>
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-sky-100 to-blue-200 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-teal-900">My Trips</h1>
          <button
            onClick={() => navigate('/trips/new')}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition">
            + New Trip
          </button>
        </div>

        {trips.length === 0 ? (
          <div className="text-center py-16 text-teal-700">
            <p className="text-5xl mb-4">🌍</p>
            <p className="text-xl font-medium">No trips yet</p>
            <p className="text-sm mt-2">Create your first trip and start planning!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {trips.map(trip => (
              <div
                key={trip.id}
                onClick={() => navigate(`/trips/${trip.id}`)}
                className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-5 shadow-sm hover:shadow-md cursor-pointer transition">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-teal-900">✈️ {trip.name}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(trip.startDate).toLocaleDateString()} — {new Date(trip.endDate).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-1">{trip.description}</p>
                <div className="flex gap-4 mt-3 text-sm">
                  <span className="text-teal-600 font-medium">Budget: {trip.budget}€</span>
                  <span className="text-orange-500 font-medium">Spent: {trip.totalExpenses}€</span>
                  <span className="text-blue-500 font-medium">Remaining: {trip.remainingBudget}€</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TripsPage