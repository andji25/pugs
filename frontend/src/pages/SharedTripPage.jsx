import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { sharingService } from '../services/sharingService'
import { tripService } from '../services/tripService'

function SharedTripPage() {
  const { token } = useParams()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [accessType, setAccessType] = useState(null)

  useEffect(() => {
    const validateAndFetch = async () => {
      try {
        const tokenData = await sharingService.validateToken(token)
        setAccessType(tokenData.accessType)
        const tripData = await tripService.getPublic(tokenData.tripId)
        setTrip(tripData)
      } catch (err) {
        setError('This link is invalid or has expired.')
      } finally {
        setLoading(false)
      }
    }
    validateAndFetch()
  }, [token])

  if (loading) return <p className="text-center mt-10 text-teal-700">Loading...</p>
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-sky-100 to-blue-200 flex items-center justify-center">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl">
        <p className="text-5xl mb-4">🔒</p>
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    </div>
  )
  if (!trip) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-sky-100 to-blue-200 py-8">
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-sm font-medium px-3 py-1 rounded-lg ${accessType === 0 ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
              {accessType === 0 ? '👁️ View Only' : '✏️ Edit Access'}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-teal-900 mb-2">{trip.name}</h1>
          {trip.description && <p className="text-gray-500 mb-3">{trip.description}</p>}
          <p className="text-sm text-gray-400 mb-3">
            {new Date(trip.startDate).toLocaleDateString()} — {new Date(trip.endDate).toLocaleDateString()}
          </p>
          <div className="flex gap-4 text-sm">
            <span className="text-teal-600 font-medium">Budget: {trip.budget}€</span>
            <span className="text-orange-500 font-medium">Spent: {trip.totalExpenses}€</span>
            <span className="text-blue-500 font-medium">Remaining: {trip.remainingBudget}€</span>
          </div>
          {trip.notes && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-700">📝 {trip.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SharedTripPage