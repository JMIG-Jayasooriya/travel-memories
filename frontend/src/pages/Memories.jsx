import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Heart, Sparkles, RefreshCw, Camera } from 'lucide-react'
import { useTravel } from '../context/TravelContext'
import MemoryCard from '../components/MemoryCard'
import MemoryModal from '../components/MemoryModal'
import { moods } from '../data/mockData'

export default function Memories() {
  const { memories, trips } = useTravel()
  const [searchQuery, setSearchQuery] = useState('')
  const [tripFilter, setTripFilter] = useState('All')
  const [moodFilter, setMoodFilter] = useState('All')
  const [favOnly, setFavOnly] = useState(false)
  const [activeMemory, setActiveMemory] = useState(null)

  const filtered = useMemo(() => {
    return memories.filter((m) => {
      const matchSearch =
        !searchQuery.trim() ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.location && m.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.caption && m.caption.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchTrip = tripFilter === 'All' || m.tripId === tripFilter
      const matchMood = moodFilter === 'All' || m.mood === moodFilter
      const matchFav = !favOnly || m.favourite

      return matchSearch && matchTrip && matchMood && matchFav
    })
  }, [memories, searchQuery, tripFilter, moodFilter, favOnly])

  const hasActiveFilters = searchQuery !== '' || tripFilter !== 'All' || moodFilter !== 'All' || favOnly

  const resetFilters = () => {
    setSearchQuery('')
    setTripFilter('All')
    setMoodFilter('All')
    setFavOnly(false)
  }

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-10 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ink/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest/10 text-forest text-xs font-semibold mb-2">
            <Camera size={13} /> Photo Scrapbook
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink">Memories</h1>
          <p className="text-ink/60 text-sm mt-1">
            {memories.length} captured moments and unforgettable polaroids.
          </p>
        </div>

        <Link
          to="/add-memory"
          className="inline-flex items-center justify-center gap-2 bg-clay text-cream px-5 py-2.5 rounded-full text-sm font-semibold shadow-stamp hover:brightness-110 active:scale-95 transition self-start sm:self-auto"
        >
          <Plus size={16} strokeWidth={2.5} /> Log Memory
        </Link>
      </div>

      {/* Search & Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" size={16} />
          <input
            type="text"
            placeholder="Search memories, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-paper border border-ink/15 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-forest text-ink placeholder:text-ink/40"
          />
        </div>

        {/* Trip Dropdown Selector */}
        {trips.length > 0 && (
          <select
            value={tripFilter}
            onChange={(e) => setTripFilter(e.target.value)}
            className="text-xs font-medium bg-paper border border-ink/15 rounded-full px-4 py-2 text-ink/80 focus:outline-none focus:ring-2 focus:ring-forest"
          >
            <option value="All">All Trips ({trips.length})</option>
            {trips.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Mood Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <button
          onClick={() => setMoodFilter('All')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
            moodFilter === 'All' && !favOnly
              ? 'bg-forest text-cream'
              : 'bg-paper border border-ink/15 text-ink/70 hover:bg-forest/5'
          }`}
        >
          All Moments
        </button>

        <button
          onClick={() => setFavOnly((prev) => !prev)}
          className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold border transition ${
            favOnly
              ? 'bg-clay text-cream border-clay'
              : 'bg-paper border-ink/15 text-ink/70 hover:border-clay/50'
          }`}
        >
          <Heart size={12} className={favOnly ? 'fill-cream' : 'text-clay'} />
          Favourites Only
        </button>

        {moods.map((m) => (
          <button
            key={m.key}
            onClick={() => {
              setMoodFilter(m.key)
              setFavOnly(false)
            }}
            className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-medium border transition ${
              moodFilter === m.key && !favOnly
                ? 'bg-forest text-cream border-forest font-semibold'
                : 'bg-paper border-ink/15 text-ink/70 hover:bg-forest/5'
            }`}
          >
            <span>{m.emoji}</span> {m.key}
          </button>
        ))}

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1 text-xs text-clay font-medium hover:underline ml-1"
          >
            <RefreshCw size={11} /> Reset
          </button>
        )}
      </div>

      {/* Scrapbook Grid */}
      {filtered.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 mt-8">
          {filtered.map((m) => (
            <MemoryCard
              key={m.id}
              memory={m}
              onSelect={(selected) => setActiveMemory(selected)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-paper border border-ink/10 rounded-3xl p-12 text-center mt-8">
          <div className="w-14 h-14 rounded-full bg-forest/10 text-forest flex items-center justify-center mx-auto mb-3">
            <Search size={24} />
          </div>
          <h3 className="font-display text-xl font-semibold text-ink">No memories found</h3>
          <p className="text-ink/60 text-sm mt-1 max-w-sm mx-auto">
            {hasActiveFilters
              ? 'Try adjusting or clearing your filters to see more memories.'
              : 'Your memory gallery is currently empty.'}
          </p>
          {hasActiveFilters ? (
            <button
              onClick={resetFilters}
              className="mt-5 text-sm font-semibold bg-forest text-cream px-5 py-2 rounded-full hover:brightness-110"
            >
              Clear all filters
            </button>
          ) : (
            <Link
              to="/add-memory"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold bg-clay text-cream px-5 py-2.5 rounded-full shadow-sm hover:brightness-110"
            >
              <Plus size={16} /> Add a Memory
            </Link>
          )}
        </div>
      )}

      {/* Memory Detail Modal */}
      <MemoryModal
        memory={activeMemory}
        onClose={() => setActiveMemory(null)}
      />
    </div>
  )
}
