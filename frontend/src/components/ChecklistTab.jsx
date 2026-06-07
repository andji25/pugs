import { useState, useEffect } from "react"
import { checklistService } from '../services/checklistService'

function ChecklistTab({ tripId }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [newItemName, setNewItemName] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const data = await checklistService.getByTrip(tripId)
      setItems(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newItemName.trim()) {
      setError('Item name is required')
      return
    }
    try {
      await checklistService.create({ name: newItemName, tripId: tripId })
      setNewItemName('')
      setError(null)
      await fetchItems()
    } catch (err) {
      console.error(err)
    }
  }

  const handleToggle = async (id) => {
    try {
      await checklistService.toggle(id)
      await fetchItems()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await checklistService.delete(id)
      await fetchItems()
    } catch (err) {
      console.error(err)
    }
  }

  const completedCount = items.filter(i => i.isCompleted).length

  if (loading) return <p className="text-center text-teal-700">Loading...</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-teal-700 font-medium">
          ✅ {completedCount}/{items.length} completed
        </span>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Add new item..."
          className={`flex-1 px-3 py-2 rounded-lg border bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-400 outline-none ${error ? 'border-red-400' : 'border-sky-200'}`}
        />
        <button type="submit"
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          Add
        </button>
      </form>
      {error && <p className="text-red-500 text-sm -mt-2 mb-2">{error}</p>}

      {items.length === 0 ? (
        <p className="text-center text-gray-400 py-8">No items yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between bg-white/80 rounded-xl px-4 py-3 border border-sky-200">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={item.isCompleted}
                  onChange={() => handleToggle(item.id)}
                  className="w-4 h-4 accent-teal-600 cursor-pointer"
                />
                <span className={`text-gray-700 ${item.isCompleted ? 'line-through text-gray-400' : ''}`}>
                  {item.name}
                </span>
              </div>
              <button onClick={() => handleDelete(item.id)}
                className="border border-orange-400 text-orange-500 px-3 py-1 rounded-lg text-sm hover:bg-orange-50 transition">
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ChecklistTab