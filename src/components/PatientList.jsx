import React, { useState } from 'react'
import { User, Plus } from 'lucide-react'

export default function PatientList({ patients = [], selectedId, onSelect, onAddPatient }) {
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [age, setAge] = useState('')

  function handleAdd(e) {
    e.preventDefault()
    if (!name) return
    onAddPatient && onAddPatient({ name: name.trim(), age: Number(age) || 0 })
    setName('')
    setAge('')
    setShowForm(false)
  }

  const filtered = patients.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.id.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="bg-white rounded-lg shadow-sm p-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">Patients</h3>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowForm((s) => !s)} className="flex items-center gap-2 px-2 py-1 text-sm bg-[color:var(--color-primary)] text-white rounded-md">
            <Plus size={14} /> <span>Add</span>
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="mb-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full px-3 py-2 border rounded-md mb-2" />
          <input value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" type="number" className="w-full px-3 py-2 border rounded-md mb-2" />
          <div className="flex gap-2">
            <button type="submit" className="px-3 py-1 bg-[color:var(--color-primary)] text-white rounded-md text-sm">Create</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-3 py-1 border rounded-md text-sm">Cancel</button>
          </div>
        </form>
      )}

      <div className="mb-3">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search patients" className="w-full px-3 py-2 border rounded-md" />
      </div>

      <ul className="space-y-2">
        {filtered.map((p) => (
          <li key={p.id}>
            <button onClick={() => onSelect(p.id)} className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md ${selectedId === p.id ? 'bg-[color:var(--color-muted)]' : 'hover:bg-gray-50'}`}>
              <div className="w-9 h-9 rounded-full bg-[color:var(--color-primary)] flex items-center justify-center text-white">
                <User size={14} />
              </div>
              <div>
                <div className="text-sm font-medium">{p.name} <span className="text-xs text-gray-500">• {p.age} yrs</span></div>
                <div className="text-xs text-gray-500">{p.id}</div>
              </div>
            </button>
          </li>
        ))}
        {filtered.length === 0 && <li className="text-sm text-gray-500">No patients found</li>}
      </ul>
    </div>
  )
}
