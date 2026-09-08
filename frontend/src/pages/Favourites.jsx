import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Compass, Camera, BookOpen, Plus, Sparkles } from 'lucide-react'
import { useTravel } from '../context/TravelContext'
import TripCard from '../components/TripCard'
import MemoryCard from '../components/MemoryCard'
import StoryCard from '../components/StoryCard'
import MemoryModal from '../components/MemoryModal'

export default function Favourites() {
  const { trips, memories, stories } = useTravel()
  const [activeMemory, setActiveMemory] = useState(null)

  const favTrips = trips.filter((t) => t.favourite)
  const favMemories = memories.filter((m) => m.favourite)
  const favStories = stories.filter((s) => s.favourite)

  const totalFavourites = favTrips.length + favMemories.length + favStories.length

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-10 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ink/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-clay/10 text-clay text-xs font-semibold mb-2">
            <Heart size={13} className="fill-clay" /> Curated Favourites
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink">Favourite Moments</h1>
          <p className="text-ink/60 text-sm mt-1">
            {totalFavourites} cherished trips, polaroids, and personal stories.
          </p>
        </div>
      </div>

      {totalFavourites === 0 ? (
        <div className="bg-paper border border-ink/10 rounded-3xl p-12 text-center mt-10">
          <div className="w-14 h-14 rounded-full bg-clay/10 text-clay flex items-center justify-center mx-auto mb-3">
            <Heart size={24} />
          </div>
          <h3 className="font-display text-xl font-semibold text-ink">No favourites saved yet</h3>
          <p className="text-ink/60 text-sm mt-1 max-w-sm mx-auto">
            Tap the heart icon on any memory, trip, or story to pin it to your favourites.
          </p>
          <Link
            to="/memories"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold bg-forest text-cream px-5 py-2.5 rounded-full shadow-sm hover:brightness-110"
          >
            <Compass size={16} /> Explore Memories
          </Link>
        </div>
      ) : (
        <div className="space-y-14 mt-8">
          {/* Favourite Trips Section */}
          {favTrips.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-5">
                <Compass className="text-forest" size={20} />
                <h2 className="font-display text-2xl font-bold text-ink">Favourite Trips ({favTrips.length})</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favTrips.map((t) => (
                  <TripCard
                    key={t.id}
                    trip={t}
                    memoryCount={memories.filter((m) => m.tripId === t.id).length}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Favourite Memories Section */}
          {favMemories.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-5">
                <Camera className="text-clay" size={20} />
                <h2 className="font-display text-2xl font-bold text-ink">Favourite Polaroids ({favMemories.length})</h2>
              </div>
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
                {favMemories.map((m) => (
                  <MemoryCard
                    key={m.id}
                    memory={m}
                    onSelect={(selected) => setActiveMemory(selected)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Favourite Stories Section */}
          {favStories.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-5">
                <BookOpen className="text-forest" size={20} />
                <h2 className="font-display text-2xl font-bold text-ink">Favourite Stories ({favStories.length})</h2>
              </div>
              <div className="space-y-6">
                {favStories.map((s) => (
                  <StoryCard key={s.id} story={s} />
                ))}
              </div>
            </section>
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
