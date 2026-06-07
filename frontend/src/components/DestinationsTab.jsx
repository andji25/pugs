import { useState, useEffect } from "react"
import { destinationService } from '../services/destinationService'

function DestinationsTab({ tripId }) {
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
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }
    if (!form.location.trim()) {
      newErrors.location = 'Location is required'
    } else if (form.location.trim().length < 2) {
      newErrors.location = 'Location must be at least 2 characters'
    }
    if (!form.arrivalDate) newErrors.arrivalDate = 'Arrival date is required'
    if (!form.departureDate) {
      newErrors.departureDate = 'Departure date is required'
    } else if (form.departureDate < form.arrivalDate) {
      newErrors.departureDate = 'Departure date cannot be before arrival date'
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

    try {
      if (editingId) {
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
    if (!window.confirm('Delete this destination?')) return
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

  if (loading) return <p className="text-center text-teal-700">Loading...</p>

  return (
    <div>
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition mb-4">
        + Add Destination
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white/80 rounded-xl p-4 mb-4 space-y-3 border border-sky-200">
          <div>
            <label className="block text-sm font-medium text-teal-800 mb-1">Name</label>
            <input name="name" value={form.name} onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border bg-white text-gray-800 focus:ring-2 focus:ring-teal-400 outline-none ${errors.name ? 'border-red-400' : 'border-sky-200'}`} />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-teal-800 mb-1">Location</label>
            <input name="location" value={form.location} onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border bg-white text-gray-800 focus:ring-2 focus:ring-teal-400 outline-none ${errors.location ? 'border-red-400' : 'border-sky-200'}`} />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-teal-800 mb-1">Arrival Date</label>
              <input type="date" name="arrivalDate" value={form.arrivalDate} onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg border bg-white text-gray-800 focus:ring-2 focus:ring-teal-400 outline-none ${errors.arrivalDate ? 'border-red-400' : 'border-sky-200'}`} />
              {errors.arrivalDate && <p className="text-red-500 text-sm mt-1">{errors.arrivalDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-teal-800 mb-1">Departure Date</label>
              <input type="date" name="departureDate" value={form.departureDate} onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg border bg-white text-gray-800 focus:ring-2 focus:ring-teal-400 outline-none ${errors.departureDate ? 'border-red-400' : 'border-sky-200'}`} />
              {errors.departureDate && <p className="text-red-500 text-sm mt-1">{errors.departureDate}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-teal-800 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={2}
              className="w-full px-3 py-2 rounded-lg border border-sky-200 bg-white text-gray-800 focus:ring-2 focus:ring-teal-400 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-teal-800 mb-1">Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={2}
              className="w-full px-3 py-2 rounded-lg border border-sky-200 bg-white text-gray-800 focus:ring-2 focus:ring-teal-400 outline-none" />
          </div>
          <div className="flex gap-2">
            <button type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm transition">
              {editingId ? 'Update' : 'Add'}
            </button>
            <button type="button" onClick={resetForm}
              className="border border-sky-200 text-teal-700 px-4 py-2 rounded-lg text-sm hover:bg-white/80 transition">
              Cancel
            </button>
          </div>
        </form>
      )}

      {destinations.length === 0 ? (
        <p className="text-center text-gray-400 py-8">No destinations yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {destinations.map(dest => (
            <div key={dest.id} className="bg-white/80 rounded-xl p-4 border border-sky-200 flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-teal-900">📍 {dest.name}</h4>
                <p className="text-sm text-gray-500">{dest.location}</p>
                <p className="text-sm text-gray-400">
                  {new Date(dest.arrivalDate).toLocaleDateString()} — {new Date(dest.departureDate).toLocaleDateString()}
                </p>
                {dest.description && <p className="text-sm text-gray-500 mt-1">{dest.description}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(dest)}
                  className="border border-teal-400 text-teal-600 px-3 py-1 rounded-lg text-sm hover:bg-teal-50 transition">
                  ✏️
                </button>
                <button onClick={() => handleDelete(dest.id)}
                  className="border border-orange-400 text-orange-500 px-3 py-1 rounded-lg text-sm hover:bg-orange-50 transition">
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DestinationsTab