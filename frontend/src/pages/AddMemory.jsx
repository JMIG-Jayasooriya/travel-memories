import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'
import MoodSelector from '../components/MoodSelector'
import Rating from '../components/Rating'

const defaultPhoto = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&q=80'

export default function AddMemory() {
  const { trips, addMemory } = useTravel()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', location: '', date: '', description: '', mood: 'Happy', rating: 0,
    photo: '', tripId: trips[0]?.id || '', favourite: false,
  })
  const [errors, setErrors] = useState({})

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Memory title is required.'
    if (!form.location.trim()) e.location = 'Location is required.'
    if (!form.date) e.date = 'Date is required.'
    if (form.rating < 0 || form.rating > 5) e.rating = 'Rating must be between 1 and 5.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = (e) => {
    e.preventDefault()
    if (!validate()) return
    addMemory({
      title: form.title, location: form.location, date: form.date,
      caption: form.description, mood: form.mood, rating: form.rating,
      photo: form.photo || defaultPhoto, tripId: form.tripId, favourite: form.favourite,
    })
    navigate('/memories')
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <h1 className="font-display text-3xl font-semibold">Add a Memory</h1>
      <p className="text-ink/50 text-sm mt-1">Write it down before the details fade.</p>

      <form onSubmit={submit} className="mt-8 space-y-5">
        <Field label="Memory Title" error={errors.title}>
          <input value={form.title} onChange={(e) => set('title', e.target.value)} className={inputCls} />
        </Field>
        <Field label="Trip">
          <select value={form.tripId} onChange={(e) => set('tripId', e.target.value)} className={inputCls}>
            {trips.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Location" error={errors.location}>
            <input value={form.location} onChange={(e) => set('location', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Date" error={errors.date}>
            <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} className={inputCls} />
          </Field>
        </div>
        <Field label="Description">
          <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} className={inputCls} />
        </Field>
        <Field label="Photo URL">
          <input value={form.photo} onChange={(e) => set('photo', e.target.value)} className={inputCls} placeholder="https://..." />
        </Field>
        <Field label="Mood">
          <MoodSelector value={form.mood} onChange={(v) => set('mood', v)} />
        </Field>
        <Field label="Rating" error={errors.rating}>
          <Rating value={form.rating} onChange={(v) => set('rating', v)} size={22} />
        </Field>
        <label className="flex items-center gap-2 text-sm text-ink/70">
          <input type="checkbox" checked={form.favourite} onChange={(e) => set('favourite', e.target.checked)} />
          Mark as favourite
        </label>
        <button type="submit" className="w-full bg-forest text-cream rounded-full py-3 font-semibold hover:brightness-110 transition">
          Save Memory
        </button>
      </form>
    </div>
  )
}

const inputCls = 'mt-1 w-full border border-ink/15 rounded-xl px-3 py-2.5 bg-paper focus:outline-none focus:ring-2 focus:ring-forest'

function Field({ label, error, children }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  )
}
