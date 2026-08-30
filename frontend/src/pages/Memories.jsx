import React, { useMemo, useState } from 'react'
import { useTravel } from '../context/TravelContext'
import MemoryCard from '../components/MemoryCard'
import { moods } from '../data/mockData'

export default function Memories() {
  const { memories, trips } = useTravel()
  const [tripFilter, setTripFilter] = useState('All')
  const [moodFilter, setMoodFilter] = useState('All')
  const [favOnly, setFavOnly] = useState(false)

  const filtered = useMemo(() => memories.filter((m) => (
    (tripFilter === 'All' || m.tripId === tripFilter)
    && (moodFilter === 'All' || m.mood === moodFilter)
    && (!favOnly || m.favourite)
  )), [memories, tripFilter, moodFilter, favOnly])

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-12">
      <h1 className="font-display text-3xl font-semibold">Memories</h1>
      <p className="text-ink/50 text-sm mt-1">{memories.length} moments, captured.</p>

      <div className="flex flex-wrap gap-3 mt-6">
        <select value={tripFilter} onChange={(e) => setTripFilter(e.target.value)} className="border border-ink/15 rounded-full px-3 py-1.5 text-sm bg-paper">
          <option value="All">All trips</option>
          {trips.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <select value={moodFilter} onChange={(e) => setMoodFilter(e.target.value)} className="border border-ink/15 rounded-full px-3 py-1.5 text-sm bg-paper">
          <option value="All">All moods</option>
          {moods.map((m) => <option key={m.key} value={m.key}>{m.emoji} {m.key}</option>)}
        </select>
        <button
          onClick={() => setFavOnly((f) => !f)}
          className={`px-3.5 py-1.5 rounded-full text-sm border transition ${favOnly ? 'bg-clay text-cream border-clay' : 'border-ink/15 text-ink/60'}`}
        >
          ❤️ Favourites only
        </button>
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 mt-8">
        {filtered.map((m) => <MemoryCard key={m.id} memory={m} />)}
      </div>
      {filtered.length === 0 && <p className="text-ink/50 text-sm mt-10">No memories match these filters.</p>}
    </div>
  )
}
