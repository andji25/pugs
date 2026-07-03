import { useState, useEffect } from "react"
import { expenseService } from "../services/expenseService"

const CATEGORY_OPTIONS = ['Transport', 'Accommodation', 'Food', 'Tickets', 'Shopping', 'Other']
const CATEGORY_MAP = { 'Transport': 0, 'Accommodation': 1, 'Food': 2, 'Tickets': 3, 'Shopping': 4, 'Other': 5 }

function ExpensesTab({ tripId, budget, startDate, endDate, remainingBudget: externalRemainingBudget, onRefresh }) {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({
    name: '',
    category: 0,
    amount: '',
    date: '',
    description: '',
    tripId: tripId
  })

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    try {
      const data = await expenseService.getByTrip(tripId)
      setExpenses(data)
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
    const minDate = new Date(new Date(startDate).setDate(new Date(startDate).getDate() - 30)).toISOString().split('T')[0]
    if (!form.date) {
      newErrors.date = 'Date is required'
    } else if (form.date < minDate || form.date > endDate?.split('T')[0]) {
      newErrors.date = 'Date must be within 30 days before trip or during the trip'
    }
    if (!form.amount || form.amount === '') {
      newErrors.amount = 'Amount is required'
    } else if (form.amount <= 0) {
      newErrors.amount = 'Amount must be greater than zero'
    } else if (parseFloat(form.amount) > externalRemainingBudget) {
      newErrors.amount = `Amount exceeds remaining budget of ${externalRemainingBudget}€`
    }
    return newErrors
  }

  const handleChange = (e) => {
    const value = e.target.name === 'category' ? parseInt(e.target.value) : e.target.value
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
        await expenseService.update(editingId, form)
      } else {
        await expenseService.create(form)
      }
      await fetchExpenses()
      onRefresh()
      resetForm()
    } catch (err) {
      console.error(err)
    }
  }

  const handleEdit = (expense) => {
    setForm({
      name: expense.name,
      category: expense.category,
      amount: expense.amount,
      date: expense.date.split('T')[0],
      description: expense.description || '',
      tripId: tripId
    })
    setEditingId(expense.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return
    try {
      await expenseService.delete(id)
      await fetchExpenses()
      onRefresh()
    } catch (err) {
      console.error(err)
    }
  }

  const resetForm = () => {
    setForm({
      name: '',
      category: 0,
      amount: '',
      date: '',
      description: '',
      tripId: tripId
    })
    setEditingId(null)
    setShowForm(false)
    setErrors({})
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const remainingBudget = budget - totalExpenses

  const getCategoryLabel = (category) => CATEGORY_OPTIONS[category] || 'Other'

  if (loading) return <p className="text-center text-teal-700">Loading...</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4 text-sm">
          <span className="text-orange-500 font-medium">Total Spent: {totalExpenses}€</span>
          <span className="text-teal-600 font-medium">Remaining: {externalRemainingBudget}€</span>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          + Add Expense
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
              <label className="block text-sm font-medium text-teal-800 mb-1">Category</label>
              <select name="category" value={form.category} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-sky-200 bg-white text-gray-800 focus:ring-2 focus:ring-teal-400 outline-none">
                {CATEGORY_OPTIONS.map((c, i) => (
                  <option key={c} value={i}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-teal-800 mb-1">Amount (€)</label>
              <input type="number" name="amount" value={form.amount} onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg border bg-white text-gray-800 focus:ring-2 focus:ring-teal-400 outline-none ${errors.amount ? 'border-red-400' : 'border-sky-200'}`} />
              {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-teal-800 mb-1">Date</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} min={new Date(new Date(startDate).setDate(new Date(startDate).getDate() - 30)).toISOString().split('T')[0]} max={endDate?.split('T')[0]}
              className={`w-full px-3 py-2 rounded-lg border bg-white text-gray-800 focus:ring-2 focus:ring-teal-400 outline-none ${errors.date ? 'border-red-400' : 'border-sky-200'}`} />
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-teal-800 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={2}
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
      {expenses.length === 0 ? (
        <p className="text-center text-gray-400 py-8">No expenses yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {CATEGORY_OPTIONS.map((category, categoryIndex) => {
            const categoryExpenses = expenses.filter(e => e.category === categoryIndex)
            if (categoryExpenses.length === 0) return null
            const categoryTotal = categoryExpenses.reduce((sum, e) => sum + e.amount, 0)
            const categoryEmojis = ['🚗', '🏨', '🍔', '🎟️', '🛍️', '📦']
            return (
              <div key={category} className="bg-white/80 rounded-xl border border-sky-200 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-sky-50 border-b border-sky-200">
                  <span className="font-semibold text-teal-800">
                    {categoryEmojis[categoryIndex]} {category}
                  </span>
                  <span className="text-orange-500 font-semibold">{categoryTotal}€</span>
                </div>
                <div className="flex flex-col">
                  {categoryExpenses.map(expense => (
                    <div key={expense.id} className="flex items-start justify-between p-4 border-b border-sky-100 last:border-0">
                      <div>
                        <h4 className="font-medium text-teal-900">{expense.name}</h4>
                        <p className="text-sm text-gray-400">{new Date(expense.date).toLocaleDateString('en-GB')}</p>
                        {expense.description && <p className="text-sm text-gray-500 mt-1">{expense.description}</p>}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-orange-500 font-semibold">{expense.amount}€</span>
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(expense)}
                            className="border border-teal-400 text-teal-600 px-3 py-1 rounded-lg text-sm hover:bg-teal-50 transition">
                            ✏️
                          </button>
                          <button onClick={() => handleDelete(expense.id)}
                            className="border border-orange-400 text-orange-500 px-3 py-1 rounded-lg text-sm hover:bg-orange-50 transition">
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}

export default ExpensesTab