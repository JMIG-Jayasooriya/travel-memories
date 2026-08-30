import React from 'react'
import { moods } from '../data/mockData'

export default function MoodSelector({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {moods.map(({ key, emoji }) => (
        <button
          type="button"
          key={key}
          onClick={() => onChange(key)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition ${
            value === key
              ? 'bg-forest text-cream border-forest'
              : 'border-ink/15 text-ink/70 hover:border-forest/50'
          }`}
        >
          <span>{emoji}</span> {key}
        </button>
      ))}
    </div>
  )
}
