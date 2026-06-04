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

  if(loading) return <p>Loading...</p>
  if(error) return <p style={{ color: 'red' }}>{error}</p>

  return (
    <div>
      <h1>My Trips</h1>
      <button onClick={() => navigate('/trips/new')}>+ New Trip</button>
      {trips.length === 0 ? (
        <p>No trips yet. Create your first trip!</p>
      ) : (
        trips.map(trip => (
          <div key={trip.id} onClick={() => navigate(`/trips/${trip.id}`)}>
            <h3>{trip.name}</h3>
            <p>{trip.description}</p>
            <p>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</p>
            <p>Budget: {trip.budget}€ | Spent: {trip.totalExpenses}€ | Remaining: {trip.remainingBudget}€</p>
          </div>
        ))
      )}
    </div>
  )
}

export default TripsPage