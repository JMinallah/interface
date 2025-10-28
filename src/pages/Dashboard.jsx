import React, { useState } from 'react'
import PatientList from '../components/PatientList'
import PredictionCard from '../components/PredictionCard'
import NarrativeViewer from '../components/NarrativeViewer'
import Timeline from '../components/Timeline'
import ActionsBar from '../components/ActionsBar'
import NotesPanel from '../components/NotesPanel'

// Mock dataset for initial layout
const MOCK_PATIENTS = [
  {
    id: 'P-001',
    name: 'Child A',
    age: 8,
    narratives: [
      { id: 'n1', text: 'The child reports feeling sad and not wanting to play.', date: '2025-10-20' },
      { id: 'n2', text: 'Parents report trouble sleeping and appetite changes.', date: '2025-09-28' },
    ],
    lastPrediction: {
      riskLevel: 'Medium',
      confidence: 0.72,
      probabilities: [
        { type: 'Depression', score: 0.72 },
        { type: 'Anxiety', score: 0.45 },
      ],
      explanation: [{ span: 'feeling sad', score: 0.6 }, { span: 'trouble sleeping', score: 0.3 }],
    },
  },
  {
    id: 'P-002',
    name: 'Child B',
    age: 5,
    narratives: [
      { id: 'n3', text: 'The child shows signs of withdrawal and decreased eye contact.', date: '2025-10-22' },
    ],
    lastPrediction: {
      riskLevel: 'High',
      confidence: 0.88,
      probabilities: [
        { type: 'Neglect', score: 0.88 },
        { type: 'Abuse', score: 0.34 },
      ],
      explanation: [{ span: 'withdrawal', score: 0.7 }],
    },
  },
]

export default function Dashboard() {
  const [patients, setPatients] = useState(MOCK_PATIENTS)
  const [selectedId, setSelectedId] = useState(MOCK_PATIENTS[0]?.id || null)
  const [showList, setShowList] = useState(false)
  const [notesOpen, setNotesOpen] = useState(false)

  const selected = patients.find((p) => p.id === selectedId) || patients[0] || null

  function handleAddPatient({ name, age }) {
    const id = `P-${String(Date.now()).slice(-5)}`
    const newPatient = {
      id,
      name: name || `New patient ${id}`,
      age: age || 0,
      narratives: [],
      lastPrediction: { riskLevel: 'Unknown', confidence: 0, probabilities: [], explanation: [] },
    }
    setPatients((s) => [newPatient, ...s])
    setSelectedId(id)
  }

  return (
    <div className="max-w-5xl mx-auto px-3 py-4">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <div className="sm:hidden">
          <button onClick={() => setShowList(true)} className="px-3 py-1 rounded-md bg-[color:var(--color-primary)] text-white">Patients</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left column: Patient list (desktop) */}
        <aside className="hidden md:block">
          <PatientList patients={patients} selectedId={selectedId} onSelect={setSelectedId} onAddPatient={handleAddPatient} />
        </aside>

        {/* Right column: workspace */}
        <section className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <div className="lg:col-span-2">
              <NarrativeViewer narrative={selected?.narratives?.[0]} explanation={selected?.lastPrediction?.explanation} />

              {/* Move timeline directly under narrative for tighter grouping */}
              <div className="mt-3">
                <Timeline items={selected?.narratives || []} />
              </div>

              {/* Notes panel for clinician annotations - inline on desktop */}
              <div className="mt-3 hidden md:block">
                <NotesPanel patientId={selected?.id} />
              </div>

              {/* Mobile: notes panel as modal/slide-over to avoid clutter */}
              {notesOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/40" onClick={() => setNotesOpen(false)} />
                  <div className="relative w-full max-w-lg mx-4">
                    <div className="bg-white rounded-lg shadow-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium">Clinician notes</h3>
                        <button onClick={() => setNotesOpen(false)} className="text-sm text-gray-600">Close</button>
                      </div>
                      <NotesPanel patientId={selected?.id} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div>
              <PredictionCard prediction={selected?.lastPrediction} patient={selected} />
            </div>
          </div>
        </section>
      </div>

      {/* Mobile drawer for patient list */}
      {showList && (
        <div className="fixed inset-0 z-50 bg-black/30 flex">
          <div className="w-80 bg-white h-full p-4 shadow-lg overflow-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Patients</h3>
              <button onClick={() => setShowList(false)} className="text-sm text-gray-600">Close</button>
            </div>
            <PatientList
              patients={patients}
              selectedId={selectedId}
              onSelect={(id) => {
                setSelectedId(id)
                setShowList(false)
              }}
              onAddPatient={(p) => { handleAddPatient(p); setShowList(false) }}
            />
          </div>
          <div className="flex-1" onClick={() => setShowList(false)} />
        </div>
      )}

      <ActionsBar />
    </div>
  )
}
