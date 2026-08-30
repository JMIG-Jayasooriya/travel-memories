import React from 'react'
import { Link } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'
import TravelStats from '../components/TravelStats'
import TripCard from '../components/TripCard'
import MemoryCard from '../components/MemoryCard'

export default function Dashboard() {
  const { user, trips, memories, stats, expenses, travelPersonality } = useTravel()
  const totalExpenses = Object.values(expenses).flat().reduce((s, e) => s + Number(e.amount), 0)

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-12">
      <h1 className="font-display text-3xl font-semibold">
        Welcome back{user?.name ? `, ${user.name}` : ''} 👋
      </h1>
      <p className="text-ink/50 text-sm mt-1">Here's where your journeys stand.</p>

      <div className="mt-8"><TravelStats stats={stats} /></div>

      <div className="grid md:grid-cols-3 gap-6 mt-10">
        <div className="md:col-span-2 space-y-10">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-semibold">Recent Trips</h2>
              <Link to="/trips" className="text-sm text-forest hover:underline">View all</Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {trips.slice(0, 2).map((t) => <TripCard key={t.id} trip={t} memoryCount={memories.filter((m) => m.tripId === t.id).length} />)}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-semibold">Recent Memories</h2>
              <Link to="/memories" className="text-sm text-forest hover:underline">View all</Link>
            </div>
            <div className="columns-1 sm:columns-2 gap-5">
              {memories.slice(0, 4).map((m) => <MemoryCard key={m.id} memory={m} />)}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-forest text-cream rounded-3xl p-6">
            <p className="text-4xl">{travelPersonality.emoji}</p>
            <h3 className="font-display text-xl font-semibold mt-2">{travelPersonality.label}</h3>
            <p className="text-cream/80 text-sm mt-1">{travelPersonality.blurb}</p>
          </div>
          <div className="bg-paper border border-ink/10 rounded-3xl p-6">
            <h3 className="font-display text-lg font-semibold">Travel Expenses</h3>
            <p className="text-3xl font-display font-semibold text-clay mt-2">
              LKR {totalExpenses.toLocaleString()}
            </p>
            <p className="text-xs text-ink/50 mt-1">across {Object.keys(expenses).length} trips logged</p>
          </div>
          <div className="rounded-3xl overflow-hidden border border-ink/10">
            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=700&q=80" alt="map preview" className="w-full h-40 object-cover" />
            <div className="p-4">
              <Link to="/journey" className="text-sm font-medium text-forest hover:underline">Open my travel map →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
