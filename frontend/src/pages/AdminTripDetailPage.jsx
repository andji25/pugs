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

    if (loading) return <p>Loading...</p>
    if (error) return <p style={{ color: 'red' }}>{error}</p>
    if (!trip) return null


    return (
        <div>
            
        </div>
    )
}

export default AdminTripDetailPage