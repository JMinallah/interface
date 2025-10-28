import React from 'react'

export default function Register() {
  return (
    <main className="max-w-md mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Create an account</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700">Full name</label>
          <input className="w-full mt-1 px-3 py-2 border rounded-md" type="text" />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Email</label>
          <input className="w-full mt-1 px-3 py-2 border rounded-md" type="email" />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Password</label>
          <input className="w-full mt-1 px-3 py-2 border rounded-md" type="password" />
        </div>
        <div>
          <button className="px-4 py-2 bg-[color:var(--color-primary)] text-white rounded-md">Create account</button>
        </div>
      </form>
    </main>
  )
}
