import React, { useEffect, useState } from 'react'

export default function NotesPanel({ patientId }) {
  const storageKey = patientId ? `patient-notes-${patientId}` : null
  const [text, setText] = useState('')
  const [savedAt, setSavedAt] = useState(null)

  useEffect(() => {
    if (!storageKey) {
      setText('')
      setSavedAt(null)
      return
    }
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) setText(raw)
      else setText('')
      setSavedAt(raw ? new Date().toISOString() : null)
    } catch {
      setText('')
    }
  }, [storageKey])

  function save() {
    if (!storageKey) return
    try {
      localStorage.setItem(storageKey, text)
      setSavedAt(new Date().toISOString())
    } catch {
      // ignore
    }
  }

  if (!patientId) return null

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">Clinician notes</div>
        <div className="text-xs text-gray-400">{savedAt ? `Saved ${new Date(savedAt).toLocaleString()}` : 'Not saved'}</div>
      </div>

      <textarea
        className="w-full p-3 border rounded-md h-28 resize-y"
        placeholder="Write observations, action plan, follow-ups..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="mt-3 flex gap-2">
        <button onClick={save} className="px-3 py-1 bg-[color:var(--color-primary)] text-white rounded-md">Save</button>
        <button onClick={() => { setText(''); localStorage.removeItem(storageKey); setSavedAt(null) }} className="px-3 py-1 border rounded-md">Clear</button>
      </div>
    </div>
  )
}
