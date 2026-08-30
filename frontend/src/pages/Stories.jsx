import React from 'react'
import { useTravel } from '../context/TravelContext'
import StoryCard from '../components/StoryCard'

export default function Stories() {
  const { stories } = useTravel()
  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-12">
      <h1 className="font-display text-3xl font-semibold">Travel Stories</h1>
      <p className="text-ink/50 text-sm mt-1">Longer-form entries from the road.</p>
      <div className="space-y-10 mt-10">
        {stories.map((s) => <StoryCard key={s.id} story={s} />)}
      </div>
    </div>
  )
}
