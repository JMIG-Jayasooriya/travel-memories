import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, MapPin, Plus } from 'lucide-react'
import { useTravel } from '../context/TravelContext'
import Rating from '../components/Rating'
import MemoryCard from '../components/MemoryCard'
import { expenseCategories } from '../data/mockData'

export default function TripDetail() {
  const { id } = useParams()
  const { trips, memories, toggleFavourite, expenses, addExpense } = useTravel()
  const trip = trips.find((t) => t.id === id)
  const tripMemories = memories.filter((m) => m.tripId === id)
  const tripExpenses = expenses[id] || []
  const total = tripExpenses.reduce((s, e) => s + Number(e.amount), 0)

  const [form, setForm] = useState({ category: expenseCategories[0], amount: '' })
  const [error, setError] = useState('')

  if (!trip) {
    return <div className="max-w-2xl mx-auto px-5 py-20 text-center text-ink/50">Trip not found. <Link to="/trips" className="text-forest">Back to trips</Link></div>
  }

  const submitExpense = (e) => {
    e.preventDefault()
    if (!form.amount || Number(form.amount) <= 0) { setError('Enter a positive amount.'); return }
    addExpense(id, { category: form.category, amount: Number(form.amount) })
    setForm({ category: expenseCategories[0], amount: '' })
    setError('')
  }

  return (
    <div>
      <div className="relative h-[50vh] min-h-[340px]">
        <img src={trip.cover} alt={trip.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-5 md:px-8 pb-8 flex items-end justify-between">
          <div>
            <h1 className="font-display text-4xl font-semibold text-cream">{trip.name}</h1>
            <p className="flex items-center gap-1 text-cream/80 text-sm mt-1"><MapPin size={13} /> {trip.destination}</p>
          </div>
          <button onClick={() => toggleFavourite('trip', trip.id)} className="w-10 h-10 rounded-full bg-cream/90 flex items-center justify-center">
            <Heart size={18} className={trip.favourite ? 'fill-clay text-clay' : 'text-ink/60'} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-10">
          <div>
            <Rating value={trip.rating} />
            <p className="text-ink/70 mt-3 leading-relaxed">{trip.description}</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-semibold">Memories from this trip</h2>
              <Link to="/add-memory" className="flex items-center gap-1 text-sm text-forest hover:underline"><Plus size={14} /> Add memory</Link>
            </div>
            {tripMemories.length ? (
              <div className="columns-1 sm:columns-2 gap-5">
                {tripMemories.map((m) => <MemoryCard key={m.id} memory={m} />)}
              </div>
            ) : <p className="text-ink/50 text-sm">No memories added for this trip yet.</p>}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-paper border border-ink/10 rounded-3xl p-6">
            <h3 className="font-display text-lg font-semibold mb-3">Expenses</h3>
            <div className="space-y-2 text-sm">
              {tripExpenses.map((e) => (
                <div key={e.id} className="flex justify-between text-ink/70">
                  <span>{e.category}</span>
                  <span>LKR {Number(e.amount).toLocaleString()}</span>
                </div>
              ))}
              {tripExpenses.length === 0 && <p className="text-ink/40">No expenses logged.</p>}
            </div>
            <div className="flex justify-between font-semibold border-t border-ink/10 mt-3 pt-3">
              <span>Total</span><span className="text-clay">LKR {total.toLocaleString()}</span>
            </div>

            <form onSubmit={submitExpense} className="mt-5 space-y-2">
              {error && <p className="text-xs text-red-600">{error}</p>}
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-ink/15 rounded-lg px-2.5 py-2 text-sm bg-cream">
                {expenseCategories.map((c) => <option key={c}>{c}</option>)}
              </select>
              <input type="number" min="0" placeholder="Amount (LKR)" value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full border border-ink/15 rounded-lg px-2.5 py-2 text-sm bg-cream" />
              <button type="submit" className="w-full bg-forest text-cream rounded-lg py-2 text-sm font-semibold">Add Expense</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
