import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'

export default function Register() {
  const { register } = useTravel()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.name.trim() || !form.email.trim() || !form.password) {
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

    try {
      setLoading(true)
      await register(form.name.trim(), form.email.trim(), form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-5 py-20">
      <h1 className="font-display text-3xl font-semibold text-center">Start your journal</h1>
      <p className="text-center text-ink/50 text-sm mt-1">Every journey deserves a place to live.</p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">{error}</p>}
        <div>
          <label className="text-sm font-medium text-ink">Name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your name"
            className="mt-1 w-full border border-ink/15 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest bg-paper"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            className="mt-1 w-full border border-ink/15 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest bg-paper"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink">Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="At least 8 characters"
            className="mt-1 w-full border border-ink/15 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest bg-paper"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink">Confirm Password</label>
          <input
            type="password"
            required
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            placeholder="Confirm your password"
            className="mt-1 w-full border border-ink/15 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest bg-paper"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-forest text-cream rounded-full py-3 font-semibold hover:brightness-110 active:scale-[0.99] transition disabled:opacity-50 mt-2"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      <p className="text-center text-sm text-ink/60 mt-6">
        Already journaling? <Link to="/login" className="text-forest font-medium hover:underline">Log in</Link>
      </p>
    </div>
  )
}
