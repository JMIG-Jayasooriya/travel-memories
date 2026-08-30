import React from 'react'
import { Globe2, Briefcase, Camera, Heart } from 'lucide-react'

const items = (stats) => [
  { icon: Globe2, label: 'Places Visited', value: stats.placesVisited },
  { icon: Briefcase, label: 'Trips', value: stats.trips },
  { icon: Camera, label: 'Memories', value: stats.memories },
  { icon: Heart, label: 'Favourites', value: stats.favourites },
]

export default function TravelStats({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items(stats).map(({ icon: Icon, label, value }) => (
        <div key={label} className="bg-paper rounded-2xl border border-ink/10 px-5 py-6 text-center shadow-sm">
          <Icon className="mx-auto mb-2 text-clay" size={22} strokeWidth={1.75} />
          <div className="font-display text-3xl font-semibold text-forest">{value}</div>
          <div className="text-xs uppercase tracking-wide text-ink/50 mt-1">{label}</div>
        </div>
      ))}
    </div>
  )
}
