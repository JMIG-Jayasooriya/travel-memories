import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Compass, Sparkles } from 'lucide-react'
import { useTravel } from '../context/TravelContext'
import TripCard from '../components/TripCard'
import { travelTypes } from '../data/mockData'

export default function Trips() {
  const { trips, memories } = useTravel()
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All' ? trips : trips.filter((t) => t.type === filter)

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-12 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ink/10">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink">My Trips</h1>
          <p className="text-ink/60 text-sm mt-1">
            {trips.length} curated journey{trips.length === 1 ? '' : 's'} recorded so far.
          </p>
        </div>
        <Link
          to="/create-trip"
          className="inline-flex items-center justify-center gap-2 bg-clay text-cream px-5 py-2.5 rounded-full text-sm font-semibold shadow-stamp hover:brightness-110 active:scale-95 transition self-start sm:self-auto"
        >
          <Plus size={16} strokeWidth={2.5} /> New Trip
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mt-6">
        {['All', ...travelTypes].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition ${
              filter === t
                ? 'bg-forest text-cream border-forest font-semibold shadow-sm'
                : 'bg-paper border-ink/15 text-ink/70 hover:bg-forest/5'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filtered.map((t) => (
            <TripCard
              key={t.id}
              trip={t}
              memoryCount={memories.filter((m) => m.tripId === t.id).length}
            />
          ))}
        </div>
      ) : (
        <div className="bg-paper border border-ink/10 rounded-3xl p-12 text-center mt-8">
          <Compass className="mx-auto text-forest/40 mb-3" size={36} />
          <h3 className="font-display text-xl font-semibold text-ink">No trips found</h3>
          <p className="text-ink/60 text-sm mt-1 max-w-sm mx-auto">
            {filter === 'All'
              ? 'Start logging your travel memories by creating your first trip.'
              : `No trips categorized under "${filter}" yet.`}
          </p>
          <Link
            to="/create-trip"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold bg-forest text-cream px-5 py-2 rounded-full hover:brightness-110"
          >
            <Plus size={16} /> Add a Trip
          </Link>
        </div>
      )}
    </div>
  )
}

