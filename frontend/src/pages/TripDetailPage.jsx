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
  const [editingNotes, setEditingNotes] = useState(false)
  const [notesValue, setNotesValue] = useState('')

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

  const refreshTrip = async () => {
    const data = await tripService.getById(id)
    setTrip(data)
  }

  useEffect(() => {
    if (trip) {
      setNotesValue(trip.notes || '')
    }
  }, [trip])

  if (loading) return <p className="text-center mt-10 text-teal-700">Loading...</p>
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-sky-100 to-blue-200 flex items-center justify-center">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl">
        <p className="text-5xl mb-4">🔒</p>
        <p className="text-red-500 font-medium">You don't have access to this trip.</p>
        <button onClick={() => navigate('/trips')} className="mt-4 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm">
          Go to My Trips
        </button>
      </div>
    </div>
  )
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
                {new Date(trip.startDate).toLocaleDateString('en-GB')} — {new Date(trip.endDate).toLocaleDateString('en-GB')}
              </p>
              <div className="flex gap-4 mt-3 text-sm">
                <span className="text-teal-600 font-medium">Budget: {trip.budget}€</span>
                <span className="text-orange-500 font-medium">Spent: {trip.totalExpenses}€</span>
                <span className={`font-medium text-sm ${trip.remainingBudget < 0 ? 'text-red-600 font-bold' : 'text-blue-500'}`}>
                  Remaining: {trip.remainingBudget}€
                  {trip.remainingBudget < 0 && ' ⚠️ Over budget!'}
                </span>
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

          <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200 w-full">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-amber-700">📝 Notes</p>
              <button
                onClick={() => setEditingNotes(!editingNotes)}
                className="text-xs text-amber-600 hover:text-amber-800 border border-amber-300 px-2 py-1 rounded-lg transition">
                {editingNotes ? 'Cancel' : '✏️ Edit'}
              </button>
            </div>
            {editingNotes ? (
              <div>
                <textarea
                  value={notesValue}
                  onChange={(e) => setNotesValue(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-amber-300 bg-white text-gray-800 focus:ring-2 focus:ring-amber-400 outline-none text-sm"
                  placeholder="Add notes..."
                />
                <button
                  onClick={async () => {
                    await tripService.update(id, { ...trip, notes: notesValue })
                    await refreshTrip()
                    setNotesValue(notesValue)
                    setEditingNotes(false)
                  }}
                  className="mt-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-1 rounded-lg text-sm transition">
                  Save
                </button>
              </div>
            ) : (
              <p className="text-sm text-amber-600">
                {notesValue || <span className="text-amber-400 italic">No notes yet. Click Edit to add.</span>}
              </p>
            )}
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
          {activeTab === 'destinations' && <DestinationTab tripId={id} startDate={trip.startDate} endDate={trip.endDate} />}
          {activeTab === 'activities' && <ActivitiesTab tripId={id} startDate={trip.startDate} endDate={trip.endDate} remainingBudget={trip.remainingBudget} onRefresh={refreshTrip} />}
          {activeTab === 'expenses' && <ExpensesTab tripId={id} budget={trip.budget} startDate={trip.startDate} endDate={trip.endDate} remainingBudget={trip.remainingBudget} onRefresh={refreshTrip} />}
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