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
    if (isEdit) {
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
    if (!form.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }
    if (!form.startDate) newErrors.startDate = 'Start date is required'
    if (!form.endDate) newErrors.endDate = 'End date is required'
    if (form.endDate < form.startDate) newErrors.endDate = 'End date cannot be before start date'
    if (!form.budget && form.budget !== 0) {
      newErrors.budget = 'Budget is required'
    } else if (form.budget < 0) {
      newErrors.budget = 'Budget cannot be negative'
    }
    return newErrors
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      if (isEdit) {
        await tripService.update(id, form)
      } else {
        await tripService.create(form)
      }
      navigate('/trips')
    } catch (err) {
      setErrors({ general: 'Something went wrong. Please try again. ' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-sky-100 to-blue-200 py-8">
      <div className="max-w-2xl mx-auto px-6">
        <button
          onClick={() => navigate('/trips')}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-800 font-medium text-sm mb-6 transition">
          ← Back to Trips
        </button>

        <h1 className="text-3xl font-bold text-teal-900 mb-6">
          {isEdit ? 'Edit Trip' : 'New Trip'}
        </h1>

        <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-teal-800 mb-1">Trip Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Summer in Italy"
                className={`w-full px-4 py-3 rounded-lg border bg-white/80 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-400 outline-none ${errors.name ? 'border-red-400' : 'border-sky-200'}`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-teal-800 mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Short description of your trip..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-sky-200 bg-white/80 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-400 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-teal-800 mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border bg-white/80 text-gray-800 focus:ring-2 focus:ring-teal-400 outline-none ${errors.startDate ? 'border-red-400' : 'border-sky-200'}`}
                />
                {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-800 mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border bg-white/80 text-gray-800 focus:ring-2 focus:ring-teal-400 outline-none ${errors.endDate ? 'border-red-400' : 'border-sky-200'}`}
                />
                {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-teal-800 mb-1">Budget (€)</label>
              <input
                type="number"
                name="budget"
                value={form.budget}
                onChange={handleChange}
                placeholder="0"
                className={`w-full px-4 py-3 rounded-lg border bg-white/80 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-400 outline-none ${errors.budget ? 'border-red-400' : 'border-sky-200'}`}
              />
              {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-teal-800 mb-1">Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Any additional notes..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-sky-200 bg-white/80 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-400 outline-none"
              />
            </div>

            {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-md transition disabled:opacity-50">
                {loading ? 'Saving...' : isEdit ? 'Update Trip' : 'Create Trip'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/trips')}
                className="flex-1 py-3 border border-sky-200 bg-white/50 text-teal-700 rounded-lg hover:bg-white/80 transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default TripFormPage