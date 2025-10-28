import React, { useState, useEffect, useRef } from 'react'
import { Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)
  const firstLinkRef = useRef(null)
  const lastLinkRef = useRef(null)

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 640) setOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // manage focus, escape key, focus trap, and body scroll lock
  useEffect(() => {
    if (!open) {
      document.body.style.overflow = ''
      return
    }

    // lock scrolling while menu open
    document.body.style.overflow = 'hidden'

    // focus the first link when opened
    const t = setTimeout(() => {
      firstLinkRef.current?.focus()
    }, 50)

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }

      if (e.key === 'Tab' && panelRef.current) {
        // simple focus trap: keep focus inside panel
        const focusable = panelRef.current.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])')
        if (!focusable || focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      clearTimeout(t)
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="w-full sticky top-0 z-50 backdrop-blur-sm" style={{backgroundColor: 'rgba(var(--color-accent-rgb),0.86)'}}>
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-md flex-shrink-0" style={{backgroundColor: 'var(--color-primary)'}} />
          <span className="font-semibold text-base text-[color:var(--color-background)]">Karlen</span>
        </div>

        <nav className="hidden sm:flex items-center gap-2 text-sm">
          <Link to="/" className="px-2 py-0.5 rounded-lg bg-[color:var(--color-background)] text-[color:var(--color-accent)] font-medium hover:scale-105 transition-transform">Home</Link>
          <Link to="/about" className="px-2 py-0.5 rounded-lg bg-[color:var(--color-background)] text-[color:var(--color-accent)] font-medium hover:scale-105 transition-transform">About</Link>
          <Link to="/signin" className="px-2 py-0.5 rounded-lg bg-[color:var(--color-background)] text-[color:var(--color-accent)] font-medium hover:scale-105 transition-transform">SignIn</Link>
          <Link to="/register" className="px-2 py-0.5 rounded-lg bg-[color:var(--color-background)] text-[color:var(--color-accent)] font-medium hover:scale-105 transition-transform">Register</Link>
        </nav>

        <div className="sm:hidden">
          <button aria-controls="mobile-menu" aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(v => !v)} className="p-1 rounded-md text-[color:var(--color-background)]">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" ref={panelRef} className="sm:hidden absolute left-0 right-0 top-full z-50 border-t border-[rgba(0,0,0,0.06)] mobile-menu-enter" style={{backgroundColor: 'rgba(var(--color-accent-rgb),0.92)'}}>
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2">
            <Link ref={firstLinkRef} to="/" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md bg-[color:var(--color-background)] text-[color:var(--color-accent)] font-medium">Home</Link>
            <Link to="/about" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md bg-[color:var(--color-background)] text-[color:var(--color-accent)] font-medium">About</Link>
            <Link to="/signin" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md bg-[color:var(--color-background)] text-[color:var(--color-accent)] font-medium">Sign In</Link>
            <Link ref={lastLinkRef} to="/register" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md bg-[color:var(--color-background)] text-[color:var(--color-accent)] font-medium">Register</Link>
          </div>
        </div>
      )}
    </header>
  )
}
// duplicate Nav component removed — the file now uses the first Nav definition (with hooks) above
