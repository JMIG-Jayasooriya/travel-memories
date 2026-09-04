import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Image, Sparkles, Check, Heart, MapPin, Calendar } from 'lucide-react'
import { useTravel } from '../context/TravelContext'
import MoodSelector from '../components/MoodSelector'
import Rating from '../components/Rating'

const samplePhotos = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=900&q=80',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&q=80',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&q=80',
]

export default function AddMemory() {
  const { trips, addMemory } = useTravel()
  const navigate = useNavigate()

  const todayStr = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    title: '',
    location: '',
    date: todayStr,
    description: '',
    mood: 'Happy',
    rating: 5,
    photo: samplePhotos[0],
    tripId: trips[0]?.id || '',
    favourite: false,
  })
  const [errors, setErrors] = useState({})

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

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
    addMemory({
      title: form.title.trim(),
      location: form.location.trim(),
      date: form.date,
      caption: form.description.trim(),
      mood: form.mood,
      rating: form.rating,
      photo: form.photo.trim() || samplePhotos[0],
      tripId: form.tripId || (trips[0] ? trips[0].id : 'general'),
      favourite: form.favourite,
    })
    navigate('/')
  }

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-8 py-10 pb-24">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink/60 hover:text-forest bg-paper border border-ink/10 px-3.5 py-1.5 rounded-full mb-6 transition"
      >
        <ArrowLeft size={14} /> Back to Journal
      </Link>

      <div className="bg-paper border border-ink/10 rounded-3xl p-6 sm:p-10 shadow-stamp">
        <div className="pb-6 border-b border-ink/10">
          <h1 className="font-display text-3xl font-bold text-ink">Add a New Memory</h1>
          <p className="text-ink/60 text-sm mt-1">Capture a moment in your travel scrapbook.</p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-6">
          {/* Photo Preview & URL */}
          <div>
            <label className="block text-sm font-semibold text-ink mb-2">Memory Photo</label>
            <div className="relative aspect-[16/9] max-h-64 rounded-2xl overflow-hidden border border-ink/15 bg-ink/5 mb-3">
              <img
                src={form.photo || samplePhotos[0]}
                alt="Memory preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = samplePhotos[0]
                }}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="url"
                value={form.photo}
                onChange={(e) => set('photo', e.target.value)}
                className={inputCls}
                placeholder="Paste image URL (https://...)"
              />
            </div>

            {/* Quick Sample Selector */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-ink/50 font-medium">Or pick sample:</span>
              <div className="flex gap-2">
                {samplePhotos.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => set('photo', url)}
                    className={`w-8 h-8 rounded-lg overflow-hidden border-2 transition ${
                      form.photo === url ? 'border-forest ring-2 ring-forest/20' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`sample ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Title & Trip */}
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

            {trips.length > 0 && (
              <Field label="Associated Trip (Optional)">
                <select
                  value={form.tripId}
                  onChange={(e) => set('tripId', e.target.value)}
                  className={inputCls}
                >
                  <option value="">None (Independent memory)</option>
                  {trips.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.destination})
                    </option>
                  ))}
                </select>
              </Field>
            )}
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
              placeholder="What made this moment unforgettable?"
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
            <Sparkles size={18} /> Save to Journal
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

