import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, MapPin, Calendar, Heart } from 'lucide-react'
import { useTravel } from '../context/TravelContext'
import { travelTypes } from '../data/mockData'

const sampleCovers = [
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80',
  'https://images.unsplash.com/photo-1586183189334-25997a53f818?w=1200&q=80',
  'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=80',
  'https://images.unsplash.com/photo-1563299796-17596ed6b017?w=1200&q=80',
]

export default function CreateTrip() {
  const { addTrip } = useTravel()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    cover: sampleCovers[0],
    description: '',
    type: travelTypes[0],
    favourite: false,
  })
  const [errors, setErrors] = useState({})

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Trip name is required.'
    if (!form.destination.trim()) e.destination = 'Destination is required.'
    if (!form.startDate) e.startDate = 'Start date is required.'
    if (!form.endDate) e.endDate = 'End date is required.'
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      e.endDate = 'End date cannot be before start date.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const trip = addTrip({
      ...form,
      cover: form.cover || sampleCovers[0],
      lat: 6.9271,
      lng: 79.8612,
    })
    navigate(`/trips/${trip.id}`)
  }

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-8 py-10 pb-24">
      <Link
        to="/trips"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink/60 hover:text-forest bg-paper border border-ink/10 px-3.5 py-1.5 rounded-full mb-6 transition"
      >
        <ArrowLeft size={14} /> Back to Trips
      </Link>

      <div className="bg-paper border border-ink/10 rounded-3xl p-6 sm:p-10 shadow-stamp">
        <div className="pb-6 border-b border-ink/10">
          <h1 className="font-display text-3xl font-bold text-ink">Plan a New Trip</h1>
          <p className="text-ink/60 text-sm mt-1">
            Group your photos and memories under a dedicated journey.
          </p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-6">
          {/* Cover Photo Preview */}
          <div>
            <label className="block text-xs font-semibold text-ink/80 uppercase tracking-wider mb-1.5">
              Trip Cover Photo
            </label>
            <div className="relative aspect-[16/9] max-h-56 rounded-2xl overflow-hidden border border-ink/15 bg-ink/5 mb-3">
              <img
                src={form.cover || sampleCovers[0]}
                alt="Cover preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = sampleCovers[0]
                }}
              />
            </div>
            <input
              type="url"
              value={form.cover}
              onChange={(e) => set('cover', e.target.value)}
              className={inputCls}
              placeholder="Paste image URL (https://...)"
            />
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-ink/50 font-medium">Or pick sample:</span>
              <div className="flex gap-2">
                {sampleCovers.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => set('cover', url)}
                    className={`w-8 h-8 rounded-lg overflow-hidden border-2 transition ${
                      form.cover === url ? 'border-forest ring-2 ring-forest/20' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`cover ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Name & Destination */}
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Trip Name" error={errors.name}>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="e.g. Ella Adventure"
                className={inputCls}
              />
            </Field>

            <Field label="Destination" error={errors.destination}>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
                <input
                  type="text"
                  value={form.destination}
                  onChange={(e) => set('destination', e.target.value)}
                  placeholder="e.g. Ella, Sri Lanka"
                  className={`${inputCls} pl-9`}
                />
              </div>
            </Field>
          </div>

          {/* Dates */}
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Start Date" error={errors.startDate}>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => set('startDate', e.target.value)}
                  className={`${inputCls} pl-9`}
                />
              </div>
            </Field>

            <Field label="End Date" error={errors.endDate}>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => set('endDate', e.target.value)}
                  className={`${inputCls} pl-9`}
                />
              </div>
            </Field>
          </div>

          {/* Description */}
          <Field label="Short Description">
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
              placeholder="What made this journey special?"
              className={inputCls}
            />
          </Field>

          {/* Travel Type */}
          <Field label="Travel Category">
            <select
              value={form.type}
              onChange={(e) => set('type', e.target.value)}
              className={inputCls}
            >
              {travelTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>

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
                Mark as Favourite Trip
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-forest text-cream font-semibold py-3.5 rounded-full shadow-sm hover:brightness-110 active:scale-[0.99] transition flex items-center justify-center gap-2 mt-4"
          >
            <Sparkles size={18} /> Create Trip
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

