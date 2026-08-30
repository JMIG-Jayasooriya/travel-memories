import React from 'react'
import { useTravel } from '../context/TravelContext'
import TripCard from '../components/TripCard'
import MemoryCard from '../components/MemoryCard'
import StoryCard from '../components/StoryCard'

export default function Favourites() {
  const { trips, memories, stories } = useTravel()
  const favTrips = trips.filter((t) => t.favourite)
  const favMemories = memories.filter((m) => m.favourite)
  const favStories = stories.filter((s) => s.favourite)

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-12">
      <h1 className="font-display text-3xl font-semibold">Favourites</h1>
      <p className="text-ink/50 text-sm mt-1">The moments worth reopening.</p>

      <Section title="Favourite Trips">
        {favTrips.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favTrips.map((t) => <TripCard key={t.id} trip={t} memoryCount={memories.filter((m) => m.tripId === t.id).length} />)}
          </div>
        ) : <Empty />}
      </Section>

      <Section title="Favourite Memories">
        {favMemories.length ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
            {favMemories.map((m) => <MemoryCard key={m.id} memory={m} />)}
          </div>
        ) : <Empty />}
      </Section>

      <Section title="Favourite Stories">
        {favStories.length ? (
          <div className="space-y-10">{favStories.map((s) => <StoryCard key={s.id} story={s} />)}</div>
        ) : <Empty />}
      </Section>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="mt-10">
      <h2 className="font-display text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  )
}

function Empty() {
  return <p className="text-ink/40 text-sm">Nothing saved here yet — tap the heart on anything you love.</p>
}
