import React from 'react'
import { X, MapPin, Calendar, Heart, Star } from 'lucide-react'
import { moods } from '../data/mockData'
import { useTravel } from '../context/TravelContext'

export default function MemoryModal({ memory, onClose, onRequireAuth }) {
  const { user, toggleFavourite } = useTravel()

  if (!memory) return null

  const moodObj = moods.find((m) => m.key === memory.mood)

  const handleFavouriteClick = () => {
    if (!user) {
      if (onRequireAuth) {
        onRequireAuth({
          title: 'Sign In to Favourite',
          message: 'Sign in to your account to save this travel memory to your favourites collection.',
          redirectPath: '/',
        })
      }
      return
    }
    toggleFavourite('memory', memory.id)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-ink/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative bg-paper w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-ink/10 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-ink/70 hover:bg-ink text-cream flex items-center justify-center backdrop-blur transition"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto">
          {/* Photo */}
          <div className="relative aspect-[16/10] bg-ink/10">
            <img
              src={memory.photo}
              alt={memory.title}
              className="w-full h-full object-cover"
            />
            <button
              onClick={handleFavouriteClick}
              className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-cream/90 hover:bg-cream shadow-md flex items-center justify-center transition active:scale-95"
              aria-label="Toggle favourite"
            >
              <Heart
                size={18}
                className={memory.favourite ? 'fill-clay text-clay' : 'text-ink/60'}
              />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest/10 text-forest text-xs font-semibold">
                {moodObj?.emoji} {memory.mood || 'Travel'}
              </span>

              <div className="flex items-center gap-4 text-xs text-ink/60">
                {memory.date && (
                  <span className="flex items-center gap-1">
                    <Calendar size={13} /> {new Date(memory.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
                {memory.location && (
                  <span className="flex items-center gap-1 font-medium text-ink/80">
                    <MapPin size={13} /> {memory.location}
                  </span>
                )}
              </div>
            </div>

            <h2 className="font-display text-2xl md:text-3xl font-bold text-ink">
              {memory.title}
            </h2>

            {memory.caption && (
              <p className="text-base md:text-lg text-ink/80 leading-relaxed font-serif italic bg-forest/5 p-4 rounded-2xl border border-forest/10">
                "{memory.caption}"
              </p>
            )}

            {memory.description && memory.description !== memory.caption && (
              <div className="text-ink/75 leading-relaxed text-sm md:text-base pt-2 whitespace-pre-line">
                {memory.description}
              </div>
            )}

            {memory.rating > 0 && (
              <div className="flex items-center gap-1.5 pt-2">
                <span className="text-xs text-ink/50 font-medium mr-1">Experience:</span>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < memory.rating ? 'fill-amber-400 text-amber-400' : 'text-ink/20'}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
