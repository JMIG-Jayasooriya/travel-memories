import React, { useState, useEffect, useRef } from 'react'
import {
  X,
  MapPin,
  Calendar,
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
  Images,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Info,
} from 'lucide-react'
import { moods, companionTypes } from '../data/mockData'
import { useTravel } from '../context/TravelContext'

const FALLBACK_PHOTO = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=900&q=80'

export default function MemoryModal({ memory, onClose, onRequireAuth }) {
  const { user, toggleFavourite } = useTravel()

  // 1. All State Hooks (MUST be declared unconditionally at the very top)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [showDetails, setShowDetails] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 })

  // 2. All Ref Hooks
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const mouseDownPos = useRef({ x: 0, y: 0 })
  const hasDragged = useRef(false)
  const initialPinchDist = useRef(null)
  const initialPinchZoom = useRef(1)
  const imageContainerRef = useRef(null)

  // 3. All Effect Hooks (MUST be declared before any early return)
  useEffect(() => {
    if (memory) {
      setCurrentPhotoIndex(memory.initialIndex || 0)
      setShowDetails(false)
      setZoomLevel(1)
      setPanPosition({ x: 0, y: 0 })
    }
  }, [memory])

  // Reset zoom & pan when changing photo
  useEffect(() => {
    setZoomLevel(1)
    setPanPosition({ x: 0, y: 0 })
  }, [currentPhotoIndex])

  // Keyboard navigation & Shortcuts
  useEffect(() => {
    if (!memory) return

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        if (zoomLevel === 1) {
          handlePrev()
        }
      } else if (e.key === 'ArrowRight') {
        if (zoomLevel === 1) {
          handleNext()
        }
      } else if (e.key === 'Escape') {
        if (zoomLevel > 1) {
          handleResetZoom()
        } else {
          onClose()
        }
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn()
      } else if (e.key === '-') {
        handleZoomOut()
      } else if (e.key === '0') {
        handleResetZoom()
      } else if (e.key.toLowerCase() === 'z') {
        // Z key toggles zoom 1x / 2x
        setZoomLevel((z) => (z > 1 ? 1 : 2))
        setPanPosition({ x: 0, y: 0 })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [memory, zoomLevel, currentPhotoIndex, onClose])

  // Native fullscreen event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // 4. Safe Early Return (ONLY AFTER all hooks are defined)
  if (!memory) return null

  // Derived properties
  const allPhotos =
    memory.photos && memory.photos.length > 0
      ? memory.photos
      : [memory.photo || FALLBACK_PHOTO]
  const totalPhotos = allPhotos.length
  const currentPhoto = allPhotos[currentPhotoIndex] || memory.photo || FALLBACK_PHOTO

  const moodObj = moods.find((m) => m.key === memory.mood)
  const companionObj = companionTypes.find((c) => c.key === memory.companionType)

  // Carousel handlers
  const handlePrev = (e) => {
    e && e.stopPropagation()
    setCurrentPhotoIndex((prev) => (prev > 0 ? prev - 1 : totalPhotos - 1))
  }

  const handleNext = (e) => {
    e && e.stopPropagation()
    setCurrentPhotoIndex((prev) => (prev < totalPhotos - 1 ? prev + 1 : 0))
  }

  // Zoom handlers
  const handleZoomIn = (e) => {
    e && e.stopPropagation()
    setZoomLevel((z) => Math.min(3.5, +(z + 0.5).toFixed(1)))
  }

  const handleZoomOut = (e) => {
    e && e.stopPropagation()
    setZoomLevel((z) => {
      const next = Math.max(1, +(z - 0.5).toFixed(1))
      if (next === 1) setPanPosition({ x: 0, y: 0 })
      return next
    })
  }

  const handleResetZoom = (e) => {
    e && e.stopPropagation()
    setZoomLevel(1)
    setPanPosition({ x: 0, y: 0 })
  }

  // Single Click on photo toggles Zoom
  const handleStageClick = (e) => {
    e.stopPropagation()
    if (hasDragged.current) {
      hasDragged.current = false
      return
    }

    if (zoomLevel === 1) {
      setZoomLevel(2)
    } else {
      handleResetZoom()
    }
  }

  const handleDoubleTapZoom = (e) => {
    e.stopPropagation()
    if (zoomLevel > 1) {
      handleResetZoom()
    } else {
      setZoomLevel(2.5)
    }
  }

  // Mouse wheel zoom
  const handleWheel = (e) => {
    e.preventDefault()
    if (e.deltaY < 0) {
      setZoomLevel((z) => Math.min(3.5, +(z + 0.25).toFixed(2)))
    } else {
      setZoomLevel((z) => {
        const next = Math.max(1, +(z - 0.25).toFixed(2))
        if (next === 1) setPanPosition({ x: 0, y: 0 })
        return next
      })
    }
  }

  // Pan / Drag handlers when zoomed
  const handleMouseDown = (e) => {
    mouseDownPos.current = { x: e.clientX, y: e.clientY }
    hasDragged.current = false
    if (zoomLevel > 1) {
      isDragging.current = true
      dragStart.current = { x: e.clientX - panPosition.x, y: e.clientY - panPosition.y }
    }
  }

  const handleMouseMove = (e) => {
    const dist = Math.hypot(e.clientX - mouseDownPos.current.x, e.clientY - mouseDownPos.current.y)
    if (dist > 5) {
      hasDragged.current = true
    }
    if (isDragging.current && zoomLevel > 1) {
      setPanPosition({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      })
    }
  }

  const handleMouseUp = () => {
    isDragging.current = false
  }

  // Touch swipe support & pinch-to-zoom
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
      initialPinchDist.current = dist
      initialPinchZoom.current = zoomLevel
    } else if (e.touches.length === 1) {
      mouseDownPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      hasDragged.current = false
      if (zoomLevel === 1) {
        touchStartX.current = e.touches[0].clientX
      } else {
        isDragging.current = true
        dragStart.current = {
          x: e.touches[0].clientX - panPosition.x,
          y: e.touches[0].clientY - panPosition.y,
        }
      }
    }
  }

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && initialPinchDist.current) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
      const ratio = dist / initialPinchDist.current
      const newZoom = Math.min(3.5, Math.max(1, +(initialPinchZoom.current * ratio).toFixed(2)))
      setZoomLevel(newZoom)
      if (newZoom === 1) setPanPosition({ x: 0, y: 0 })
    } else if (e.touches.length === 1) {
      const dist = Math.hypot(
        e.touches[0].clientX - mouseDownPos.current.x,
        e.touches[0].clientY - mouseDownPos.current.y
      )
      if (dist > 6) {
        hasDragged.current = true
      }
      if (isDragging.current && zoomLevel > 1) {
        setPanPosition({
          x: e.touches[0].clientX - dragStart.current.x,
          y: e.touches[0].clientY - dragStart.current.y,
        })
      }
    }
  }

  const handleTouchEnd = (e) => {
    initialPinchDist.current = null
    if (isDragging.current) {
      isDragging.current = false
    }
    if (zoomLevel === 1 && e.changedTouches && e.changedTouches.length > 0) {
      touchEndX.current = e.changedTouches[0].clientX
      const diff = touchStartX.current - touchEndX.current
      if (Math.abs(diff) > 40) {
        if (diff > 0) handleNext()
        else handlePrev()
      }
    }
  }

  // Toggle browser fullscreen
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {})
        setIsFullscreen(false)
      }
    }
  }

  // Favourite handler
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

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 text-cream flex flex-col justify-between select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Top Header Bar */}
      <div
        className="relative z-30 px-4 sm:px-8 py-3.5 bg-gradient-to-b from-black/90 to-transparent flex items-center justify-between gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="min-w-0">
            <h2 className="font-display font-bold text-lg sm:text-2xl text-cream truncate">
              {memory.title}
            </h2>
            <div className="flex items-center gap-3 text-xs text-cream/70 mt-0.5">
              {memory.location && (
                <span className="flex items-center gap-1 font-medium text-emerald-400">
                  <MapPin size={12} /> {memory.location}
                </span>
              )}
              {memory.date && (
                <span className="flex items-center gap-1 text-cream/60">
                  <Calendar size={12} />{' '}
                  {new Date(memory.date).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              )}
            </div>
          </div>

          {/* Photo Counter Badge */}
          {totalPhotos > 1 && (
            <span className="bg-white/10 border border-white/15 px-2.5 py-1 rounded-full text-xs font-semibold text-cream shrink-0 flex items-center gap-1.5 backdrop-blur">
              <Images size={12} /> {currentPhotoIndex + 1} of {totalPhotos}
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Zoom Controls Bar */}
          <div className="flex items-center gap-1 bg-white/10 border border-white/15 rounded-full p-1 backdrop-blur shadow-sm">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 1}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent transition text-cream"
              title="Zoom Out (-)"
            >
              <ZoomOut size={15} />
            </button>
            <span
              onClick={handleResetZoom}
              className="text-[11px] font-bold px-1.5 cursor-pointer text-cream/90 hover:text-white"
              title="Click to reset zoom"
            >
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 3.5}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent transition text-cream"
              title="Zoom In (+)"
            >
              <ZoomIn size={15} />
            </button>
            {zoomLevel > 1 && (
              <button
                type="button"
                onClick={handleResetZoom}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center hover:bg-white/20 text-cream"
                title="Reset Zoom (0)"
              >
                <RotateCcw size={13} />
              </button>
            )}
          </div>

          {/* Toggle Info Details Drawer */}
          <button
            type="button"
            onClick={() => setShowDetails((prev) => !prev)}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition backdrop-blur ${
              showDetails
                ? 'bg-forest text-cream ring-2 ring-forest/40'
                : 'bg-white/10 hover:bg-white/20 text-cream'
            }`}
            title="Toggle memory details"
          >
            <Info size={17} />
          </button>

          {/* Toggle Fullscreen */}
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 text-cream flex items-center justify-center transition backdrop-blur"
            title="Toggle browser fullscreen"
          >
            {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
          </button>

          {/* Favourite Button */}
          <button
            type="button"
            onClick={handleFavouriteClick}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition backdrop-blur active:scale-90"
            title="Toggle favourite"
          >
            <Heart
              size={18}
              className={memory.favourite ? 'fill-clay text-clay' : 'text-cream/80'}
            />
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 hover:bg-red-600/90 text-cream flex items-center justify-center transition backdrop-blur ml-1 shadow-md"
            title="Close viewer (Esc)"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Full-Screen Cinema Photo Stage */}
      <div
        ref={imageContainerRef}
        className={`relative flex-1 flex items-center justify-center p-2 sm:p-6 min-h-0 overflow-hidden ${
          zoomLevel > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'
        }`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleDoubleTapZoom}
        onClick={handleStageClick}
      >
        <div
          style={{
            transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomLevel})`,
            transition: isDragging.current ? 'none' : 'transform 200ms ease-out',
            transformOrigin: 'center center',
          }}
          className="max-h-full max-w-full flex items-center justify-center select-none"
        >
          <img
            src={currentPhoto}
            alt={`${memory.title} - photo ${currentPhotoIndex + 1}`}
            className="max-h-[80vh] max-w-[95vw] object-contain drop-shadow-2xl rounded-xl"
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = FALLBACK_PHOTO
            }}
            draggable={false}
          />
        </div>

        {/* Large Floating Next / Prev Cinema Arrows (Hidden when zoomed in for panning) */}
        {totalPhotos > 1 && zoomLevel === 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/60 hover:bg-black/90 text-cream border border-white/20 flex items-center justify-center backdrop-blur shadow-2xl transition hover:scale-110 active:scale-95 z-20"
              title="Previous photo (Left Arrow)"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/60 hover:bg-black/90 text-cream border border-white/20 flex items-center justify-center backdrop-blur shadow-2xl transition hover:scale-110 active:scale-95 z-20"
              title="Next photo (Right Arrow)"
            >
              <ChevronRight size={28} />
            </button>
          </>
        )}

        {/* Zoom Hint Tooltip Pill */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/65 text-cream/80 text-[11px] font-medium px-4 py-1.5 rounded-full backdrop-blur border border-white/15 pointer-events-none shadow-lg z-20">
          {zoomLevel > 1
            ? `🔍 Zoomed ${Math.round(zoomLevel * 100)}% · Drag to pan · Click photo or press 0 to reset`
            : '🔍 Click photo or scroll wheel to zoom · Double-click for 250% · Swipe to flip'}
        </div>

        {/* Floating Quick Zoom Dock */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 sm:gap-1.5 bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-[11px] text-cream/70 font-semibold pr-1 hidden sm:inline">Zoom:</span>
          {[
            { label: 'Fit', val: 1 },
            { label: '1.5x', val: 1.5 },
            { label: '2x', val: 2 },
            { label: '3x', val: 3 },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setZoomLevel(item.val)
                if (item.val === 1) setPanPosition({ x: 0, y: 0 })
              }}
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition ${
                zoomLevel === item.val
                  ? 'bg-forest text-cream shadow-md scale-105 ring-1 ring-white/30'
                  : 'bg-white/10 hover:bg-white/20 text-cream/80'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="h-3.5 w-px bg-white/20 mx-1" />
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoomLevel >= 3.5}
            className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-cream transition disabled:opacity-30"
            title="Zoom In (+)"
          >
            <ZoomIn size={13} />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoomLevel <= 1}
            className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-cream transition disabled:opacity-30"
            title="Zoom Out (-)"
          >
            <ZoomOut size={13} />
          </button>
          {zoomLevel > 1 && (
            <button
              type="button"
              onClick={handleResetZoom}
              className="ml-1 text-[11px] font-bold text-clay hover:text-white px-1.5 transition flex items-center gap-1"
              title="Reset Zoom (0)"
            >
              <RotateCcw size={11} /> Reset
            </button>
          )}
        </div>

        {/* Collapsible Info Drawer Overlay */}
        {showDetails && (
          <div className="absolute inset-y-0 right-0 w-full sm:w-96 bg-paper/95 text-ink p-6 sm:p-8 backdrop-blur-md shadow-2xl overflow-y-auto border-l border-ink/10 flex flex-col justify-between animate-in slide-in-from-right duration-300 z-30">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-ink/10">
                <span className="font-display font-bold text-lg text-ink">Memory Details</span>
                <button
                  onClick={() => setShowDetails(false)}
                  className="w-7 h-7 rounded-full bg-ink/10 text-ink flex items-center justify-center hover:bg-ink/20"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  {memory.mood && (
                    <span className="bg-forest/10 text-forest px-3 py-1 rounded-full text-xs font-bold">
                      {moodObj?.emoji} {memory.mood}
                    </span>
                  )}
                  {memory.companionType && (
                    <span className="bg-clay/10 text-clay px-3 py-1 rounded-full text-xs font-bold">
                      {companionObj?.emoji || '✨'} {memory.companionType}
                    </span>
                  )}
                </div>

                <h3 className="font-display font-bold text-xl text-ink leading-snug">
                  {memory.title}
                </h3>

                {memory.caption && (
                  <p className="text-sm text-ink/75 italic font-serif bg-forest/5 p-3.5 rounded-xl border border-forest/15">
                    "{memory.caption}"
                  </p>
                )}

                {memory.description && memory.description !== memory.caption && (
                  <p className="text-xs text-ink/70 leading-relaxed whitespace-pre-line pt-2">
                    {memory.description}
                  </p>
                )}

                {memory.rating > 0 && (
                  <div className="flex items-center gap-1 pt-2">
                    <span className="text-xs text-ink/50 mr-1.5 font-medium">Rating:</span>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={15}
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

            <div className="pt-6 border-t border-ink/10 text-[11px] text-ink/50 flex items-center justify-between">
              <span>{allPhotos.length} Photos in Album</span>
              <span>Use Left / Right arrow keys</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Filmstrip Thumbnails & Caption Bar */}
      <div
        className="relative z-30 px-4 sm:px-8 py-3 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col sm:flex-row items-center justify-between gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Caption Snippet */}
        <div className="text-center sm:text-left min-w-0 max-w-xl">
          {memory.caption && (
            <p className="text-xs sm:text-sm text-cream/90 font-serif italic truncate">
              "{memory.caption}"
            </p>
          )}
          <p className="text-[11px] text-cream/50 mt-0.5">
            Click thumbnails or use arrows to view all photos
          </p>
        </div>

        {/* Filmstrip Mini Thumbnails */}
        {totalPhotos > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto p-1 max-w-full">
            {allPhotos.map((photoUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentPhotoIndex(idx)}
                className={`w-11 h-11 sm:w-13 sm:h-13 rounded-lg overflow-hidden shrink-0 border-2 transition ${
                  currentPhotoIndex === idx
                    ? 'border-forest ring-2 ring-forest/50 scale-105 opacity-100 shadow-lg'
                    : 'border-white/20 opacity-50 hover:opacity-90'
                }`}
                title={`View photo ${idx + 1}`}
              >
                <img
                  src={photoUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = FALLBACK_PHOTO
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
