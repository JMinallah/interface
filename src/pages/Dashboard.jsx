import React, { useState } from 'react'
import PatientList from '../components/PatientList'
import PredictionCard from '../components/PredictionCard'
import NarrativeViewer from '../components/NarrativeViewer'
import Timeline from '../components/Timeline'
import ActionsBar from '../components/ActionsBar'
import NotesPanel from '../components/NotesPanel'
import TraumaAssessment from '../components/TraumaAssessment'

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
  const [activeView, setActiveView] = useState('patients') // 'patients' or 'assessment'

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

  // Handle saving assessment results as new patient
  function handleSaveAssessmentAsPatient(patientData) {
    setPatients((s) => [patientData, ...s])
    setSelectedId(patientData.id)
    setActiveView('patients') // Switch back to patient view to show the new patient
  }

  return (
    <div className="max-w-5xl mx-auto px-3 py-4">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="hidden sm:flex items-center gap-2 p-1 bg-gray-100 rounded-full">
            <button 
              onClick={() => setActiveView('patients')}
              className={`px-3 py-1 text-sm rounded-full transition-all ${activeView === 'patients' ? 'bg-[color:var(--color-primary)] text-white' : 'text-gray-600 hover:text-gray-800'}`}
            >
              Patient Records
            </button>
            <button 
              onClick={() => setActiveView('assessment')}
              className={`px-3 py-1 text-sm rounded-full transition-all ${activeView === 'assessment' ? 'bg-[color:var(--color-primary)] text-white' : 'text-gray-600 hover:text-gray-800'}`}
            >
              AI Assessment
            </button>
          </div>
          {/* Mobile View Toggle */}
          <div className="sm:hidden flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-full">
              <button 
                onClick={() => setActiveView('patients')}
                className={`px-2 py-1 text-xs rounded-full transition-all ${activeView === 'patients' ? 'bg-[color:var(--color-primary)] text-white' : 'text-gray-600'}`}
              >
                Records
              </button>
              <button 
                onClick={() => setActiveView('assessment')}
                className={`px-2 py-1 text-xs rounded-full transition-all ${activeView === 'assessment' ? 'bg-[color:var(--color-primary)] text-white' : 'text-gray-600'}`}
              >
                AI
              </button>
            </div>
            {activeView === 'patients' && (
              <button onClick={() => setShowList(true)} className="px-3 py-1 rounded-full bg-[color:var(--color-primary)] text-white text-xs">Patients</button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left column: Patient list (desktop) */}
        <aside className="hidden md:block">
          <PatientList patients={patients} selectedId={selectedId} onSelect={setSelectedId} onAddPatient={handleAddPatient} />
        </aside>

        {/* Right column: workspace */}
        <section className="md:col-span-2 space-y-4">
          {activeView === 'patients' ? (
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
          ) : (
            /* AI Assessment View */
            <div className="space-y-4">
              <TraumaAssessment onSavePatient={handleSaveAssessmentAsPatient} />
            </div>
          )}
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
