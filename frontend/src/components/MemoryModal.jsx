import React, { useState, useEffect } from 'react'
import {
  X,
  MapPin,
  Calendar,
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
  Images,
} from 'lucide-react'
import { moods, companionTypes } from '../data/mockData'
import { useTravel } from '../context/TravelContext'

export default function MemoryModal({ memory, onClose, onRequireAuth }) {
  const { user, toggleFavourite } = useTravel()
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  // Reset index when memory changes
  useEffect(() => {
    setCurrentPhotoIndex(0)
  }, [memory])

  if (!memory) return null

  const allPhotos =
    memory.photos?.length > 0 ? memory.photos : [memory.photo || '']
  const totalPhotos = allPhotos.length
  const currentPhoto = allPhotos[currentPhotoIndex] || memory.photo

  const moodObj = moods.find((m) => m.key === memory.mood)
  const companionObj = companionTypes.find((c) => c.key === memory.companionType)

  const handlePrev = (e) => {
    e.stopPropagation()
    setCurrentPhotoIndex((prev) => (prev > 0 ? prev - 1 : totalPhotos - 1))
  }

  const handleNext = (e) => {
    e.stopPropagation()
    setCurrentPhotoIndex((prev) => (prev < totalPhotos - 1 ? prev + 1 : 0))
  }

  const handleFavouriteClick = (e) => {
    e.stopPropagation()
    if (!user) {
      if (onRequireAuth) {
        onRequireAuth({
          title: 'Sign In to Favourite',
          message: 'Sign in to your account to save this travel memory to your favourites collection.',
          redirectPath: '/',
        })
      }
      return
    }
    toggleFavourite('memory', memory.id)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setCurrentPhotoIndex((prev) => (prev > 0 ? prev - 1 : totalPhotos - 1))
      } else if (e.key === 'ArrowRight') {
        setCurrentPhotoIndex((prev) => (prev < totalPhotos - 1 ? prev + 1 : 0))
      } else if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [totalPhotos, onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-ink/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative bg-paper w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-ink/10 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-ink/70 hover:bg-ink text-cream flex items-center justify-center backdrop-blur transition"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto">
          {/* Photo Carousel Area */}
          <div className="relative aspect-[16/10] bg-ink/10 select-none group">
            <img
              src={currentPhoto}
              alt={`${memory.title} - photo ${currentPhotoIndex + 1}`}
              className="w-full h-full object-cover transition-all duration-300"
            />

            {/* Carousel Navigation Arrows */}
            {totalPhotos > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-cream/80 hover:bg-cream text-ink flex items-center justify-center shadow-md backdrop-blur transition active:scale-90"
                  aria-label="Previous photo"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-cream/80 hover:bg-cream text-ink flex items-center justify-center shadow-md backdrop-blur transition active:scale-90"
                  aria-label="Next photo"
                >
                  <ChevronRight size={20} />
                </button>

                {/* Counter Badge */}
                <div className="absolute top-4 left-4 z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink/75 text-cream text-xs font-semibold backdrop-blur shadow-sm">
                  <Images size={13} />
                  <span>
                    {currentPhotoIndex + 1} / {totalPhotos}
                  </span>
                </div>
              </>
            )}

            {/* Favourite Button */}
            <button
              onClick={handleFavouriteClick}
              className="absolute bottom-4 right-4 z-20 w-10 h-10 rounded-full bg-cream/90 hover:bg-cream shadow-md flex items-center justify-center transition active:scale-95"
              aria-label="Toggle favourite"
            >
              <Heart
                size={18}
                className={memory.favourite ? 'fill-clay text-clay' : 'text-ink/60'}
              />
            </button>
          </div>

          {/* Album Thumbnail Strip */}
          {totalPhotos > 1 && (
            <div className="px-6 pt-3 pb-1 flex items-center gap-2 overflow-x-auto border-b border-ink/5 bg-paper">
              {allPhotos.map((photoUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentPhotoIndex(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                    currentPhotoIndex === idx
                      ? 'border-forest ring-2 ring-forest/30 scale-105'
                      : 'border-ink/15 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={photoUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Content Details */}
          <div className="p-6 md:p-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest/10 text-forest text-xs font-semibold">
                  {moodObj?.emoji} {memory.mood || 'Travel'}
                </span>
                {memory.companionType && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-clay/10 text-clay text-xs font-semibold">
                    {companionObj?.emoji || '✨'} {memory.companionType} Trip
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs text-ink/60">
                {memory.date && (
                  <span className="flex items-center gap-1">
                    <Calendar size={13} />{' '}
                    {new Date(memory.date).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                )}
                {memory.location && (
                  <span className="flex items-center gap-1 font-medium text-ink/80">
                    <MapPin size={13} /> {memory.location}
                  </span>
                )}
              </div>
            </div>

            <h2 className="font-display text-2xl md:text-3xl font-bold text-ink">
              {memory.title}
            </h2>

            {memory.caption && (
              <p className="text-base md:text-lg text-ink/80 leading-relaxed font-serif italic bg-forest/5 p-4 rounded-2xl border border-forest/10">
                "{memory.caption}"
              </p>
            )}

            {memory.description && memory.description !== memory.caption && (
              <div className="text-ink/75 leading-relaxed text-sm md:text-base pt-2 whitespace-pre-line">
                {memory.description}
              </div>
            )}

            {memory.rating > 0 && (
              <div className="flex items-center gap-1.5 pt-2">
                <span className="text-xs text-ink/50 font-medium mr-1">
                  Experience:
                </span>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < memory.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-ink/20'
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
