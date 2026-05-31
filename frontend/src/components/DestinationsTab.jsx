import { useState, useEffect } from "react"
import { destinationService } from '../services/destinationService'

function DestinationsTab({ tripId }){
    const [destinations, setDestinations] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [errors, setErrors] = useState({})
    const [form, setForm] = useState({
        name: '',
        location: '',
        arrivalDate: '',
        departureDate: '',
        description: '',
        notes: '',
        tripId: tripId
    })

    useEffect(() => {
        fetchDestinations()
    }, [])

    const fetchDestinations = async () => {
        try {
          const data = await destinationService.getByTrip(tripId)
          setDestinations(data)
        } catch(err) {
          console.error(err)
        } finally {
          setLoading(false)
        }
    }

    const validate = () => {
        const newErrors = {}
        if(!form.name.trim()) newErrors.name = 'Name is required'
        if(!form.location.trim()) newErrors.location = 'Location is required'
        if(!form.arrivalDate) newErrors.arrivalDate = 'Arrival date is required'
        if(!form.departureDate) newErrors.departureDate = 'Departure date is required'
        if(form.departureDate < form.arrivalDate) newErrors.departureDate = 'Departure date cannot be before arrival date'
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
                await destinationService.update(editingId, form)
            } else {
                await destinationService.create(form)
            }
            await fetchDestinations()
            resetForm()
        } catch (err) {
            console.error(err)
        }
    }

    const handleEdit = (destination) => {
        setForm({
            name: destination.name,
            location: destination.location,
            arrivalDate: destination.arrivalDate.split('T')[0],
            departureDate: destination.departureDate.split('T')[0],
            description: destination.description || '',
            notes: destination.notes || '',
            tripId: tripId
        })
        setEditingId(destination.id)
        setShowForm(true)
    }

    const handleDelete = async (id) => {
        if(!window.confirm('Delete this destination?')) return
        try {
            await destinationService.delete(id)
            await fetchDestinations()
        } catch (err) {
            console.error(err)
        }
    }

    const resetForm = () => {
        setForm({
            name: '',
            location: '',
            arrivalDate: '',
            departureDate: '',
            description: '',
            notes: '',
            tripId: tripId
        })
        setEditingId(null)
        setShowForm(false)
        setErrors({})
    }

    if (loading) return <p>Loading...</p>

    return (
       <div>
        <button onClick={() => setShowForm(!showForm)}>+ Add Destination</button>

        {showForm && (
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input name="name" value={form.name} onChange={handleChange}/>
                    {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
                </div>
                <div>
                    <label>Location</label>
                    <input name="location" value={form.location} onChange={handleChange}/>
                    {errors.location && <p style={{ color: 'red' }}>{errors.location}</p>}
                </div>
                <div>
                    <label>Arrival Date</label>
                    <input type="date" name="arrivalDate" value={form.arrivalDate} onChange={handleChange}/>
                    {errors.arrivalDate && <p style={{ color: 'red' }}>{errors.arrivalDate}</p>}
                </div>
                <div>
                    <label>Departure Date</label>
                    <input type="date" name="departureDate" value={form.departureDate} onChange={handleChange}/>
                    {errors.departureDate && <p style={{ color: 'red' }}>{errors.departureDate}</p>}
                </div>
                <div>
                    <label>Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange}/>
                </div>
                <div>
                    <label>Notes</label>
                    <textarea name="notes" value={form.notes} onChange={handleChange}/>
                </div>
                <button type="submit">{editingId ? 'Update' : 'Add'}</button>
                <button type="button" onClick={resetForm}>Cancel</button>
            </form>
        )}

        {destinations.length === 0 ? (
            <p>No destinations yet.</p>
        ) : (
            destinations.map(dest => (
                <div key={dest.id}>
                    <h4>{dest.name}</h4>
                    <p>{dest.location}</p>
                    <p>{new Date(dest.arrivalDate).toLocaleDateString()} - {new Date(dest.departureDate).toLocaleDateString()}</p>
                    <p>{dest.description}</p>
                    <button onClick={() => handleEdit(dest)}>Edit</button>
                    <button onClick={() => handleDelete(dest.id)}>Delete</button>
                </div>
            ))
        )}
       </div> 
    )
}

export default DestinationsTab