import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Activity, UserCheck, ShieldCheck, ChevronDown } from 'lucide-react'

export default function Welcome() {
	const { user } = useAuth()
	const [openIndex, setOpenIndex] = useState(null)

	const toggle = (i) => {
		setOpenIndex((prev) => (prev === i ? null : i))
	}

	const contentRefs = useRef([])

	useEffect(() => {
		const applyHeights = () => {
			contentRefs.current.forEach((el, idx) => {
				if (!el) return
				if (window.innerWidth >= 768) {
					// on md+ let the content size naturally
					el.style.maxHeight = null
				} else {
					if (openIndex === idx) {
						el.style.maxHeight = el.scrollHeight + 'px'
					} else {
						el.style.maxHeight = '0px'
					}
				}
			})
		}

		applyHeights()
		window.addEventListener('resize', applyHeights)
		return () => window.removeEventListener('resize', applyHeights)
	}, [openIndex])

	return (
		<div className="flex flex-col">

				<main className="flex-1 flex items-start">
					<section className="max-w-6xl mx-auto px-4 py-4 md:py-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
						<div className="space-y-4 relative z-10">
							<h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight" style={{color: 'var(--color-primary)'}}>
								Welcome to Karlen
							</h1>

								<p className="text-gray-700 text-base sm:text-lg max-w-xl">
									A secure, clinician-focused toolkit to help assess and document mental health risks in children. Designed to be fast, private, and evidence-informed so you can focus on care.
								</p>

								<div className="flex flex-row gap-3 flex-wrap items-center">
									{user ? (
										<Link to="/dashboard" className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-[color:var(--color-primary)] text-white font-semibold shadow-sm hover:brightness-95">Go to Dashboard</Link>
									) : (
										<Link to="/signin" className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-[color:var(--color-primary)] text-white font-semibold shadow-sm hover:brightness-95">Get started</Link>
									)}
								</div>

						</div>

						<div className="flex items-center justify-center overflow-visible">
							<img 
								src="/Pediatrician-rafiki.svg" 
								alt="Pediatrician illustration" 
								className="w-full max-w-xs md:max-w-sm lg:max-w-md h-auto rounded-xl relative z-0 -mt-[100px] md:mt-0 shadow-lg"
							/>
						</div>
					</section>
				</main>
		
			{/* How it works - enhanced section */}
											<section className="bg-gradient-to-b from-white/60 to-[rgba(var(--color-accent-rgb),0.06)] py-12 relative bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url('/children.jpg')"}}>
												<div className="absolute inset-0 bg-[rgba(255,255,255,0.75)]" aria-hidden />
												<div className="relative max-w-6xl mx-auto px-6 z-10">
													<div className="text-center mb-8">
														<h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold" style={{color: 'var(--color-primary)'}}>How it works</h2>
														<p className="mt-3 text-gray-600 max-w-2xl mx-auto">Streamlined steps that fit into a clinician's workflow — narrative capture, optional AI analysis, and clinician-controlled summaries.</p>
													</div>

													<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
														{[
															{
																icon: Activity,
																title: 'Narrative capture',
																body: 'Capture child and caregiver narratives — free-text observations, quotes, and context. The UI is optimized for quick entry on phones and tablets.'
															},
															{
																icon: UserCheck,
																title: 'AI-assisted analysis',
																body: 'Captured narratives are optionally sent to the deployed AI model to extract themes, risk indicators, and suggested next-steps — giving clinicians an evidence-informed summary.'
															},
															{
																icon: ShieldCheck,
																title: 'Clinician summary & control',
																body: 'Review AI highlights, edit the summary, and choose what to save or export. Privacy controls let you redact or keep narratives local when required.'
															}
														].map((c, i) => {
															const Icon = c.icon
															const isOpen = openIndex === i
															return (
																<article key={c.title} className="bg-white/90 border border-gray-100 rounded-lg shadow-sm overflow-hidden">
																	<button
																		type="button"
																		aria-expanded={isOpen}
																		onClick={() => toggle(i)}
																		className="w-full flex items-center gap-4 p-4 md:p-5 text-left"
																	>
																		<div className="p-2 md:p-3 bg-[color:var(--color-primary)]/10 rounded-md inline-flex items-center justify-center">
																			<Icon className="w-6 h-6 text-[color:var(--color-primary)]" aria-hidden />
																		</div>

																		<div className="flex-1">
																			<h3 className="text-lg font-semibold">{c.title}</h3>
																		</div>

																		<ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'} md:hidden`} aria-hidden />
																		</button>

																		{/* collapsible description for small screens; visible on md+ */}
																		<div
																			ref={(el) => (contentRefs.current[i] = el)}
																			className="md:block px-4 pb-4 md:pb-5 text-sm text-gray-600 overflow-hidden"
																			style={{transition: 'max-height 300ms ease'}}
																		>
																			{c.body}
																		</div>
																	</article>
															)
															})}
													</div>

													<div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
														<p className="text-sm text-gray-600 max-w-2xl">Karlen centers clinician judgment: AI augments, it doesn't replace. Narratives are processed by a deployed model to help surface insights — final decisions always remain with the care team.</p>
														<div className="w-full sm:w-auto">
															<Link to={user ? "/dashboard" : "/signin"} className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-[color:var(--color-primary)] text-white font-semibold">Get started</Link>
														</div>
													</div>
												</div>
											</section>
		</div>
	)
}
