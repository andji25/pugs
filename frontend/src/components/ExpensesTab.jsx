import { useState, useEffect } from "react"
import { expenseService } from "../services/expenseService"

const CATEGORY_OPTIONS = ['Transport', 'Accommodation', 'Food', 'Tickets', 'Shopping', 'Other']
const CATEGORY_MAP = {'Transport': 0, 'Accommodation': 1, 'Food': 2, 'Tickets': 3, 'Shopping': 4, 'Other': 5}

function ExpensesTab({ tripId, budget }) {
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
        if(!form.name.trim()) newErrors.name = 'Name is required'
        if(!form.date) newErrors.date = 'Date is required'
        if(!form.amount || form.amount <= 0) newErrors.amount = 'Amount must be greater than zero'
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
                await expenseService.update(editingId, form)
            } else {
                await expenseService.create(form)
            }
            await fetchExpenses()
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

    if (loading) return <p>Loading...</p>

    return (
        <div>
            <p>Total spent: {totalExpenses}€ | Remaining Budget: {remainingBudget}€</p>
            <button onClick={() => setShowForm(!showForm)}>+ Add Expense</button>

            {showForm && (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Name</label>
                        <input name="name" value={form.name} onChange={handleChange}/>
                        {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
                    </div>
                    <div>
                        <label>Category</label>
                        <select name="category" value={form.category} onChange={handleChange}>
                            {CATEGORY_OPTIONS.map((c, i) => (
                                <option key={c} value={i}>{c}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Amount (€)</label>
                        <input type="number" name="amount" value={form.amount} onChange={handleChange}/>
                        {errors.amount && <p style={{ color: 'red' }}>{errors.amount}</p>}
                    </div>
                    <div>
                        <label>Date</label>
                        <input type="date" name="date" value={form.date} onChange={handleChange}/>
                        {errors.date && <p style={{ color: 'red' }}>{errors.date}</p>}
                    </div>
                    <div>
                        <label>Description</label>
                        <textarea name="description" value={form.description} onChange={handleChange}/>
                    </div>
                    <button type="submit">{editingId ? 'Update' : 'Add'}</button>
                    <button type="button" onClick={resetForm}>Cancel</button>
                </form>
            )}

            {expenses.length === 0 ? (
                <p>No expenses yet.</p>
            ) : (
                expenses.map(expense => (
                    <div key={expense.id}>
                        <h4>{expense.name}</h4>
                        <p>{getCategoryLabel(expense.category)}</p>
                        <p>{expense.amount}€</p>
                        <p>{new Date(expense.date).toLocaleDateString()}</p>
                        <p>{expense.description}</p>
                        <button onClick={() => handleEdit(expense)}>Edit</button>
                        <button onClick={() => handleDelete(expense.id)}>Delete</button>
                    </div>
                ))
            )}
        </div>
    )
}

export default ExpensesTab