import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { tripService } from "../services/tripService"
import DestinationTab from '../components/DestinationsTab'
import ActivitiesTab from '../components/ActivitiesTab'
import ExpensesTab from '../components/ExpensesTab'
import ChecklistTab from '../components/ChecklistTab'
import ShareTripModal from '../components/ShareTripModal'

function TripDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('destinations')
  const [showShareModal, setShowShareModal] = useState(false)

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const data = await tripService.getById(id)
        setTrip(data)
      } catch (err) {
        setError('Failed to load trip')
      } finally {
        setLoading(false)
      }
    }
    fetchTrip()
  }, [id])

  const handleDelete = async () => {
    if(!window.confirm('Are you sure you want to delete this trip?')) return
    try {
      await tripService.delete(id)
      navigate('/trips')
    } catch (err) {
      setError('Failed to delete trip')
    }
  }

  if (loading) return <p>Loading...</p>
  if(error) return <p style={{ color: 'red'}}>{error}</p>
  if(!trip) return null
  
  return (
    <div>
      <button onClick={() => navigate('/trips')}>← Back</button>
      <h1>{trip.name}</h1>
      <p>{trip.description}</p>
      <p>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</p>
      <p>Budget: {trip.budget}€ | Spent: {trip.totalExpenses}€ | Remaining: {trip.remainingBudget}€</p>
      <button onClick={() => navigate(`/trips/${id}/edit`)}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
      <button onClick={() => setShowShareModal(true)}>Share</button>

      <div>
        <button onClick={() => setActiveTab('destinations')}>Destinations</button>
        <button onClick={() => setActiveTab('activities')}>Activities</button>
        <button onClick={() => setActiveTab('expenses')}>Expenses</button>
        <button onClick={() => setActiveTab('checklist')}>Checklist</button>
      </div>

      <div>
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
  )
}

export default TripDetailPage