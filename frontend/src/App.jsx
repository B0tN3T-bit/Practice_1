import { useEffect, useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL

function App() {
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const loadItems = async () => {
    try {
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error('Failed to load items')
      setItems(await res.json())
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadItems()
  }, [])

  const addItem = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      })
      if (!res.ok) throw new Error('Failed to add item')
      setName('')
      setDescription('')
      loadItems()
    } catch (err) {
      setError(err.message)
    }
  }

  const toggleDone = async (item) => {
    try {
      const res = await fetch(`${API_URL}/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !item.done }),
      })
      if (!res.ok) throw new Error('Failed to update item')
      loadItems()
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteItem = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete item')
      loadItems()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container">
      <h1>ITEMS</h1>

      <form onSubmit={addItem} className="item-form">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {error && <p className="error">{error}</p>}

      <ul className="item-list">
        {items.map((item) => (
          <li key={item.id} className={item.done ? 'done' : ''}>
            <span onClick={() => toggleDone(item)}>
              <strong>{item.name}</strong>
              {item.description ? ` — ${item.description}` : ''}
            </span>
            <button onClick={() => deleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {items.length === 0 && !error && <p>No items yet. Add one above.</p>}
    </div>
  )
}

export default App
