import { useState, useEffect } from "react"
import { activityService } from '../services/activityService'
import CalendarView from './CalendarView'

const STATUS_OPTIONS = ['Planned', 'Reserved', 'Completed', 'Cancelled']
const STATUS_MAP = { 'Planned': 0, 'Reserved': 1, 'Completed': 2, 'Cancelled': 3 }

function ActivitiesTab({ tripId }) {
    const [activities, setActivities] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [errors, setErrors] = useState({})
    const [showCalendar, setShowCalendar] = useState(false)
    const [form, setForm] = useState({
        name: '',
        date: '',
        time: '',
        location: '',
        description: '',
        estimatedCost: '',
        status: 0,
        tripId: tripId
    })

    useEffect(() => {
        fetchActivities()
    }, [])

    const fetchActivities = async () => {
        try {
            const data = await activityService.getByTrip(tripId)
            setActivities(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const validate = () => {
        const newErrors = {}
        if(!form.name.trim()) newErrors.name = 'Name is required'
        if(!form.date) newErrors.date = 'Date is required'
        if(form.estimatedCost < 0) newErrors.estimatedCost = 'Cost cannot be negative'
        return newErrors
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const validationErrors = validate()
        if(Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }
        
        try {
            if(editingId) {
                await activityService.update(editingId, form)
            } else {
                await activityService.create(form)
            }
            await fetchActivities()
            resetForm()
        } catch (err) {
            console.error(err)
        }
    }

    const handleEdit = (activity) => {
        setForm({
            name: activity.name,
            date: activity.date.split('T')[0],
            time: activity.time || '',
            location: activity.location || '',
            description: activity.description || '',
            estimatedCost: activity.estimatedCost,
            status: activity.status,
            tripId: tripId
        })

        setEditingId(activity.id)
        setShowForm(true)
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this activity?')) return
        try {
            await activityService.delete(id)
            await fetchActivities()
        } catch (err) {
            console.error(err)
        }
    }

    const handleStatusChange = async (id, status) => {
        try {
            await activityService.updateStatus(id, STATUS_MAP[status])
            await fetchActivities()
        } catch (err) {
            console.error(err)
        }
    }

    const resetForm = () => {
        setForm({
            name: '',
            date: '',
            time: '',
            location: '',
            description: '',
            estimatedCost: '',
            status: 0,
            tripId: tripId
        })
        setEditingId(null)
        setShowForm(false)
        setErrors({})
    }

    const getStatusLabel = (status) => STATUS_OPTIONS[status] || 'Planned'

    if (loading) return <p>Loading...</p>

    return (
        <div>
            <button onClick={() => setShowForm(!showForm)}>+ Add Activity</button>
            <button onClick={() => setShowCalendar(!showCalendar)}>
                {showCalendar ? 'List View' : 'Calendar View'}
            </button>
            {showForm && (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Name</label>
                        <input name="name" value={form.name} onChange={handleChange}/>
                        {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
                    </div>
                    <div>
                        <label>Date</label>
                        <input type="date" name="date" value={form.date} onChange={handleChange}/>
                        {errors.date && <p style={{ color: 'red' }}>{errors.date}</p>}
                    </div>
                    <div>
                        <label>Time</label>
                        <input type="time" name="time" value={form.time} onChange={handleChange}/>
                    </div>
                    <div>
                        <label>Location</label>
                        <input name="location" value={form.location} onChange={handleChange}/>
                    </div>
                    <div>
                        <label>Description</label>
                        <textarea name="description" value={form.description} onChange={handleChange}/>
                    </div>
                    <div>
                        <label>Estimated cost (€)</label>
                        <input type="number" name="estimatedCost" value={form.estimatedCost} onChange={handleChange}/>
                        {errors.estimatedCost && <p style={{ color: 'red' }}>{errors.estimatedCost}</p>}
                    </div>
                    <div>
                        <label>Status</label>
                        <select name="status" value={form.status} onChange={handleChange}>
                            {STATUS_OPTIONS.map((s, i) => (
                                <option key={s} value={i}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit">{editingId ? 'Update' : 'Add'}</button>
                    <button type="button" onClick={resetForm}>Cancel</button>
                </form>
            )}

            {showCalendar ? (
                <CalendarView activities={activities} />
            ) : (
                activities.length === 0 ? (
                    <p>No activities yet.</p>
                ) : (
                    activities.map(activity => (
                        <div key={activity.id}>
                            <h4>{activity.name}</h4>
                            <p>{new Date(activity.date).toLocaleDateString()} {activity.time}</p>
                            <p>{activity.location}</p>
                            <p>{activity.description}</p>
                            <p>Estimated cost: {activity.estimatedCost}€</p>
                            <select 
                                value={getStatusLabel(activity.status)}
                                onChange={(e) => handleStatusChange(activity.id, e.target.value)}
                            >
                                {STATUS_OPTIONS.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                            <button onClick={() => handleEdit(activity)}>Edit</button>
                            <button onClick={() => handleDelete(activity.id)}>Delete</button>
                        </div>
                    ))
                )
            )}
        </div>
    )
}

export default ActivitiesTAb