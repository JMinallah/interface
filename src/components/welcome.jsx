import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Welcome() {
	const { user } = useAuth()
	
	return (
    		<div className="flex flex-col">

				<main className="flex-1 flex items-center">
				<section className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
					<div className="space-y-4">
						<h1 className="text-3xl sm:text-4xl md:text-4xl font-extrabold leading-tight" style={{color: 'var(--color-primary)'}}>
							Welcome to Karlen
						</h1>

						<p className="text-gray-700 text-base sm:text-lg max-w-xl">
							A secure, clinician-focused toolkit to help assess and document mental health risks in children. Designed to be fast, private, and evidence-informed so you can focus on care.
						</p>

						<div className="flex flex-col sm:flex-row gap-3">
							{user ? (
								<Link to="/dashboard" className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-[color:var(--color-primary)] text-white font-semibold shadow-sm hover:brightness-95">Go to Dashboard</Link>
							) : (
								<Link to="/signin" className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-[color:var(--color-primary)] text-white font-semibold shadow-sm hover:brightness-95">Get started</Link>
							)}
							<Link to="/about" className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-gray-200 text-gray-700">Learn more</Link>
						</div>

					</div>

					<div className="flex items-center justify-center">
						<img 
							src="/Pediatrician-rafiki.svg" 
							alt="Pediatrician illustration" 
							className="w-full max-w-sm h-auto rounded-lg"
						/>
					</div>
				</section>
			</main>
		</div>
	)
}
