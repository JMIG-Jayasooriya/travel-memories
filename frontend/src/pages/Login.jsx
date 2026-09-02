import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'

export default function Login() {
  const { login } = useTravel()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: false,
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname || '/dashboard'

  const submit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.email.trim() || !form.password) {
      setError('Email and password are required.')
      return
    }

    try {
      setLoading(true)
      await login(form.email.trim(), form.password, form.remember)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-5 py-20">
      <h1 className="font-display text-3xl font-semibold text-center">
        Welcome back
      </h1>

      <p className="text-center text-ink/50 text-sm mt-1">
        Log in to keep your journal going.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
            {error}
          </p>
        )}

        <div>
          <label className="text-sm font-medium text-ink">
            Email
          </label>

          <input
            type="email"
            required
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="mt-1 w-full border border-ink/15 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest bg-paper"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink">
            Password
          </label>

          <input
            type="password"
            required
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="mt-1 w-full border border-ink/15 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest bg-paper"
            placeholder="Enter your password"
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-ink/70 cursor-pointer">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={(e) =>
                setForm({ ...form, remember: e.target.checked })
              }
              className="accent-forest rounded"
            />
            Remember me
          </label>

          <span className="text-forest/70 text-xs hover:text-forest cursor-pointer">
            Forgot password?
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-forest text-cream rounded-full py-3 font-semibold hover:brightness-110 active:scale-[0.99] transition disabled:opacity-50 mt-2"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <p className="text-center text-sm text-ink/60 mt-6">
        New here?{' '}
        <Link
          to="/register"
          className="text-forest font-medium hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  )
}


