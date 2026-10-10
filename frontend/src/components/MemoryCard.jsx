import React, { useState } from 'react'
import { Heart, MapPin, Calendar, Images, ChevronLeft, ChevronRight, Maximize2, ZoomIn } from 'lucide-react'
import { moods, companionTypes } from '../data/mockData'
import { useTravel } from '../context/TravelContext'

const FALLBACK_PHOTO = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=900&q=80'

export default function MemoryCard({ memory, onSelect, onRequireAuth }) {
  const { user, toggleFavourite } = useTravel()
  const moodEmoji = moods.find((m) => m.key === memory.mood)?.emoji
  const companion = companionTypes.find((c) => c.key === memory.companionType)

  const allPhotos =
    memory.photos && memory.photos.length > 0
      ? memory.photos
      : [memory.photo || FALLBACK_PHOTO]

  const [photoIndex, setPhotoIndex] = useState(0)

  const currentPhoto = allPhotos[photoIndex] || memory.photo || FALLBACK_PHOTO

  const handlePrev = (e) => {
    e.stopPropagation()
    setPhotoIndex((prev) => (prev > 0 ? prev - 1 : allPhotos.length - 1))
  }

  const handleNext = (e) => {
    e.stopPropagation()
    setPhotoIndex((prev) => (prev < allPhotos.length - 1 ? prev + 1 : 0))
  }

  const handleOpenFullscreen = (e, idx = photoIndex) => {
    e && e.stopPropagation()
    onSelect && onSelect({ ...memory, initialIndex: idx })
  }

  const handleFavouriteClick = (e) => {
    e.stopPropagation()
    if (!user) {
      if (onRequireAuth) {
        onRequireAuth({
          title: 'Sign In to Favourite Moments',
          message: 'Sign in to bookmark and save your favourite travel memories to your personal collection.',
          redirectPath: '/',
        })
      }
      return
    }
    toggleFavourite('memory', memory.id)
  }

  return (
    <div
      onClick={(e) => handleOpenFullscreen(e, photoIndex)}
      className="break-inside-avoid mb-6 bg-paper rounded-2xl overflow-hidden border border-ink/10 shadow-stamp hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Main Photo Display Area - Touch / Click to open big full screen */}
        <div
          onClick={(e) => handleOpenFullscreen(e, photoIndex)}
          className="relative overflow-hidden aspect-[4/3] bg-ink/5 select-none group/img"
          title="Click to view & zoom photo"
        >
          <img
            src={currentPhoto}
            alt={`${memory.title} - photo ${photoIndex + 1}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = FALLBACK_PHOTO
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Full Screen & Zoom Overlay Badge */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all pointer-events-none z-10 bg-black/20 backdrop-blur-[1px]">
            <span className="bg-ink/85 backdrop-blur-md text-cream text-xs font-bold px-3.5 py-2 rounded-full flex items-center gap-2 shadow-2xl border border-white/20">
              <ZoomIn size={14} /> Click to Zoom Photo
            </span>
          </div>

          {/* Multi-Photo Album Counter Badge */}
          {allPhotos.length > 1 && (
            <span
              onClick={(e) => handleOpenFullscreen(e, photoIndex)}
              className="absolute top-3 left-3 bg-ink/80 hover:bg-forest text-cream text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur shadow-sm transition z-20"
              title="Click to view full photo gallery"
            >
              <Images size={11} />
              <span>{photoIndex + 1} / {allPhotos.length} photos</span>
            </span>
          )}

          {/* In-Card Next/Prev Carousel Controls */}
          {allPhotos.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-cream/90 hover:bg-cream text-ink flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all active:scale-90"
                aria-label="Previous photo in card"
                title="Previous photo"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-cream/90 hover:bg-cream text-ink flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all active:scale-90"
                aria-label="Next photo in card"
                title="Next photo"
              >
                <ChevronRight size={16} />
              </button>

              {/* Dot Indicators */}
              <div className="absolute bottom-2.5 right-2.5 z-20 flex items-center gap-1 bg-ink/70 backdrop-blur px-2 py-1 rounded-full">
                {allPhotos.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setPhotoIndex(i)
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      photoIndex === i ? 'w-3 bg-cream' : 'w-1.5 bg-cream/45'
                    }`}
                    title={`Go to photo ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Quick Zoom Button */}
          <button
            type="button"
            onClick={(e) => handleOpenFullscreen(e, photoIndex)}
            className="absolute top-3 right-12 w-8 h-8 rounded-full bg-cream/90 hover:bg-cream backdrop-blur flex items-center justify-center shadow-sm transition active:scale-90 z-20 text-ink/70 hover:text-forest"
            aria-label="Zoom photo"
            title="Zoom photo full screen"
          >
            <ZoomIn size={14} />
          </button>

          {/* Favourite Button */}
          <button
            type="button"
            onClick={handleFavouriteClick}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-cream/90 hover:bg-cream backdrop-blur flex items-center justify-center shadow-sm transition active:scale-90 z-20"
            aria-label="Toggle favourite"
          >
            <Heart
              size={14}
              className={memory.favourite ? 'fill-clay text-clay' : 'text-ink/60 hover:text-clay'}
            />
          </button>

          {/* Mood & Companion Badges */}
          <div className="absolute bottom-2.5 left-2.5 flex flex-wrap items-center gap-1.5 pointer-events-none z-10">
            {memory.mood && (
              <span className="bg-paper/90 backdrop-blur px-2.5 py-0.5 rounded-full text-xs font-medium text-ink shadow-sm">
                {moodEmoji} {memory.mood}
              </span>
            )}
            {memory.companionType && (
              <span className="bg-ink/80 text-cream backdrop-blur px-2 py-0.5 rounded-full text-[11px] font-medium shadow-sm flex items-center gap-1">
                {companion?.emoji || '✨'} {memory.companionType}
              </span>
            )}
          </div>
        </div>

        {/* Mini Thumbnail Row for Multi-Photo Memories */}
        {allPhotos.length > 1 && (
          <div className="px-3.5 py-2 bg-cream/35 border-b border-ink/5 flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-bold text-ink/40 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Images size={11} /> Photos:
            </span>
            <div className="flex items-center gap-1.5">
              {allPhotos.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setPhotoIndex(idx)
                  }}
                  className={`w-9 h-9 rounded-lg overflow-hidden shrink-0 border-2 transition ${
                    photoIndex === idx
                      ? 'border-forest ring-2 ring-forest/30 scale-105 shadow-sm'
                      : 'border-ink/15 opacity-60 hover:opacity-100'
                  }`}
                  title={`View photo ${idx + 1}`}
                >
                  <img
                    src={p}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = FALLBACK_PHOTO
                    }}
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={(e) => handleOpenFullscreen(e, photoIndex)}
              className="ml-auto text-[10px] text-forest font-bold hover:underline shrink-0 flex items-center gap-1 bg-forest/10 hover:bg-forest/20 px-2.5 py-1 rounded-md transition"
              title="Zoom photo full screen"
            >
              <ZoomIn size={11} /> Zoom Photo
            </button>
          </div>
        )}

        {/* Card Content Details */}
        <div className="p-4 sm:p-5">
          <h3 className="font-display font-semibold text-lg text-ink leading-snug group-hover:text-forest transition-colors">
            {memory.title}
          </h3>

          {memory.caption && (
            <p className="text-sm text-ink/70 mt-1.5 line-clamp-2 italic font-serif">
              "{memory.caption}"
            </p>
          )}
        </div>
      </div>

      <div className="px-4 sm:px-5 pb-4">
        <div className="flex items-center justify-between pt-3 border-t border-ink/5 text-xs text-ink/50">
          <span className="flex items-center gap-1 font-medium text-ink/70">
            <MapPin size={12} className="text-forest" /> {memory.location}
          </span>
          {memory.date && (
            <span className="flex items-center gap-1">
              <Calendar size={11} />{' '}
              {new Date(memory.date).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
