import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function Register() {
  const navigate = useNavigate()

  return (
    <main className="max-w-md mx-auto px-4 py-6 sm:py-8">
      <div className="sm:hidden mb-4">
        <button onClick={() => navigate(-1)} aria-label="Go back" className="inline-flex items-center gap-2 text-sm text-gray-700">
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full">
        <div className="px-5 py-4 border-b" style={{borderColor: 'rgba(0,0,0,0.04)'}}>
          <p className="text-4xl text-center font-bold" style={{color: 'var(--color-accent)'}}>Karlen</p>
          <h2 className="text-2xl text-center font-bold" style={{color: 'var(--color-primary)'}}>Create an account</h2>
        </div>

        <div className="p-5 sm:p-6">
          <form className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700">Full name</label>
              <input aria-label="Full name" className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]" type="text" />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Email</label>
              <input aria-label="Email" className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]" type="email" />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Password</label>
              <input aria-label="Password" className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]" type="password" />
            </div>

            <div>
              <button className="w-full inline-flex justify-center px-4 py-2 bg-[color:var(--color-primary)] text-white rounded-md">Create account</button>
            </div>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            Have an account already? <Link to="/signin" className="text-[color:var(--color-accent)] font-medium">Sign in</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
