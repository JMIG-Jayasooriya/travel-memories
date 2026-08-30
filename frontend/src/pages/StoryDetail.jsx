import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'

export default function StoryDetail() {
  const { id } = useParams()
  const { stories } = useTravel()
  const story = stories.find((s) => s.id === id)

  if (!story) {
    return <div className="max-w-2xl mx-auto px-5 py-20 text-center text-ink/50">Story not found. <Link to="/stories" className="text-forest">Back to stories</Link></div>
  }

  return (
    <article className="max-w-3xl mx-auto px-5 py-12">
      <p className="text-xs uppercase tracking-widest text-clay font-semibold">{story.location} · {new Date(story.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      <h1 className="font-display text-4xl font-semibold mt-2">{story.title}</h1>
      <img src={story.cover} alt={story.title} className="w-full aspect-[16/9] object-cover rounded-3xl mt-6" />
      <div className="prose prose-lg mt-8 text-ink/80 leading-relaxed whitespace-pre-line">
        {story.content}
      </div>
      <div className="flex gap-2 mt-8">
        {story.tags.map((t) => <span key={t} className="text-xs bg-forest/10 text-forest px-2.5 py-1 rounded-full">#{t}</span>)}
      </div>
    </article>
  )
}
