import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'
import {
  Compass,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  MapPin,
  Camera,
  BookOpen,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

export default function Login() {
  const { login, user } = useTravel()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({
    identifier: '',
    password: '',
    remember: true,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)

  const from = location.state?.from?.pathname || '/'

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true })
    }
  }, [user, navigate, from])

  const submit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.identifier.trim()) {
      setError('Please enter your username or email.')
      return
    }
    if (!form.password) {
      setError('Please enter your password.')
      return
    }

    try {
      setLoading(true)
      await login(form.identifier.trim(), form.password, form.remember)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Invalid username/email or password.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setError('')
    try {
      setDemoLoading(true)
      await login('demo@travelmemories.com', 'password123', true)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Failed to login with demo account.')
    } finally {
      setDemoLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl bg-paper rounded-3xl shadow-stamp border border-ink/10 overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all">
        
        {/* Left Visual Column (Aesthetic Travel Journal Showcase) */}
        <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-8 bg-forest text-cream overflow-hidden">
          {/* Decorative background overlay */}
          <div
            className="absolute inset-0 opacity-25 mix-blend-overlay bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-dark via-forest/90 to-forest/80" />

          {/* Top Brand Stamp */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-cream/15 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-cream/20 text-xs font-semibold tracking-wide uppercase text-cream">
              <Compass size={14} className="text-clay animate-spin" style={{ animationDuration: '10s' }} />
              <span>Travel Memories Journal</span>
            </div>
            <h2 className="font-display text-3xl font-bold mt-6 leading-tight text-cream">
              Capture your wanderlust in ink & light.
            </h2>
            <p className="text-cream/80 text-sm mt-3 leading-relaxed font-body">
              A private digital sanctuary for all your trips, sunset polaroids, memorable milestones, and heartfelt stories.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="relative z-10 space-y-3.5 my-8">
            <div className="flex items-center gap-3 bg-cream/10 backdrop-blur-sm p-3 rounded-2xl border border-cream/10">
              <div className="w-9 h-9 rounded-xl bg-clay/30 text-cream flex items-center justify-center shrink-0">
                <MapPin size={18} />
              </div>
              <div className="text-xs">
                <div className="font-semibold text-cream">Interactive Trip Timelines</div>
                <div className="text-cream/70 text-[11px]">Pin locations and map your routes</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-cream/10 backdrop-blur-sm p-3 rounded-2xl border border-cream/10">
              <div className="w-9 h-9 rounded-xl bg-harbor/30 text-cream flex items-center justify-center shrink-0">
                <Camera size={18} />
              </div>
              <div className="text-xs">
                <div className="font-semibold text-cream">Polaroid Memory Gallery</div>
                <div className="text-cream/70 text-[11px]">Save photos with moods & ratings</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-cream/10 backdrop-blur-sm p-3 rounded-2xl border border-cream/10">
              <div className="w-9 h-9 rounded-xl bg-cream/20 text-cream flex items-center justify-center shrink-0">
                <BookOpen size={18} />
              </div>
              <div className="text-xs">
                <div className="font-semibold text-cream">Rich Travel Chronicles</div>
                <div className="text-cream/70 text-[11px]">Write personal travel essays</div>
              </div>
            </div>
          </div>

          {/* Bottom Quote */}
          <div className="relative z-10 pt-4 border-t border-cream/15 flex items-center justify-between text-xs text-cream/70">
            <span className="font-hand text-lg text-cream tracking-wide">"The journey is the destination."</span>
            <span className="text-[11px] font-mono opacity-80">v1.0</span>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            {/* Header */}
            <div className="text-center sm:text-left mb-8">
              <div className="inline-flex lg:hidden items-center gap-2 bg-forest/10 px-3 py-1 rounded-full text-xs font-semibold text-forest mb-3">
                <Compass size={14} className="text-clay" /> Travel Memories
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
                Welcome Back
              </h1>
              <p className="text-ink/60 text-sm mt-1.5">
                Sign in with your username or email to open your journal.
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-6 flex items-start gap-3 p-3.5 bg-red-50/90 border border-red-200/80 rounded-2xl text-red-700 text-sm animate-fadeIn">
                <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
                <div className="flex-1 font-medium leading-snug">{error}</div>
              </div>
            )}

            {/* Quick Demo 1-Click Login Button */}
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading || demoLoading}
              className="w-full mb-6 flex items-center justify-between px-4 py-3 bg-gradient-to-r from-clay/10 via-forest/5 to-harbor/10 hover:from-clay/20 hover:to-harbor/20 border border-clay/30 rounded-2xl text-ink transition-all group active:scale-[0.99] shadow-sm"
            >
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded-xl bg-clay text-cream flex items-center justify-center font-bold text-xs shadow-sm">
                  ⚡
                </div>
                <div>
                  <div className="text-xs font-bold text-forest flex items-center gap-1.5">
                    Quick Demo Preview <span className="bg-clay text-cream text-[10px] px-1.5 py-0.2 rounded-full uppercase">1-Click</span>
                  </div>
                  <div className="text-[11px] text-ink/60">Log in as Alex Rivera (demo@travelmemories.com)</div>
                </div>
              </div>
              <ArrowRight size={16} className="text-forest group-hover:translate-x-1 transition" />
            </button>

            <div className="relative flex items-center justify-center my-5">
              <div className="border-t border-ink/10 w-full" />
              <span className="bg-paper px-3 text-xs uppercase tracking-wider text-ink/40 font-medium">
                or sign in with credentials
              </span>
              <div className="border-t border-ink/10 w-full" />
            </div>

            {/* Login Form */}
            <form onSubmit={submit} className="space-y-4">
              {/* Username or Email */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75 mb-1.5">
                  Username or Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink/40">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    value={form.identifier}
                    onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                    className="w-full bg-cream/40 hover:bg-cream/60 focus:bg-white border border-ink/15 rounded-xl pl-10 pr-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-forest transition"
                    placeholder="Enter username or email address"
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink/40">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full bg-cream/40 hover:bg-cream/60 focus:bg-white border border-ink/15 rounded-xl pl-10 pr-11 py-3 text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-forest transition"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-ink/40 hover:text-ink transition"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between pt-1 text-sm">
                <label className="flex items-center gap-2 text-ink/70 text-xs font-medium cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.remember}
                    onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                    className="w-4 h-4 rounded text-forest focus:ring-forest accent-forest"
                  />
                  Keep me signed in
                </label>
                <span
                  onClick={() => setError('Use demo login or create a new registered account to proceed.')}
                  className="text-xs text-forest/80 hover:text-forest font-medium cursor-pointer hover:underline"
                >
                  Forgot password?
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || demoLoading}
                className="w-full mt-3 bg-forest hover:bg-forest-dark text-cream font-semibold py-3.5 px-6 rounded-2xl shadow-stamp hover:brightness-105 active:scale-[0.99] transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Compass size={18} className="animate-spin text-clay" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Journal</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Footer / Switch to Register */}
            <div className="mt-8 pt-6 border-t border-ink/10 text-center">
              <p className="text-sm text-ink/70">
                Don't have a travel journal account yet?{' '}
                <Link
                  to="/register"
                  className="font-bold text-forest hover:text-forest-dark hover:underline underline-offset-4 ml-1"
                >
                  Create one now
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
