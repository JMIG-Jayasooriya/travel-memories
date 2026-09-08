import React from 'react'
import { Heart, MapPin, Calendar } from 'lucide-react'
import { moods } from '../data/mockData'
import { useTravel } from '../context/TravelContext'

export default function MemoryCard({ memory, onSelect, onRequireAuth }) {
  const { user, toggleFavourite } = useTravel()
  const moodEmoji = moods.find((m) => m.key === memory.mood)?.emoji

  const handleFavouriteClick = (e) => {
    e.stopPropagation()
    if (!user) {
      if (onRequireAuth) {
        onRequireAuth({
          title: 'Sign In to Favourite Moments',
          message: 'Sign in to bookmark and save your favourite travel memories to your personal collection.',
          redirectPath: '/',
        })
      }
      return
    }
    toggleFavourite('memory', memory.id)
  }

  return (
    <div
      onClick={() => onSelect && onSelect(memory)}
      className="break-inside-avoid mb-6 bg-paper rounded-2xl overflow-hidden border border-ink/10 shadow-stamp hover:shadow-lg transition-all duration-300 group cursor-pointer"
    >
      <div className="relative overflow-hidden aspect-[4/3] bg-ink/5">
        <img
          src={memory.photo}
          alt={memory.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <button
          type="button"
          onClick={handleFavouriteClick}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-cream/90 hover:bg-cream backdrop-blur flex items-center justify-center shadow-sm transition active:scale-90"
          aria-label="Toggle favourite"
        >
          <Heart
            size={14}
            className={memory.favourite ? 'fill-clay text-clay' : 'text-ink/60 hover:text-clay'}
          />
        </button>

        {memory.mood && (
          <span className="absolute bottom-3 left-3 bg-paper/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-medium text-ink shadow-sm">
            {moodEmoji} {memory.mood}
          </span>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="font-display font-semibold text-lg text-ink leading-snug group-hover:text-forest transition-colors">
          {memory.title}
        </h3>
        
        {memory.caption && (
          <p className="text-sm text-ink/70 mt-1.5 line-clamp-2 italic font-serif">
            "{memory.caption}"
          </p>
        )}

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-ink/5 text-xs text-ink/50">
          <span className="flex items-center gap-1 font-medium text-ink/70">
            <MapPin size={12} className="text-forest" /> {memory.location}
          </span>
          {memory.date && (
            <span className="flex items-center gap-1">
              <Calendar size={11} /> {new Date(memory.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

