import React from 'react'
import { Heart, MapPin } from 'lucide-react'
import { moods } from '../data/mockData'
import { useTravel } from '../context/TravelContext'

export default function MemoryCard({ memory }) {
  const { toggleFavourite } = useTravel()
  const moodEmoji = moods.find((m) => m.key === memory.mood)?.emoji

  return (
    <div className="break-inside-avoid mb-5 bg-paper rounded-2xl overflow-hidden border border-ink/10 shadow-stamp stamp-rotate hover:rotate-0 transition-transform duration-300">
      <div className="relative">
        <img src={memory.photo} alt={memory.title} className="w-full object-cover" />
        <button
          onClick={() => toggleFavourite('memory', memory.id)}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-cream/90 flex items-center justify-center"
          aria-label="Toggle favourite"
        >
          <Heart size={13} className={memory.favourite ? 'fill-clay text-clay' : 'text-ink/60'} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-display font-semibold text-ink leading-snug">{memory.title}</h3>
        <p className="text-sm text-ink/60 mt-1 italic">"{memory.caption}"</p>
        <div className="flex items-center justify-between mt-3 text-xs text-ink/50">
          <span className="flex items-center gap-1"><MapPin size={11} /> {memory.location}</span>
          <span>{moodEmoji} {memory.mood}</span>
        </div>
      </div>
    </div>
  )
}
