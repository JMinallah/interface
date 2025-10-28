import React, { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Nav() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 640) setOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <header className="w-full bg-[color:var(--color-accent)] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-md flex-shrink-0" style={{backgroundColor: 'var(--color-primary)'}} />
          <span className="font-semibold text-base text-[color:var(--color-background)]">EarlyMind</span>
        </div>

        <nav className="hidden sm:flex items-center gap-2 text-sm">
          <Link to="/" className="px-2 py-0.5 rounded-lg bg-[color:var(--color-background)] text-[color:var(--color-accent)] font-medium hover:scale-105 transition-transform">Home</Link>
          <Link to="/about" className="px-2 py-0.5 rounded-lg bg-[color:var(--color-background)] text-[color:var(--color-accent)] font-medium hover:scale-105 transition-transform">About</Link>
          <Link to="/signin" className="px-2 py-0.5 rounded-lg bg-[color:var(--color-background)] text-[color:var(--color-accent)] font-medium hover:scale-105 transition-transform">SignIn</Link>
          <Link to="/register" className="px-2 py-0.5 rounded-lg bg-[color:var(--color-background)] text-[color:var(--color-accent)] font-medium hover:scale-105 transition-transform">Register</Link>
        </nav>

        <div className="sm:hidden">
          <button aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(v => !v)} className="p-1 rounded-md text-[color:var(--color-background)]">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="sm:hidden absolute left-0 right-0 top-full bg-[color:var(--color-accent)] z-50 border-t border-[rgba(0,0,0,0.06)]">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2">
            <Link to="/" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md bg-[color:var(--color-background)] text-[color:var(--color-accent)] font-medium">Home</Link>
            <Link to="/about" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md bg-[color:var(--color-background)] text-[color:var(--color-accent)] font-medium">About</Link>
            <Link to="/signin" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md bg-[color:var(--color-background)] text-[color:var(--color-accent)] font-medium">Sign In</Link>
            <Link to="/register" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md bg-[color:var(--color-background)] text-[color:var(--color-accent)] font-medium">Register</Link>
          </div>
        </div>
      )}
    </header>
  )
}
// duplicate Nav component removed — the file now uses the first Nav definition (with hooks) above
