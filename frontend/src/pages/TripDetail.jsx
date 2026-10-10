import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Heart,
  MapPin,
  Plus,
  ArrowLeft,
  Calendar,
  Compass,
  Tag,
  Images,
  Camera,
  Wallet,
  Users,
  Train,
  GraduationCap,
  ZoomIn,
} from 'lucide-react'
import { useTravel } from '../context/TravelContext'
import Rating from '../components/Rating'
import MemoryCard from '../components/MemoryCard'
import MemoryModal from '../components/MemoryModal'

const FALLBACK_PHOTO = 'https://images.unsplash.com/photo-1546708973-b339540b5162?w=1200&q=80'

export default function TripDetail() {
  const { id } = useParams()
  const { trips, memories, toggleFavourite } = useTravel()
  const [activeMemory, setActiveMemory] = useState(null)
  const [activeTab, setActiveTab] = useState('memories') // 'memories' | 'gallery'

  const trip = trips.find((t) => t.id === id)
  const tripMemories = memories.filter((m) => m.tripId === id)

  // Collect all photos across all memories of this journey
  const allJourneyPhotos = tripMemories.flatMap((m) => {
    const list = m.photos?.length > 0 ? m.photos : [m.photo]
    return list.map((photoUrl) => ({
      url: photoUrl,
      memory: m,
    }))
  })

  if (!trip) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-24 text-center">
        <h2 className="font-display text-2xl font-bold text-ink">Trip Not Found</h2>
        <p className="text-ink/60 text-sm mt-2 mb-6">
          This trip might have been removed or doesn't exist.
        </p>
        <Link
          to="/trips"
          className="inline-flex items-center gap-2 bg-forest text-cream px-5 py-2.5 rounded-full text-sm font-semibold hover:brightness-110"
        >
          <ArrowLeft size={16} /> Back to all trips
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Trip Cover Banner */}
      <div className="relative h-[48vh] min-h-[340px] max-h-[500px]">
        <img
          src={trip.cover || FALLBACK_PHOTO}
          alt={trip.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = FALLBACK_PHOTO
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />

        <div className="absolute top-6 left-0 right-0 max-w-5xl mx-auto px-5 md:px-8">
          <Link
            to="/trips"
            className="inline-flex items-center gap-1.5 bg-paper/90 hover:bg-paper text-ink text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-sm backdrop-blur transition"
          >
            <ArrowLeft size={14} /> Back to Trips
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-5 md:px-8 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            {trip.type && (
              <span className="inline-block px-3 py-1 rounded-full bg-cream/20 backdrop-blur text-cream text-xs font-semibold mb-2">
                {trip.type}
              </span>
            )}
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-cream">
              {trip.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-cream/80 text-sm mt-2">
              <span className="flex items-center gap-1 font-medium">
                <MapPin size={14} /> {trip.destination}
              </span>
              {trip.startDate && (
                <span className="flex items-center gap-1">
                  <Calendar size={14} />{' '}
                  {new Date(trip.startDate).toLocaleDateString(undefined, {
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              )}
              <span className="flex items-center gap-1 text-cream/90">
                <Images size={14} /> {allJourneyPhotos.length} journey photos
              </span>
            </div>
          </div>

          <button
            onClick={() => toggleFavourite('trip', trip.id)}
            className="w-11 h-11 rounded-full bg-cream/90 hover:bg-cream shadow-md flex items-center justify-center transition active:scale-90 self-start sm:self-auto"
            aria-label="Toggle favourite trip"
          >
            <Heart
              size={20}
              className={trip.favourite ? 'fill-clay text-clay' : 'text-ink/60'}
            />
          </button>
        </div>
      </div>

      {/* Trip Story & Memories */}
      <div className="max-w-5xl mx-auto px-5 md:px-8 py-10 space-y-10">
        {/* About this Trip */}
        {trip.description && (
          <div className="bg-paper border border-ink/10 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="font-display text-xl font-bold text-ink mb-2">
              About this Journey
            </h2>
            <p className="text-ink/75 text-base sm:text-lg leading-relaxed font-serif italic">
              "{trip.description}"
            </p>
            {trip.rating > 0 && (
              <div className="mt-4 pt-4 border-t border-ink/5 flex items-center gap-2">
                <span className="text-xs text-ink/50 font-medium">Trip Rating:</span>
                <Rating value={trip.rating} size={18} />
              </div>
            )}

            {/* Undergraduate Student Details Banner */}
            {(trip.transitMode || trip.studentPerk || trip.budget) && (
              <div className="mt-6 pt-5 border-t border-ink/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {trip.budget && (
                  <div className="bg-forest/5 border border-forest/15 rounded-2xl p-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-forest/10 text-forest flex items-center justify-center shrink-0">
                      <Wallet size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] text-ink/50 font-semibold uppercase tracking-wider block">Student Split</span>
                      <span className="text-xs sm:text-sm font-bold text-forest">
                        Rs. {(trip.studentBudgetPerPerson || Math.round(trip.budget / 4)).toLocaleString()} / student
                      </span>
                    </div>
                  </div>
                )}

                {trip.transitMode && (
                  <div className="bg-blue-50/50 border border-blue-200/50 rounded-2xl p-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <Train size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] text-ink/50 font-semibold uppercase tracking-wider block">Transit</span>
                      <span className="text-xs sm:text-sm font-bold text-ink/80 truncate block">
                        {trip.transitMode}
                      </span>
                    </div>
                  </div>
                )}

                {trip.studentPerk && (
                  <div className="bg-amber-50/50 border border-amber-200/50 rounded-2xl p-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <GraduationCap size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] text-ink/50 font-semibold uppercase tracking-wider block">Student Perk</span>
                      <span className="text-xs sm:text-sm font-bold text-ink/80 truncate block">
                        {trip.studentPerk}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* View Switcher: Scrapbook vs Photo Gallery Album */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-ink/10">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('memories')}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition ${
                  activeTab === 'memories'
                    ? 'bg-forest text-cream shadow-sm'
                    : 'bg-paper border border-ink/15 text-ink/70 hover:bg-forest/5'
                }`}
              >
                Scrapbook Cards ({tripMemories.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('gallery')}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition ${
                  activeTab === 'gallery'
                    ? 'bg-forest text-cream shadow-sm'
                    : 'bg-paper border border-ink/15 text-ink/70 hover:bg-forest/5'
                }`}
              >
                <Images size={14} />
                <span>Journey Album ({allJourneyPhotos.length} Photos)</span>
              </button>
            </div>

            <Link
              to="/add-memory"
              className="inline-flex items-center gap-1.5 bg-clay text-cream px-4 py-2 rounded-full text-xs sm:text-sm font-semibold shadow-sm hover:brightness-110 active:scale-95 transition self-start sm:self-auto"
            >
              <Plus size={15} strokeWidth={2.5} /> Add Memory to Trip
            </Link>
          </div>

          {/* Tab 1: Scrapbook Cards */}
          {activeTab === 'memories' && (
            <>
              {tripMemories.length ? (
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
                  {tripMemories.map((m) => (
                    <MemoryCard
                      key={m.id}
                      memory={m}
                      onSelect={(selected) => setActiveMemory(selected)}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-paper border border-ink/10 rounded-3xl p-10 text-center">
                  <Compass className="mx-auto text-forest/40 mb-3" size={32} />
                  <h3 className="font-display text-lg font-semibold text-ink">
                    No memories added yet
                  </h3>
                  <p className="text-ink/50 text-xs sm:text-sm mt-1">
                    Capture the best moments, photos, and highlights from {trip.name}.
                  </p>
                  <Link
                    to="/add-memory"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold bg-forest text-cream px-4 py-2 rounded-full hover:brightness-110"
                  >
                    <Plus size={14} /> Add First Memory
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Tab 2: Journey Photo Album Gallery */}
          {activeTab === 'gallery' && (
            <>
              {allJourneyPhotos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {allJourneyPhotos.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveMemory({ ...item.memory, initialIndex: item.photoIndex })}
                      className="group relative aspect-square rounded-2xl overflow-hidden border border-ink/10 cursor-pointer shadow-sm hover:shadow-md transition"
                      title="Click to zoom photo full screen"
                    >
                      <img
                        src={item.url}
                        alt={`Journey photo ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null
                          e.currentTarget.src = FALLBACK_PHOTO
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                        <span className="text-cream text-xs font-semibold line-clamp-1 flex items-center gap-1">
                          <ZoomIn size={12} className="shrink-0" /> {item.memory.title}
                        </span>
                        <span className="text-cream/70 text-[10px]">
                          {item.memory.location} · Photo {item.photoIndex + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-paper border border-ink/10 rounded-3xl p-10 text-center">
                  <Camera className="mx-auto text-forest/40 mb-3" size={32} />
                  <h3 className="font-display text-lg font-semibold text-ink">
                    No photos in this journey album yet
                  </h3>
                  <p className="text-ink/50 text-xs sm:text-sm mt-1">
                    Log a memory to start filling your journey photo gallery.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Memory Detail Modal with Full Carousel Slider */}
      <MemoryModal
        memory={activeMemory}
        onClose={() => setActiveMemory(null)}
      />
    </div>
  )
}
