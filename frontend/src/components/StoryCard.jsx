import React from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useTravel } from '../context/TravelContext'

export default function StoryCard({ story }) {
  const { toggleFavourite } = useTravel()
  return (
    <article className="grid md:grid-cols-5 gap-6 items-center border-b border-ink/10 pb-10">
      <Link to={`/stories/${story.id}`} className="md:col-span-2 block aspect-[4/3] rounded-2xl overflow-hidden">
        <img src={story.cover} alt={story.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
      </Link>
      <div className="md:col-span-3">
        <p className="text-xs uppercase tracking-widest text-clay font-semibold">{story.location}</p>
        <Link to={`/stories/${story.id}`}>
          <h3 className="font-display text-2xl font-semibold mt-1 hover:text-forest transition-colors">{story.title}</h3>
        </Link>
        <p className="text-ink/60 text-sm mt-2 line-clamp-3">{story.content}</p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-2">
            {story.tags.map((t) => (
              <span key={t} className="text-xs bg-forest/10 text-forest px-2.5 py-1 rounded-full">#{t}</span>
            ))}
          </div>
          <button onClick={() => toggleFavourite('story', story.id)} aria-label="Toggle favourite">
            <Heart size={16} className={story.favourite ? 'fill-clay text-clay' : 'text-ink/40'} />
          </button>
        </div>
      </div>
    </article>
  )
}
