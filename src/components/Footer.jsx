import React from 'react'
import { Github, Twitter, Mail, Instagram, Facebook } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-700">© {new Date().getFullYear()} Karlen</div>

        <div className="flex items-center gap-3">
          <a aria-label="GitHub" href="https://github.com/your-org" className="text-gray-600 hover:text-gray-900">
            <Github size={16} />
          </a>
          <a aria-label="Twitter" href="https://twitter.com/your-handle" className="text-gray-600 hover:text-sky-500">
            <Twitter size={16} />
          </a>
          <a aria-label="Email" href="mailto:help@yourdomain.com" className="text-gray-600 hover:text-rose-500">
            <Mail size={16} />
          </a>
          <a aria-label="Instagram" href="https://instagram.com/your-handle" className="text-gray-600 hover:text-pink-500">
            <Instagram size={16} />
          </a>
          <a aria-label="Facebook" href="https://facebook.com/your-handle" className="text-gray-600 hover:text-blue-600">
            <Facebook size={16} />
          </a>
        </div>
      </div>
    </footer>
  )
}
