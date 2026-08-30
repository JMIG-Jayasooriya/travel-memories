import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Camera, MapPin } from 'lucide-react'
import Rating from './Rating'
import { useTravel } from '../context/TravelContext'

export default function TripCard({ trip, memoryCount = 0 }) {
  const { toggleFavourite } = useTravel()
  const fmt = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div className="group bg-paper rounded-3xl overflow-hidden border border-ink/10 shadow-stamp hover:-translate-y-1 transition-transform duration-300">
      <Link to={`/trips/${trip.id}`} className="block relative aspect-[4/3] overflow-hidden">
        <img
          src={trip.cover}
          alt={trip.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 bg-cream/90 text-forest text-xs font-semibold px-2.5 py-1 rounded-full">
          {trip.type}
        </span>
        <button
          onClick={(e) => { e.preventDefault(); toggleFavourite('trip', trip.id) }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-cream/90 flex items-center justify-center"
          aria-label="Toggle favourite"
        >
          <Heart size={15} className={trip.favourite ? 'fill-clay text-clay' : 'text-ink/60'} />
        </button>
      </Link>
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-ink">{trip.name}</h3>
        <p className="flex items-center gap-1 text-xs text-ink/50 mt-1">
          <MapPin size={12} /> {trip.destination}
        </p>
        <p className="text-xs text-ink/50 mt-1">{fmt(trip.startDate)} – {fmt(trip.endDate)}</p>
        <div className="flex items-center justify-between mt-3">
          <Rating value={trip.rating} />
          <span className="flex items-center gap-1 text-xs text-ink/50">
            <Camera size={12} /> {memoryCount} memories
          </span>
        </div>
      </div>
    </div>
  )
}
