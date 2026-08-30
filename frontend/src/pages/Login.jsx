import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'

export default function Login() {
  const { setUser } = useTravel()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Email and password are required.')
      return
    }
    // In production this posts to POST /api/auth/login and stores the JWT.
    setUser({ name: form.email.split('@')[0], email: form.email })
    navigate('/dashboard')
  }

  return (
    <div className="max-w-md mx-auto px-5 py-20">
      <h1 className="font-display text-3xl font-semibold text-center">Welcome back</h1>
      <p className="text-center text-ink/50 text-sm mt-1">Log in to keep your journal going.</p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
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
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-ink/70">
            <input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} />
            Remember me
          </label>
          <button type="button" className="text-forest hover:underline">Forgot password?</button>
        </div>
        <button type="submit" className="w-full bg-forest text-cream rounded-full py-3 font-semibold hover:brightness-110 transition">
          Log In
        </button>
      </form>
      <p className="text-center text-sm text-ink/60 mt-6">
        New here? <Link to="/register" className="text-forest font-medium hover:underline">Create an account</Link>
      </p>
    </div>
  )
}
