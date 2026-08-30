import React from 'react'
import { Link } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'
import TravelStats from '../components/TravelStats'
import MemoryCard from '../components/MemoryCard'

export default function Home() {
  const { stats, memories } = useTravel()
  const featured = memories.slice(0, 3)

  return (
    <div>
      <section className="relative h-[88vh] min-h-[560px] flex items-end overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1800&q=80"
          alt="Mountain valley at sunrise"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/10" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 pb-16 md:pb-24 w-full">
          <p className="font-hand text-3xl text-cream/90 mb-1">Every journey tells a story.</p>
          <h1 className="font-display text-5xl md:text-7xl font-semibold text-cream leading-[0.95] tracking-tight">
            TRAVEL<br />MEMORIES
          </h1>
          <p className="text-cream/80 max-w-md mt-5 text-sm md:text-base">
            Capture your adventures, preserve your memories, and relive every journey.
          </p>
          <div className="flex flex-wrap gap-3 mt-7">
            <Link to="/create-trip" className="bg-clay text-cream px-6 py-3 rounded-full text-sm font-semibold shadow-stamp hover:brightness-105 transition">
              Start Your Journey
            </Link>
            <Link to="/memories" className="bg-cream/10 backdrop-blur border border-cream/40 text-cream px-6 py-3 rounded-full text-sm font-semibold hover:bg-cream/20 transition">
              Explore My Memories
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 md:px-8 -mt-12 relative z-20">
        <TravelStats stats={stats} />
      </section>

      <section className="max-w-7xl mx-auto px-5 md:px-8 mt-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-3xl font-semibold text-ink">Recent Memories</h2>
          <Link to="/memories" className="text-sm font-medium text-forest hover:underline underline-offset-4">View all</Link>
        </div>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
          {featured.map((m) => <MemoryCard key={m.id} memory={m} />)}
        </div>
      </section>
    </div>
  )
}
