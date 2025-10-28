import React from 'react'
import { Link } from 'react-router-dom'

export default function Welcome() {
	return (
			<div className="min-h-screen flex flex-col">

				<main className="flex-1 flex items-center">
				<section className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
					<div className="space-y-4">
						<h1 className="text-3xl sm:text-4xl md:text-4xl font-extrabold leading-tight" style={{color: 'var(--color-primary)'}}>
							Welcome to EarlyMind
						</h1>

						<p className="text-gray-700 text-base sm:text-lg max-w-xl">
							A secure, clinician-focused toolkit to help assess and document mental health risks in children. Designed to be fast, private, and evidence-informed so you can focus on care.
						</p>

						<div className="flex flex-col sm:flex-row gap-3">
							<Link to="/signin" className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-[color:var(--color-primary)] text-white font-semibold shadow-sm hover:brightness-95">Get started</Link>
							<Link to="/about" className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-gray-200 text-gray-700">Learn more</Link>
						</div>

					</div>

					<div className="flex items-center justify-center">
						<div className="w-full max-w-sm p-4 rounded-lg shadow-lg" style={{backgroundColor: 'var(--color-muted)'}}>
							<div className="text-sm text-gray-800 font-medium mb-2">Quick snapshot</div>
							<ul className="space-y-2 text-gray-700">
								<li>• Structured risk checklist</li>
								<li>• Secure notes & export</li>
								<li>• Visual timeline for development</li>
							</ul>
						</div>
					</div>
				</section>
			</main>
		</div>
	)
}
