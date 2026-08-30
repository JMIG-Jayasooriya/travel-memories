import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'
import { travelTypes } from '../data/mockData'

const defaultCover = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80'

export default function CreateTrip() {
  const { addTrip } = useTravel()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', destination: '', startDate: '', endDate: '', cover: '', description: '',
    type: travelTypes[0], budget: '', favourite: false,
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
    if (form.budget && Number(form.budget) < 0) e.budget = 'Budget must be a positive number.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const trip = addTrip({
      ...form,
      cover: form.cover || defaultCover,
      budget: Number(form.budget) || 0,
      lat: 6.9271, lng: 79.8612,
    })
    navigate(`/trips/${trip.id}`)
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <h1 className="font-display text-3xl font-semibold">Add a New Trip</h1>
      <p className="text-ink/50 text-sm mt-1">Start a new page in your travel journal.</p>

      <form onSubmit={submit} className="mt-8 space-y-5">
        <Field label="Trip Name" error={errors.name}>
          <input value={form.name} onChange={(e) => set('name', e.target.value)} className={inputCls} />
        </Field>
        <Field label="Destination" error={errors.destination}>
          <input value={form.destination} onChange={(e) => set('destination', e.target.value)} className={inputCls} placeholder="City, Country" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Start Date" error={errors.startDate}>
            <input type="date" value={form.startDate} onChange={(e) => set('startDate', e.target.value)} className={inputCls} />
          </Field>
          <Field label="End Date" error={errors.endDate}>
            <input type="date" value={form.endDate} onChange={(e) => set('endDate', e.target.value)} className={inputCls} />
          </Field>
        </div>
        <Field label="Cover Photo URL">
          <input value={form.cover} onChange={(e) => set('cover', e.target.value)} className={inputCls} placeholder="https://..." />
        </Field>
        <Field label="Description">
          <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} className={inputCls} />
        </Field>
        <Field label="Travel Type">
          <select value={form.type} onChange={(e) => set('type', e.target.value)} className={inputCls}>
            {travelTypes.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Budget (LKR)" error={errors.budget}>
          <input type="number" min="0" value={form.budget} onChange={(e) => set('budget', e.target.value)} className={inputCls} />
        </Field>
        <label className="flex items-center gap-2 text-sm text-ink/70">
          <input type="checkbox" checked={form.favourite} onChange={(e) => set('favourite', e.target.checked)} />
          Mark as favourite trip
        </label>
        <button type="submit" className="w-full bg-forest text-cream rounded-full py-3 font-semibold hover:brightness-110 transition">
          Save Trip
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
