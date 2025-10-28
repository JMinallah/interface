import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function SignIn() {
  const navigate = useNavigate()

  return (
    <main className="max-w-md mx-auto px-4 py-6 sm:py-8">
      {/* Mobile-only back button for easier back-and-forth navigation */}
      <div className="sm:hidden mb-4">
        <button onClick={() => navigate(-1)} aria-label="Go back" className="inline-flex items-center gap-2 text-sm text-gray-700">
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full">
        <div className="px-5 py-4 border-b" style={{borderColor: 'rgba(0,0,0,0.04)'}}>
          <h2 className="text-2xl font-bold" style={{color: 'var(--color-primary)'}}>Sign into Karlen</h2>
          <p className="text-sm text-gray-600 mt-1">Access your clinician workspace</p>
        </div>

        <div className="p-5 sm:p-6">
          <form className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700">Email</label>
              <input aria-label="Email" className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]" type="email" />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Password</label>
              <input aria-label="Password" className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]" type="password" />
            </div>

            <div>
              <button className="w-full inline-flex justify-center px-4 py-2 bg-[color:var(--color-primary)] text-white rounded-md">Sign in</button>
            </div>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            New here? <Link to="/register" className="text-[color:var(--color-accent)] font-medium">Create an account</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
