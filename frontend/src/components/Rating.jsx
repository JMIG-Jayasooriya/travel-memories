import React from 'react'
import { Star } from 'lucide-react'

export default function Rating({ value = 0, size = 14, onChange }) {
  const stars = [1, 2, 3, 4, 5]
  return (
    <div className="flex items-center gap-0.5">
      {stars.map((s) => (
        <button
          key={s}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(s)}
          className={onChange ? 'cursor-pointer' : 'cursor-default'}
          aria-label={`${s} star`}
        >
          <Star
            size={size}
            className={s <= value ? 'fill-clay text-clay' : 'fill-transparent text-ink/25'}
          />
        </button>
      ))}
    </div>
  )
}
