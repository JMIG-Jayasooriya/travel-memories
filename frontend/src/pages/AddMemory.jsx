import React, { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Image,
  Sparkles,
  Check,
  Heart,
  MapPin,
  Calendar,
  Upload,
  Plus,
  Trash2,
  Star,
  Layers,
  Images,
} from 'lucide-react'
import { useTravel } from '../context/TravelContext'
import { companionTypes } from '../data/mockData'
import MoodSelector from '../components/MoodSelector'
import Rating from '../components/Rating'

const samplePhotos = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=900&q=80',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&q=80',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&q=80',
  'https://images.unsplash.com/photo-1586183189334-25997a53f818?w=900&q=80',
  'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=900&q=80',
]

export default function AddMemory() {
  const { addMemory } = useTravel()
  const navigate = useNavigate()

  const todayStr = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    title: '',
    location: '',
    date: todayStr,
    description: '',
    mood: 'Happy',
    rating: 5,
    photo: samplePhotos[0], // Front display cover photo
    photos: [samplePhotos[0]], // Full album gallery photos
    companionType: 'Solo', // Solo, Friends, Family, Official, Other
    favourite: false,
  })

  const [galleryUrlInput, setGalleryUrlInput] = useState('')
  const [errors, setErrors] = useState({})

  const coverFileInputRef = useRef(null)
  const albumFileInputRef = useRef(null)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  // Handle single cover file upload
  const handleCoverFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result
      if (base64) {
        setForm((prev) => {
          const newPhotos = prev.photos.includes(prev.photo)
            ? [base64, ...prev.photos.filter((p) => p !== prev.photo)]
            : [base64, ...prev.photos]
          return {
            ...prev,
            photo: base64,
            photos: newPhotos,
          }
        })
      }
    }
    reader.readAsDataURL(file)
  }

  // Handle multiple album photos upload
  const handleAlbumFileUpload = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64 = event.target?.result
        if (base64) {
          setForm((prev) => {
            if (prev.photos.includes(base64)) return prev
            return {
              ...prev,
              photos: [...prev.photos, base64],
            }
          })
        }
      }
      reader.readAsDataURL(file)
    })
  }

  // Add photo to gallery via URL
  const handleAddGalleryUrl = (e) => {
    e.preventDefault()
    const clean = galleryUrlInput.trim()
    if (!clean) return
    if (!form.photos.includes(clean)) {
      setForm((prev) => ({
        ...prev,
        photos: [...prev.photos, clean],
      }))
    }
    setGalleryUrlInput('')
  }

  // Set any gallery photo as the front display cover
  const handleSetAsCover = (photoUrl) => {
    set('photo', photoUrl)
  }

  // Remove photo from gallery
  const handleRemovePhoto = (photoUrl) => {
    setForm((prev) => {
      const remaining = prev.photos.filter((p) => p !== photoUrl)
      const newCover =
        prev.photo === photoUrl
          ? remaining[0] || samplePhotos[0]
          : prev.photo
      return {
        ...prev,
        photo: newCover,
        photos: remaining.length > 0 ? remaining : [newCover],
      }
    })
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Please provide a title for your memory.'
    if (!form.location.trim()) e.location = 'Location is required.'
    if (!form.date) e.date = 'Date is required.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = (e) => {
    e.preventDefault()
    if (!validate()) return

    // Ensure cover photo is part of photos array
    const finalPhotos = Array.from(new Set([form.photo, ...(form.photos || [])]))

    addMemory({
      title: form.title.trim(),
      location: form.location.trim(),
      date: form.date,
      caption: form.description.trim(),
      description: form.description.trim(),
      mood: form.mood,
      rating: form.rating,
      photo: form.photo.trim() || samplePhotos[0],
      photos: finalPhotos,
      companionType: form.companionType || 'Solo',
      favourite: form.favourite,
    })
    navigate('/memories')
  }

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-8 py-10 pb-24">
      {/* Back button */}
      <Link
        to="/memories"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink/60 hover:text-forest bg-paper border border-ink/10 px-3.5 py-1.5 rounded-full mb-6 transition"
      >
        <ArrowLeft size={14} /> Back to Memories
      </Link>

      <div className="bg-paper border border-ink/10 rounded-3xl p-6 sm:p-10 shadow-stamp">
        <div className="pb-6 border-b border-ink/10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest/10 text-forest text-xs font-semibold mb-2">
            <Images size={13} /> Photo Scrapbook Entry
          </div>
          <h1 className="font-display text-3xl font-bold text-ink">Add a New Memory</h1>
          <p className="text-ink/60 text-sm mt-1">
            Capture a single front cover photo or a full multi-photo album for this journey.
          </p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-7">
          {/* Front Display Cover Photo */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-ink">
                Front Display Photo (Cover)
              </label>
              <span className="text-xs font-semibold text-forest bg-forest/10 px-2.5 py-0.5 rounded-full">
                Front Card Cover
              </span>
            </div>

            <div className="relative aspect-[16/9] max-h-72 rounded-2xl overflow-hidden border-2 border-forest/30 bg-ink/5 mb-3 shadow-sm group">
              <img
                src={form.photo || samplePhotos[0]}
                alt="Memory front preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = samplePhotos[0]
                }}
              />
              <div className="absolute inset-0 bg-ink/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => coverFileInputRef.current?.click()}
                  className="bg-cream/95 text-ink text-xs font-bold px-4 py-2 rounded-full shadow-md flex items-center gap-1.5 hover:bg-white"
                >
                  <Upload size={14} /> Upload Front Photo
                </button>
              </div>
            </div>

            {/* Upload or Paste Cover URL */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <input
                type="file"
                ref={coverFileInputRef}
                onChange={handleCoverFileUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => coverFileInputRef.current?.click()}
                className="sm:col-span-4 flex items-center justify-center gap-1.5 bg-paper border border-ink/20 hover:border-forest text-ink text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-forest/5 transition"
              >
                <Upload size={14} /> Choose File
              </button>
              <input
                type="url"
                value={form.photo}
                onChange={(e) => {
                  const val = e.target.value
                  set('photo', val)
                  if (val && !form.photos.includes(val)) {
                    set('photos', [val, ...form.photos])
                  }
                }}
                className={`${inputCls} sm:col-span-8`}
                placeholder="Or paste cover image URL (https://...)"
              />
            </div>
          </div>

          {/* Photo Gallery Album (Multiple Photos) */}
          <div className="bg-forest/5 border border-forest/15 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-display font-bold text-lg text-ink flex items-center gap-2">
                  <Images size={18} className="text-forest" />
                  <span>Photo Gallery Album ({form.photos.length})</span>
                </h3>
                <p className="text-xs text-ink/65 mt-0.5">
                  Add more photos from this journey to create an interactive photo gallery album.
                </p>
              </div>

              {/* Upload Multiple Album Photos Button */}
              <input
                type="file"
                multiple
                ref={albumFileInputRef}
                onChange={handleAlbumFileUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => albumFileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 bg-forest text-cream text-xs font-bold px-4 py-2 rounded-full shadow-sm hover:brightness-110 active:scale-95 transition self-start sm:self-auto shrink-0"
              >
                <Plus size={14} strokeWidth={2.5} /> Add Album Photos
              </button>
            </div>

            {/* Album Photos Thumbnails Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
              {form.photos.map((p, idx) => {
                const isCover = p === form.photo
                return (
                  <div
                    key={idx}
                    className={`relative group rounded-xl overflow-hidden aspect-square border-2 transition shadow-sm ${
                      isCover ? 'border-clay ring-2 ring-clay/30' : 'border-ink/15 hover:border-forest'
                    }`}
                  >
                    <img src={p} alt={`Album photo ${idx + 1}`} className="w-full h-full object-cover" />

                    {/* Cover Ribbon Badge */}
                    {isCover && (
                      <span className="absolute top-1.5 left-1.5 bg-clay text-cream text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shadow-sm">
                        Cover
                      </span>
                    )}

                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                      {!isCover && (
                        <button
                          type="button"
                          onClick={() => handleSetAsCover(p)}
                          className="text-[10px] font-bold bg-cream text-forest px-2 py-0.5 rounded shadow hover:bg-white transition"
                        >
                          Set Cover
                        </button>
                      )}
                      {form.photos.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(p)}
                          className="text-[10px] font-bold bg-red-600 text-cream p-1 rounded-full shadow hover:bg-red-700 transition"
                          title="Remove photo from album"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}

              {/* Add Photo Tile */}
              <button
                type="button"
                onClick={() => albumFileInputRef.current?.click()}
                className="border-2 border-dashed border-ink/20 hover:border-forest rounded-xl aspect-square flex flex-col items-center justify-center text-ink/50 hover:text-forest bg-paper/50 hover:bg-paper transition"
              >
                <Plus size={20} />
                <span className="text-[10px] font-semibold mt-1">Upload More</span>
              </button>
            </div>

            {/* Add photo via URL input & sample selector */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
              <input
                type="url"
                value={galleryUrlInput}
                onChange={(e) => setGalleryUrlInput(e.target.value)}
                placeholder="Or paste an image URL to add to album..."
                className="w-full bg-paper border border-ink/15 rounded-xl px-3 py-2 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-forest"
              />
              <button
                type="button"
                onClick={handleAddGalleryUrl}
                className="w-full sm:w-auto bg-forest/10 hover:bg-forest text-forest hover:text-cream px-4 py-2 rounded-xl text-xs font-bold transition shrink-0"
              >
                Add URL to Album
              </button>
            </div>

            {/* Quick Sample Photos */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-ink/50 font-medium">Quick samples:</span>
              {samplePhotos.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    if (!form.photos.includes(url)) {
                      setForm((prev) => ({ ...prev, photos: [...prev.photos, url] }))
                    }
                  }}
                  className="w-7 h-7 rounded-lg overflow-hidden border border-ink/15 hover:border-forest transition opacity-70 hover:opacity-100"
                  title="Click to add sample photo to album"
                >
                  <img src={url} alt={`sample ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Title & Trip Type */}
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Memory Title" error={errors.title}>
              <input
                type="text"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="e.g. Sunset over the cliffs"
                className={inputCls}
              />
            </Field>

            <Field label="Trip Type / Companions">
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {[
                  { key: 'Solo', label: 'Solo', emoji: '🧍' },
                  { key: 'Friends', label: 'Friends', emoji: '👥' },
                  { key: 'Family', label: 'Family', emoji: '👨‍👩‍👧' },
                  { key: 'Official', label: 'Official', emoji: '💼' },
                  { key: 'Other', label: 'Other', emoji: '✨' },
                ].map((item) => {
                  const isSelected = form.companionType === item.key
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => set('companionType', item.key)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                        isSelected
                          ? 'bg-forest text-cream border-forest shadow-sm'
                          : 'bg-paper border-ink/15 text-ink/75 hover:border-forest/50 hover:bg-forest/5'
                      }`}
                    >
                      <span>{item.emoji}</span>
                      <span>{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </Field>
          </div>

          {/* Location & Date */}
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Location" error={errors.location}>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => set('location', e.target.value)}
                  placeholder="e.g. Ella, Sri Lanka"
                  className={`${inputCls} pl-9`}
                />
              </div>
            </Field>

            <Field label="Date" error={errors.date}>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => set('date', e.target.value)}
                  className={`${inputCls} pl-9`}
                />
              </div>
            </Field>
          </div>

          {/* Caption / Story */}
          <Field label="Travel Note / Caption">
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
              placeholder="What made this moment and journey unforgettable?"
              className={inputCls}
            />
          </Field>

          {/* Mood & Rating */}
          <div className="grid sm:grid-cols-2 gap-6 pt-2">
            <Field label="How did it feel? (Mood)">
              <MoodSelector value={form.mood} onChange={(v) => set('mood', v)} />
            </Field>

            <Field label="Experience Rating">
              <div className="pt-2">
                <Rating value={form.rating} onChange={(v) => set('rating', v)} size={26} />
              </div>
            </Field>
          </div>

          {/* Favourite checkbox */}
          <div className="pt-2">
            <label className="inline-flex items-center gap-2 text-sm font-medium text-ink/80 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.favourite}
                onChange={(e) => set('favourite', e.target.checked)}
                className="w-4 h-4 rounded text-forest focus:ring-forest"
              />
              <span className="flex items-center gap-1">
                <Heart size={14} className={form.favourite ? 'fill-clay text-clay' : 'text-ink/40'} />
                Mark as Favourite Memory
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-forest text-cream font-semibold py-3.5 rounded-full shadow-sm hover:brightness-110 active:scale-[0.99] transition flex items-center justify-center gap-2 mt-4"
          >
            <Sparkles size={18} /> Save Memory Album ({form.photos.length} Photos)
          </button>
        </form>
      </div>
    </div>
  )
}

const inputCls =
  'w-full border border-ink/15 rounded-xl px-3.5 py-2.5 bg-cream/50 focus:bg-paper focus:outline-none focus:ring-2 focus:ring-forest text-sm transition'

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-ink/80 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1 font-medium">{error}</p>}
    </div>
  )
}
