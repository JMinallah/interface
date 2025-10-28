import React from 'react'

export default function Timeline({ items = [] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="text-sm font-medium mb-3">Timeline</div>
      <ol className="space-y-3">
        {items.map((it) => (
          <li key={it.id} className="text-sm">
            <div className="text-gray-700">{it.text}</div>
            <div className="text-xs text-gray-400">{it.date}</div>
          </li>
        ))}
      </ol>
    </div>
  )
}
