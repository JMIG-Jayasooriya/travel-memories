import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useTravel } from '../context/TravelContext'
import TripCard from '../components/TripCard'
import { travelTypes } from '../data/mockData'

export default function Trips() {
  const { trips, memories } = useTravel()
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All' ? trips : trips.filter((t) => t.type === filter)

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">My Trips</h1>
          <p className="text-ink/50 text-sm mt-1">{trips.length} journeys recorded so far.</p>
        </div>
        <Link to="/create-trip" className="flex items-center gap-1.5 bg-clay text-cream px-5 py-2.5 rounded-full text-sm font-semibold shadow-stamp">
          <Plus size={16} /> New Trip
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mt-6">
        {['All', ...travelTypes].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3.5 py-1.5 rounded-full text-sm border transition ${
              filter === t ? 'bg-forest text-cream border-forest' : 'border-ink/15 text-ink/60 hover:border-forest/50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filtered.map((t) => (
          <TripCard key={t.id} trip={t} memoryCount={memories.filter((m) => m.tripId === t.id).length} />
        ))}
      </div>
      {filtered.length === 0 && <p className="text-ink/50 text-sm mt-10">No trips of this type yet.</p>}
    </div>
  )
}
