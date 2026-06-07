import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { tripService } from "../services/tripService"
import DestinationTab from '../components/DestinationsTab'
import ActivitiesTab from '../components/ActivitiesTab'
import ExpensesTab from '../components/ExpensesTab'
import ChecklistTab from '../components/ChecklistTab'
import ShareTripModal from '../components/ShareTripModal'
import PdfExport from '../components/PdfExport'
import { destinationService } from "../services/destinationService"
import { activityService } from "../services/activityService"
import { expenseService } from "../services/expenseService"
import { checklistService } from "../services/checklistService"

function TripDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('destinations')
  const [showShareModal, setShowShareModal] = useState(false)
  const [destinations, setDestinations] = useState([])
  const [activities, setActivities] = useState([])
  const [expenses, setExpenses] = useState([])
  const [checklist, setChecklist] = useState([])

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const data = await tripService.getById(id)
        setTrip(data)

        const [dests, acts, exps, checks] = await Promise.all([
          destinationService.getByTrip(id),
          activityService.getByTrip(id),
          expenseService.getByTrip(id),
          checklistService.getByTrip(id)
        ])

        setDestinations(dests)
        setActivities(acts)
        setExpenses(exps)
        setChecklist(checks)

      } catch (err) {
        setError('Failed to load trip')
      } finally {
        setLoading(false)
      }
    }
    fetchTrip()
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return
    try {
      await tripService.delete(id)
      navigate('/trips')
    } catch (err) {
      setError('Failed to delete trip')
    }
  }

  if (loading) return <p className="text-center mt-10 text-teal-700">Loading...</p>
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>
  if (!trip) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-sky-100 to-blue-200 py-8">
      <div className="max-w-4xl mx-auto px-6">

        <button
          onClick={() => navigate('/trips')}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-800 font-medium text-sm mb-6 transition">
          ← Back to Trips
        </button>

        <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-teal-900">{trip.name}</h1>
              <p className="text-gray-500 mt-1">{trip.description}</p>
              <p className="text-sm text-gray-400 mt-1">
                {new Date(trip.startDate).toLocaleDateString()} — {new Date(trip.endDate).toLocaleDateString()}
              </p>
              <div className="flex gap-4 mt-3 text-sm">
                <span className="text-teal-600 font-medium">Budget: {trip.budget}€</span>
                <span className="text-orange-500 font-medium">Spent: {trip.totalExpenses}€</span>
                <span className="text-blue-500 font-medium">Remaining: {trip.remainingBudget}€</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/trips/${id}/edit`)}
                className="border border-teal-400 text-teal-600 px-3 py-1 rounded-lg text-sm hover:bg-teal-50 transition">
                ✏️ Edit
              </button>
              <button
                onClick={() => setShowShareModal(true)}
                className="border border-sky-400 text-sky-600 px-3 py-1 rounded-lg text-sm hover:bg-sky-50 transition">
                🔗 Share
              </button>
              <PdfExport
                trip={trip}
                destinations={destinations}
                activities={activities}
                expenses={expenses}
                checklist={checklist}
              />
              <button
                onClick={handleDelete}
                className="border border-orange-400 text-orange-500 px-3 py-1 rounded-lg text-sm hover:bg-orange-50 transition">
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          {['destinations', 'activities', 'expenses', 'checklist'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium text-sm capitalize transition ${activeTab === tab ? 'bg-teal-600 text-white' : 'bg-white/60 text-teal-700 hover:bg-white/80'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
          {activeTab === 'destinations' && <DestinationTab tripId={id} />}
          {activeTab === 'activities' && <ActivitiesTab tripId={id} />}
          {activeTab === 'expenses' && <ExpensesTab tripId={id} budget={trip.budget} />}
          {activeTab === 'checklist' && <ChecklistTab tripId={id} />}
        </div>

        {showShareModal && (
          <ShareTripModal
            tripId={id}
            onClose={() => setShowShareModal(false)} />
        )}
      </div>
    </div>
  )
}

export default TripDetailPage