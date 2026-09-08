import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Search, MapPin, Heart, Sparkles, SlidersHorizontal, Compass, RefreshCw, Lock, ArrowRight } from 'lucide-react'
import { useTravel } from '../context/TravelContext'
import TravelStats from '../components/TravelStats'
import MemoryCard from '../components/MemoryCard'
import MemoryModal from '../components/MemoryModal'
import AuthPromptModal from '../components/AuthPromptModal'
import { moods } from '../data/mockData'

export default function Home() {
  const { user, stats, memories, trips } = useTravel()
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMood, setSelectedMood] = useState('All')
  const [selectedTrip, setSelectedTrip] = useState('All')
  const [onlyFavourites, setOnlyFavourites] = useState(false)
  const [activeMemory, setActiveMemory] = useState(null)

  const [authModalConfig, setAuthModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    redirectPath: '/',
  })

  const handleRequireAuth = (config = {}) => {
    setAuthModalConfig({
      isOpen: true,
      title: config.title || 'Sign In to Continue',
      message: config.message || 'You need to be signed in to add memories, favourite moments, and organize your trips.',
      redirectPath: config.redirectPath || '/',
    })
  }

  // Filter memories based on search and selected tags
  const filteredMemories = useMemo(() => {
    return memories.filter((m) => {
      const matchSearch =
        !searchQuery.trim() ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.location && m.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.caption && m.caption.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchMood = selectedMood === 'All' || m.mood === selectedMood
      const matchTrip = selectedTrip === 'All' || m.tripId === selectedTrip
      const matchFav = !onlyFavourites || m.favourite

      return matchSearch && matchMood && matchTrip && matchFav
    })
  }, [memories, searchQuery, selectedMood, selectedTrip, onlyFavourites])

  const hasActiveFilters = searchQuery !== '' || selectedMood !== 'All' || selectedTrip !== 'All' || onlyFavourites

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedMood('All')
    setSelectedTrip('All')
    setOnlyFavourites(false)
  }

  return (
    <div className={user ? "min-h-screen pb-20" : "min-h-[calc(100vh-4rem)] flex flex-col"}>
      {/* Hero Header */}
      <section
        className={`relative flex items-end overflow-hidden ${
          user
            ? 'h-[65vh] min-h-[480px] max-h-[640px]'
            : 'flex-1 min-h-[calc(100vh-4rem)] pb-16 sm:pb-20'
        }`}
      >
        <img
          src={
            user
              ? 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1800&q=80'
              : 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1800&q=80'
          }
          alt={user ? 'Wanderlust road trip' : 'Scenic mountain journey'}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/20" />

        <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-8 pb-14 w-full text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cream/20 backdrop-blur-md text-cream text-xs font-semibold tracking-wide uppercase mb-3">
            <Sparkles size={13} /> {user ? 'Personal Travel Dashboard' : 'Digital Travel Scrapbook'}
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-cream leading-[1.05] tracking-tight">
            {user ? (
              <>
                Welcome Back, <br className="hidden sm:inline" />
                {(user.name || 'Traveler').split(' ')[0]}.
              </>
            ) : (
              <>
                Every Journey <br className="hidden sm:inline" />Tells a Story.
              </>
            )}
          </h1>
          <p className="text-cream/80 max-w-lg mt-3 text-sm sm:text-base leading-relaxed">
            {user
              ? `Your private sanctuary. You have recorded ${stats.memories} memories across ${stats.trips} journeys and ${stats.placesVisited} destinations.`
              : 'Record memories, curate your favourite moments, and cherish every adventure in one simple place.'}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-6">
            {user ? (
              <>
                <Link
                  to="/add-memory"
                  className="inline-flex items-center gap-2 bg-clay text-cream px-6 py-3 rounded-full text-sm font-semibold shadow-stamp hover:brightness-110 active:scale-95 transition"
                >
                  <Plus size={17} strokeWidth={2.5} /> Log a Memory
                </Link>
                <Link
                  to="/trips"
                  className="inline-flex items-center gap-2 bg-cream/15 backdrop-blur-md border border-cream/30 text-cream px-5 py-3 rounded-full text-sm font-semibold hover:bg-cream/25 active:scale-95 transition"
                >
                  <Compass size={17} /> View Trips ({trips.length})
                </Link>
                <Link
                  to="/places-visited"
                  className="inline-flex items-center gap-2 bg-cream/15 backdrop-blur-md border border-cream/30 text-cream px-5 py-3 rounded-full text-sm font-semibold hover:bg-cream/25 active:scale-95 transition"
                >
                  <MapPin size={17} /> Places Visited ({stats.placesVisited})
                </Link>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() =>
                    handleRequireAuth({
                      title: 'Sign In to Log Memories',
                      message: 'Create an account or sign in to start saving your own travel polaroids, milestones, and personal stories.',
                      redirectPath: '/add-memory',
                    })
                  }
                  className="inline-flex items-center gap-2 bg-clay text-cream px-6 py-3 rounded-full text-sm font-semibold shadow-stamp hover:brightness-110 active:scale-95 transition"
                >
                  <Plus size={17} strokeWidth={2.5} /> Log a Memory
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleRequireAuth({
                      title: 'Sign In to View Trips',
                      message: 'Sign in to explore trip itineraries, timeline expenses, and manage your travel journeys.',
                      redirectPath: '/trips',
                    })
                  }
                  className="inline-flex items-center gap-2 bg-cream/15 backdrop-blur-md border border-cream/30 text-cream px-6 py-3 rounded-full text-sm font-semibold hover:bg-cream/25 active:scale-95 transition"
                >
                  <Compass size={17} /> View Trips ({trips.length})
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* When logged in, show User's Travel Stats & Journal Feed */}
      {user && (
        <>
          {/* Quick Stats Bar */}
          <section className="max-w-5xl mx-auto px-5 md:px-8 -mt-8 relative z-20">
            <TravelStats stats={stats} />
          </section>

          {/* Main Journal Feed / Memory Feed */}
          <section className="max-w-5xl mx-auto px-5 md:px-8 mt-14">
            {/* Section Title & Search */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-ink/10">
              <div>
                <h2 className="font-display text-3xl font-bold text-ink">Travel Journal</h2>
                <p className="text-ink/60 text-sm mt-1">
                  Showing {filteredMemories.length} of {memories.length} memories
                </p>
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" size={16} />
                <input
                  type="text"
                  placeholder="Search memories, places..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-paper border border-ink/15 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-forest text-ink placeholder:text-ink/40"
                />
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 mt-6">
              <button
                onClick={() => setSelectedMood('All')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                  selectedMood === 'All' && !onlyFavourites
                    ? 'bg-forest text-cream'
                    : 'bg-paper border border-ink/15 text-ink/70 hover:bg-forest/5'
                }`}
              >
                All Moments
              </button>

              <button
                onClick={() => setOnlyFavourites((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold border transition ${
                  onlyFavourites
                    ? 'bg-clay text-cream border-clay'
                    : 'bg-paper border-ink/15 text-ink/70 hover:border-clay/50'
                }`}
              >
                <Heart size={12} className={onlyFavourites ? 'fill-cream' : 'text-clay'} />
                Favourites Only
              </button>

              {moods.map((m) => (
                <button
                  key={m.key}
                  onClick={() => {
                    setSelectedMood(m.key)
                    setOnlyFavourites(false)
                  }}
                  className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-medium border transition ${
                    selectedMood === m.key && !onlyFavourites
                      ? 'bg-forest text-cream border-forest font-semibold'
                      : 'bg-paper border-ink/15 text-ink/70 hover:bg-forest/5'
                  }`}
                >
                  <span>{m.emoji}</span> {m.key}
                </button>
              ))}

              {trips.length > 0 && (
                <select
                  value={selectedTrip}
                  onChange={(e) => setSelectedTrip(e.target.value)}
                  className="ml-auto text-xs font-medium bg-paper border border-ink/15 rounded-full px-3 py-1.5 text-ink/80 focus:outline-none focus:ring-2 focus:ring-forest"
                >
                  <option value="All">All Trips</option>
                  {trips.map((t) => (
                    <option key={t.id} value={t.id}>
                      Trip: {t.name}
                    </option>
                  ))}
                </select>
              )}

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
            {filteredMemories.length > 0 ? (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 mt-8">
                {filteredMemories.map((m) => (
                  <MemoryCard
                    key={m.id}
                    memory={m}
                    onSelect={(selected) => setActiveMemory(selected)}
                    onRequireAuth={handleRequireAuth}
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
                    : 'Your journal is waiting for your first travel memory.'}
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
                    <Plus size={16} /> Add Your First Memory
                  </Link>
                )}
              </div>
            )}
          </section>

          {/* Memory Detail Modal */}
          <MemoryModal
            memory={activeMemory}
            onClose={() => setActiveMemory(null)}
            onRequireAuth={handleRequireAuth}
          />
        </>
      )}

      {/* Auth Prompt Modal for Protected Actions */}
      <AuthPromptModal
        isOpen={authModalConfig.isOpen}
        onClose={() => setAuthModalConfig((prev) => ({ ...prev, isOpen: false }))}
        title={authModalConfig.title}
        message={authModalConfig.message}
        redirectPath={authModalConfig.redirectPath}
      />
    </div>
  )
}

