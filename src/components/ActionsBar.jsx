import React from 'react'
import { FileText } from 'lucide-react'

export default function ActionsBar({ onOpenNotes }) {
  return (
    <div className="fixed bottom-4 right-4 sm:relative sm:bottom-auto sm:right-auto">
      <div className="flex gap-3 items-center">
        <button className="px-3 py-2 bg-[color:var(--color-primary)] text-white rounded-md shadow">New assessment</button>
        <button className="px-3 py-2 bg-white border rounded-md shadow">Export</button>

        {/* Mobile-only notes quick action */}
        <button
          onClick={() => onOpenNotes && onOpenNotes()}
          className="ml-2 p-2 bg-white border rounded-full shadow md:hidden"
          aria-label="Open notes"
        >
          <FileText size={16} />
        </button>
      </div>
    </div>
  )
}
