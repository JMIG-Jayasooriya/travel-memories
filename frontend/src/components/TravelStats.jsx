import React from 'react'
import { Link } from 'react-router-dom'
import { Globe2, Briefcase, Camera, Heart, ArrowUpRight } from 'lucide-react'

const items = (stats) => [
  {
    icon: Globe2,
    label: 'Places Visited',
    value: stats.placesVisited,
    to: '/places-visited',
  },
  {
    icon: Briefcase,
    label: 'Trips',
    value: stats.trips,
    to: '/trips',
  },
  {
    icon: Camera,
    label: 'Memories',
    value: stats.memories,
    to: '/memories',
  },
  {
    icon: Heart,
    label: 'Favourites',
    value: stats.favourites,
    to: '/favourites',
  },
]

export default function TravelStats({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
      {items(stats).map(({ icon: Icon, label, value, to }) => (
        <Link
          key={label}
          to={to}
          className="group relative bg-paper rounded-2xl sm:rounded-3xl border border-ink/10 px-5 py-6 text-center shadow-sm hover:shadow-stamp hover:border-forest/40 hover:-translate-y-1 active:scale-[0.98] transition-all duration-200 block cursor-pointer"
        >
          <div className="absolute top-3 right-3 text-ink/20 group-hover:text-forest opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight size={14} />
          </div>
          <div className="w-10 h-10 rounded-full bg-clay/10 text-clay flex items-center justify-center mx-auto mb-2.5 group-hover:bg-forest group-hover:text-cream transition-colors duration-200">
            <Icon size={20} strokeWidth={2} className="group-hover:scale-110 transition-transform duration-200" />
          </div>
          <div className="font-display text-3xl font-bold text-forest group-hover:text-forest-dark transition-colors">
            {value}
          </div>
          <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-ink/50 group-hover:text-ink/80 mt-1 transition-colors">
            {label}
          </div>
        </Link>
      ))}
    </div>
  )
}
