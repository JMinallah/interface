import React from 'react'

export default function NarrativeViewer({ narrative = {}, explanation = [] }) {
  if (!narrative) return null

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="text-sm text-gray-500">Narrative</div>
      <div className="mt-2 text-gray-800">
        <p className="whitespace-pre-line">{narrative.text}</p>
      </div>

      {explanation && explanation.length > 0 && (
        <div className="mt-4">
          <div className="text-sm font-medium mb-2">Supporting evidence</div>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {explanation.map((e, i) => (
              <li key={i}>{e.span} <span className="text-xs text-gray-400">({Math.round((e.score||0)*100)}%)</span></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
