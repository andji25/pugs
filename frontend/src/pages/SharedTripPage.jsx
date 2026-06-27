import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { sharingService } from '../services/sharingService'
import { tripService } from '../services/tripService'
import { destinationService } from '../services/destinationService'
import { activityService } from '../services/activityService'
import { expenseService } from '../services/expenseService'
import { useAuth } from '../context/AuthContext'

const CATEGORY_OPTIONS = ['Transport', 'Accommodation', 'Food', 'Tickets', 'Shopping', 'Other']
const STATUS_OPTIONS = ['Planned', 'Reserved', 'Completed', 'Cancelled']

function SharedTripPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [trip, setTrip] = useState(null)
  const [destinations, setDestinations] = useState([])
  const [activities, setActivities] = useState([])
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [accessType, setAccessType] = useState(null)
  const [activeTab, setActiveTab] = useState('destinations')

  useEffect(() => {
    const validateAndFetch = async () => {
      try {
        const tokenData = await sharingService.validateToken(token)
        setAccessType(tokenData.accessType)

        const tripData = await tripService.getPublic(tokenData.tripId)
        setTrip(tripData)

        const [dests, acts, exps] = await Promise.all([
          destinationService.getDestinationsPublic(tokenData.tripId),
          activityService.getActivitiesPublic(tokenData.tripId),
          expenseService.getExpensesPublic(tokenData.tripId)
        ])

        setDestinations(dests)
        setActivities(acts)
        setExpenses(exps)
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
          <div className="flex items-center justify-between mb-4">
            <span className={`text-sm font-medium px-3 py-1 rounded-lg ${accessType === 0 ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
              {accessType === 0 ? '👁️ View Only' : '✏️ Edit Access'}
            </span>
            {accessType === 1 && (
              user ? (
                <button
                  onClick={() => navigate(`/trips/${trip.id}`)}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm transition">
                  ✏️ Edit Trip
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/login?redirect=/shared/${token}`)}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm transition">
                  Login to Edit
                </button>
              )
            )}
          </div>

          <h1 className="text-3xl font-bold text-teal-900 mb-2">{trip.name}</h1>
          {trip.description && <p className="text-gray-500 mb-3">{trip.description}</p>}
          <p className="text-sm text-gray-400 mb-3">
            {new Date(trip.startDate).toLocaleDateString('en-GB')} — {new Date(trip.endDate).toLocaleDateString('en-GB')}
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

        <div className="flex gap-2 mb-4">
          {['destinations', 'activities', 'expenses'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium text-sm capitalize transition ${activeTab === tab ? 'bg-teal-600 text-white' : 'bg-white/60 text-teal-700 hover:bg-white/80'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
          {activeTab === 'destinations' && (
            <div className="flex flex-col gap-3">
              {destinations.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No destinations.</p>
              ) : destinations.map(d => (
                <div key={d.id} className="bg-white/80 rounded-xl p-4 border border-sky-200">
                  <h4 className="font-semibold text-teal-900">📍 {d.name}</h4>
                  <p className="text-sm text-gray-500">{d.location}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(d.arrivalDate).toLocaleDateString('en-GB')} — {new Date(d.departureDate).toLocaleDateString('en-GB')}
                  </p>
                  {d.description && <p className="text-sm text-gray-500 mt-1">{d.description}</p>}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="flex flex-col gap-3">
              {activities.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No activities.</p>
              ) : activities.map(a => (
                <div key={a.id} className="bg-white/80 rounded-xl p-4 border border-sky-200">
                  <h4 className="font-semibold text-teal-900">🎯 {a.name}</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(a.date).toLocaleDateString('en-GB')}
                    {a.time && ` at ${a.time.substring(0, 5)}`}
                  </p>
                  {a.location && <p className="text-sm text-gray-400">📍 {a.location}</p>}
                  {a.description && <p className="text-sm text-gray-500 mt-1">{a.description}</p>}
                  <div className="flex gap-3 mt-2 text-sm">
                    <span className="text-teal-600">Est. cost: {a.estimatedCost}€</span>
                    <span className="text-gray-400">{STATUS_OPTIONS[a.status] || 'Planned'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'expenses' && (
            <div className="flex flex-col gap-3">
              {expenses.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No expenses.</p>
              ) : expenses.map(e => (
                <div key={e.id} className="bg-white/80 rounded-xl p-4 border border-sky-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-teal-900">💰 {e.name}</h4>
                      <p className="text-sm text-gray-500">{CATEGORY_OPTIONS[e.category] || 'Other'}</p>
                      <p className="text-sm text-gray-400">{new Date(e.date).toLocaleDateString('en-GB')}</p>
                      {e.description && <p className="text-sm text-gray-500 mt-1">{e.description}</p>}
                    </div>
                    <span className="text-orange-500 font-semibold">{e.amount}€</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SharedTripPage