import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { tripService } from "../services/tripService"

function TripFormPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const isEdit = !!id

    const [form, setForm] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        budget: '',
        notes: ''
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(isEdit) {
            const fetchTrip = async () => {
                try {
                    const data = await tripService.getById(id)
                    setForm({
                        name: data.name,
                        description: data.description,
                        startDate: data.startDate.split('T')[0],
                        endDate: data.endDate.split('T')[0],
                        budget: data.budget,
                        notes: data.notes || ''
                    })
                } catch (err) {
                    console.error(err)
                }
            }
            fetchTrip()
        }
    }, [id])

    const validate = () => {
        const newErrors = {}
        if(!form.name.trim()) newErrors.name = 'Name is required'
        if(!form.startDate) newErrors.startDate = 'Start date is required'
        if(!form.endDate) newErrors.endDate = 'End date is required'
        if(form.endDate < form.startDate) newErrors.endDate = 'End date cannot be before start date'
        if(form.budget < 0) newErrors.budget = 'Budget cannot be negative'
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

        setLoading(true)
        try {
            if(isEdit){
                await tripService.update(id, form)
            } else {
                await tripService.create(form)
            }
            navigate('/trips')
        } catch(err) {
            setErrors({ general: 'Something went wrong. Please try again. '})
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h1>{isEdit ? 'Edit Trip' : 'New Trip'}</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input name="name" value={form.name} onChange={handleChange}/>
                    {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
                </div>
                <div>
                    <label>Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange}/>
                </div>
                <div>
                    <label>Start Date</label>
                    <input type="date" name="startDate" value={form.startDate} onChange={handleChange}/>
                    {errors.startDate && <p style={{ color: 'red' }}>{errors.startDate}</p>}
                </div>
                <div>
                    <label>End Date</label>
                    <input type="date" name="endDate" value={form.endDate} onChange={handleChange}/>
                    {errors.endDate && <p style={{ color: 'red' }}>{errors.endDate}</p>}
                </div>
                <div>
                    <label>Budget (€)</label>
                    <input type="number" name="budget" value={form.budget} onChange={handleChange}/>
                    {errors.budget && <p style={{ color: 'red' }}>{errors.budget}</p>}
                </div>
                <div>
                    <label>Notes</label>
                    <textarea name="notes" value={form.notes} onChange={handleChange}/>
                </div>
                {errors.general && <p style={{ color: 'red' }}>{errors.general}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : isEdit ? 'Update Trip' : 'Create Trip'}
                </button>
                <button type="button" onClick={() => navigate('/trips')}>Cancel</button>
            </form>
        </div>
    )
}

export default TripFormPage