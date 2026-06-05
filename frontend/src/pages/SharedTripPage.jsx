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

    if (loading) return <p>Loading...</p>
    if (error) return <p style={{ color: 'red' }}>{error}</p>
    if (!trip) return null

    return (
        <div>
            <h1>{trip.name}</h1>
            <p>{accessType === 0 ? '👁 View only' : '✏️ Edit access'}</p>
            <p>{trip.description}</p>
            <p>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</p>
            <p>Budget: {trip.budget}€ | Spent: {trip.totalExpenses}€ | Remaining: {trip.remainingBudget}€</p>
            {trip.notes && <p>Notes: {trip.notes}</p>}
        </div>
    )
}

export default SharedTripPage