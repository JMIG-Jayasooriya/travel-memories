import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'

export default function Register() {
  const { setUser } = useTravel()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    // In production this posts to POST /api/auth/register.
    setUser({ name: form.name, email: form.email })
    navigate('/dashboard')
  }

  return (
    <div className="max-w-md mx-auto px-5 py-20">
      <h1 className="font-display text-3xl font-semibold text-center">Start your journal</h1>
      <p className="text-center text-ink/50 text-sm mt-1">Every journey deserves a place to live.</p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
        <div>
          <label className="text-sm font-medium">Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full border border-ink/15 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest" />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-1 w-full border border-ink/15 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest" />
        </div>
        <div>
          <label className="text-sm font-medium">Password</label>
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="mt-1 w-full border border-ink/15 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest" />
        </div>
        <div>
          <label className="text-sm font-medium">Confirm Password</label>
          <input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            className="mt-1 w-full border border-ink/15 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest" />
        </div>
        <button type="submit" className="w-full bg-forest text-cream rounded-full py-3 font-semibold hover:brightness-110 transition">
          Create Account
        </button>
      </form>
      <p className="text-center text-sm text-ink/60 mt-6">
        Already journaling? <Link to="/login" className="text-forest font-medium hover:underline">Log in</Link>
      </p>
    </div>
  )
}
