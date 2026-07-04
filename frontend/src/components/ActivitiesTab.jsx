import { useState, useEffect } from "react"
import { activityService } from '../services/activityService'
import CalendarView from './CalendarView'

const STATUS_OPTIONS = ['Planned', 'Reserved', 'Completed', 'Cancelled']
const STATUS_MAP = { 'Planned': 0, 'Reserved': 1, 'Completed': 2, 'Cancelled': 3 }

function ActivitiesTab({ tripId, startDate, endDate, remainingBudget, onRefresh }) {
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
    if (!form.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }
    if (!form.date) {
      newErrors.date = 'Date is required'
    } else if (form.date < startDate?.split('T')[0] || form.date > endDate?.split('T')[0]) {
      newErrors.date = 'Date must be within the trip period'
    }
    if (!form.time) 
      newErrors.time = 'Time is required'
    if (!form.estimatedCost || form.estimatedCost === '') {
      newErrors.estimatedCost = 'Estimated cost is required'
    } else if (form.estimatedCost < 0) {
      newErrors.estimatedCost = 'Cost cannot be negative'
    } else if (parseFloat(form.estimatedCost) > remainingBudget) {
      newErrors.estimatedCost = `Estimated cost exceeds remaining budget of ${remainingBudget}€`
    }
    return newErrors
  }

  const groupByDate = (activities) => {
    return activities.reduce((groups, activity) => {
      const date = activity.date.split('T')[0]
      if (!groups[date]) groups[date] = []
      groups[date].push(activity)
      return groups
    }, {})
  }

  const groupedActivities = groupByDate(activities)
  const sortedDates = Object.keys(groupedActivities).sort()

  const handleChange = (e) => {
    const value = e.target.name === 'status' ? parseInt(e.target.value) : e.target.value
    setForm({ ...form, [e.target.name]: value })
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
        await activityService.update(editingId, form)
      } else {
        await activityService.create(form)
      }
      await fetchActivities()
      onRefresh()
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
      onRefresh()
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

  if (loading) return <p className="text-center text-teal-700">Loading...</p>

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          + Add Activity
        </button>
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="border border-teal-400 text-teal-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-50 transition">
          {showCalendar ? '📋 List View' : '📅 Calendar View'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white/80 rounded-xl p-4 mb-4 space-y-3 border border-sky-200">
          <div>
            <label className="block text-sm font-medium text-teal-800 mb-1">Name</label>
            <input name="name" value={form.name} onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border bg-white text-gray-800 focus:ring-2 focus:ring-teal-400 outline-none ${errors.name ? 'border-red-400' : 'border-sky-200'}`} />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-teal-800 mb-1">Date</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} min={startDate?.split('T')[0]} max={endDate?.split('T')[0]}
                className={`w-full px-3 py-2 rounded-lg border bg-white text-gray-800 focus:ring-2 focus:ring-teal-400 outline-none ${errors.date ? 'border-red-400' : 'border-sky-200'}`} />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-teal-800 mb-1">Time</label>
              <input type="time" name="time" value={form.time} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-sky-200 bg-white text-gray-800 focus:ring-2 focus:ring-teal-400 outline-none" />
              {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-teal-800 mb-1">Location</label>
            <input name="location" value={form.location} onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-sky-200 bg-white text-gray-800 focus:ring-2 focus:ring-teal-400 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-teal-800 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={2}
              className="w-full px-3 py-2 rounded-lg border border-sky-200 bg-white text-gray-800 focus:ring-2 focus:ring-teal-400 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-teal-800 mb-1">Estimated Cost (€)</label>
              <input type="number" name="estimatedCost" value={form.estimatedCost} onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg border bg-white text-gray-800 focus:ring-2 focus:ring-teal-400 outline-none ${errors.estimatedCost ? 'border-red-400' : 'border-sky-200'}`} />
              {errors.estimatedCost && <p className="text-red-500 text-sm mt-1">{errors.estimatedCost}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-teal-800 mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-sky-200 bg-white text-gray-800 focus:ring-2 focus:ring-teal-400 outline-none">
                {STATUS_OPTIONS.map((s, i) => (
                  <option key={s} value={i}>{s}</option>
                ))}
              </select>
            </div>
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

      {showCalendar ? (
        <CalendarView activities={activities} />
      ) : (
        activities.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No activities yet.</p>
        ) : (
          <div className="flex flex-col gap-1">
            {sortedDates.map(date => (
              <div key={date}>
                <h3 className="text-teal-800 font-semibold text-sm mb-2 mt-4 border-b border-sky-200 pb-1">
                  📅 {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </h3>
                <div className="flex flex-col gap-2">
                  {groupedActivities[date].map(activity => {
                    const isPast = new Date(activity.date) < new Date()
                    return (
                      <div key={activity.id} className={`bg-white/80 rounded-xl p-4 border ${isPast ? 'border-gray-200 opacity-60' : 'border-sky-200'}`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-teal-900">🎯 {activity.name}</h4>
                              {isPast && <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Past</span>}
                            </div>
                            {activity.time && (
                              <p className="text-sm text-gray-500">⏰ at {activity.time.substring(0, 5)}</p>
                            )}
                            {activity.location && <p className="text-sm text-gray-400">📍 {activity.location}</p>}
                            {activity.description && <p className="text-sm text-gray-500 mt-1">{activity.description}</p>}
                            <p className="text-sm text-teal-600 font-medium mt-1">Est. cost: {activity.estimatedCost}€</p>
                          </div>
                          <div className="flex flex-col gap-2 items-end">
                            <select
                              value={getStatusLabel(activity.status)}
                              onChange={(e) => handleStatusChange(activity.id, e.target.value)}
                              className="text-sm border border-sky-200 rounded-lg px-2 py-1 bg-white text-teal-700 outline-none">
                              {STATUS_OPTIONS.map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                            <div className="flex gap-2">
                              <button onClick={() => handleEdit(activity)}
                                className="border border-teal-400 text-teal-600 px-3 py-1 rounded-lg text-sm hover:bg-teal-50 transition">
                                ✏️
                              </button>
                              <button onClick={() => handleDelete(activity.id)}
                                className="border border-orange-400 text-orange-500 px-3 py-1 rounded-lg text-sm hover:bg-orange-50 transition">
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}

export default ActivitiesTab