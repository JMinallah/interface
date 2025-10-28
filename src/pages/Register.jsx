import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Register() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await signUp({ name, email, password })
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-md mx-auto px-4 py-6 sm:py-8">
      <div className="sm:hidden mb-4">
        <button onClick={() => navigate(-1)} aria-label="Go back" className="inline-flex items-center gap-2 text-sm text-gray-700">
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full">
        <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
          <p className="text-4xl text-center font-bold" style={{ color: 'var(--color-accent)' }}>Karlen</p>
          <h2 className="text-2xl text-center font-bold" style={{ color: 'var(--color-primary)' }}>Create an account</h2>
        </div>

        <div className="p-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700">Full name</label>
              <input aria-label="Full name" value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]" type="text" />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Email</label>
              <input aria-label="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]" type="email" />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Password</label>
              <input aria-label="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]" type="password" />
            </div>

            {error && <div className="text-sm text-rose-600">{error}</div>}

            <div>
              <button disabled={loading} type="submit" className="w-full inline-flex justify-center px-4 py-2 bg-[color:var(--color-primary)] text-white rounded-md">{loading ? 'Creating...' : 'Create account'}</button>
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
