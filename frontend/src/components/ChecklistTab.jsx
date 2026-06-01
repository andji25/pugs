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
        if(!newItemName.trim()) {
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

    if (loading) return <p>Loading...</p>

    return (
        <div>
            <p>{completedCount}/{items.length} completed</p>

            <form onSubmit={handleAdd}>
                <input 
                    type="text" 
                    value={newItemName} 
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Add new item..."/>
                    <button type="submit">Add</button>
                    {error && <p style={{ color: 'red'}}>{error}</p>}
            </form>

            {items.length === 0 ? (
                <p>No items yet.</p>
            ) : (
                items.map(item =>(
                    <div key={item.id}>
                        <input 
                            type="checkbox"
                            checked={item.isCompleted}
                            onChange={() => handleToggle(item.id)}/>
                        <span style={{ textDecoration: item.isCompleted ? 'line-through' : 'none'}}>
                            {item.name}
                        </span>
                        <button onClick={() => handleDelete(item.id)}>Delete</button>
                    </div>
                ))
            )}
        </div>
    )
}

export default ChecklistTab