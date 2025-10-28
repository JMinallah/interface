import React from 'react'

function RiskBadge({ level }) {
  const map = {
    High: 'bg-rose-500 text-white',
    Medium: 'bg-amber-500 text-white',
    Low: 'bg-green-500 text-white',
  }
  return <span className={`px-2 py-1 rounded-md text-sm font-semibold ${map[level] || 'bg-gray-300'}`}>{level}</span>
}

export default function PredictionCard({ prediction = {} }) {
  const { riskLevel, confidence = 0, probabilities = [] } = prediction

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500">Prediction</div>
          <div className="mt-1 flex items-center gap-3">
            <RiskBadge level={riskLevel} />
            <div className="text-sm text-gray-700">{Math.round(confidence * 100)}% confidence</div>
          </div>
          <div className="text-xs text-gray-400">Model v1.0</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-sm font-medium mb-2">Top risk types</div>
        <div className="space-y-3">
          {probabilities.map((p) => (
            <div key={p.type} className="text-sm">
              <div className="flex justify-between mb-1">
                <div className="text-gray-700">{p.type}</div>
                <div className="text-gray-600">{Math.round((p.score || 0) * 100)}%</div>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="h-2 bg-[color:var(--color-primary)]" style={{ width: `${(p.score || 0) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="text-sm font-medium mb-2">Recommended actions</div>
        <ul className="list-disc list-inside text-sm text-gray-700">
          <li>Clinical review within 72 hours</li>
          <li>Consider referral to specialist</li>
        </ul>
      </div>
    </div>
  )
}
