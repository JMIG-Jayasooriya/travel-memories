import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'
import {
  Compass,
  Lock,
  User,
  Mail,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  MapPin,
  Camera,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react'

export default function Register() {
  const { register, user } = useTravel()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    agree: true,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  const submit = async (e) => {
    e.preventDefault()
    setError('')

    const name = form.name.trim()
    const email = form.email.trim()

    if (!name || !email || !form.password || !form.confirm) {
      setError('Please fill in all required fields.')
      return
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (form.password !== form.confirm) {
      setError('Passwords do not match. Please verify.')
      return
    }

    if (!form.agree) {
      setError('Please agree to start your journal.')
      return
    }

    try {
      setLoading(true)
      await register(name, email, form.password, true)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Registration failed. Please try a different email or username.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl bg-paper rounded-3xl shadow-stamp border border-ink/10 overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all">
        
        {/* Left Visual Column (Aesthetic Journal Invitation) */}
        <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-8 bg-forest text-cream overflow-hidden">
          {/* Decorative background overlay */}
          <div
            className="absolute inset-0 opacity-25 mix-blend-overlay bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1000&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-dark via-forest/90 to-forest/80" />

          {/* Top Brand Stamp */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-cream/15 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-cream/20 text-xs font-semibold tracking-wide uppercase text-cream">
              <Sparkles size={14} className="text-clay" />
              <span>Begin Your Journey</span>
            </div>
            <h2 className="font-display text-3xl font-bold mt-6 leading-tight text-cream">
              Every trip tells a story worth remembering.
            </h2>
            <p className="text-cream/80 text-sm mt-3 leading-relaxed font-body">
              Create your free account today and start collecting every unforgettable vista, train ride, stamp, and sunset.
            </p>
          </div>

          {/* What You Get Highlights */}
          <div className="relative z-10 space-y-3.5 my-8">
            <div className="flex items-center gap-3 bg-cream/10 backdrop-blur-sm p-3 rounded-2xl border border-cream/10">
              <div className="w-9 h-9 rounded-xl bg-clay/30 text-cream flex items-center justify-center shrink-0">
                <CheckCircle2 size={18} />
              </div>
              <div className="text-xs">
                <div className="font-semibold text-cream">Unlimited Trip Journals</div>
                <div className="text-cream/70 text-[11px]">Keep every adventure organized</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-cream/10 backdrop-blur-sm p-3 rounded-2xl border border-cream/10">
              <div className="w-9 h-9 rounded-xl bg-harbor/30 text-cream flex items-center justify-center shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div className="text-xs">
                <div className="font-semibold text-cream">Private & Secure</div>
                <div className="text-cream/70 text-[11px]">Your memories stay protected</div>
              </div>
            </div>
          </div>

          {/* Bottom Stamp */}
          <div className="relative z-10 pt-4 border-t border-cream/15 flex items-center justify-between text-xs text-cream/70">
            <span className="font-hand text-lg text-cream tracking-wide">"Wander often, record always."</span>
            <span className="text-[11px] font-mono opacity-80">✦</span>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            {/* Header */}
            <div className="text-center sm:text-left mb-6">
              <div className="inline-flex lg:hidden items-center gap-2 bg-forest/10 px-3 py-1 rounded-full text-xs font-semibold text-forest mb-3">
                <Compass size={14} className="text-clay" /> Travel Memories
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
                Create Account
              </h1>
              <p className="text-ink/60 text-sm mt-1.5">
                Join our community of travelers and preserve your best memories.
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-6 flex items-start gap-3 p-3.5 bg-red-50/90 border border-red-200/80 rounded-2xl text-red-700 text-sm animate-fadeIn">
                <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
                <div className="flex-1 font-medium leading-snug">{error}</div>
              </div>
            )}

            {/* Register Form */}
            <form onSubmit={submit} className="space-y-4">
              {/* Name / Username */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75 mb-1.5">
                  Full Name or Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink/40">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-cream/40 hover:bg-cream/60 focus:bg-white border border-ink/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-forest transition"
                    placeholder="e.g. Kasun Silva or wanderer99"
                    autoComplete="name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink/40">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-cream/40 hover:bg-cream/60 focus:bg-white border border-ink/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-forest transition"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password & Confirm Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink/40">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full bg-cream/40 hover:bg-cream/60 focus:bg-white border border-ink/15 rounded-xl pl-9 pr-9 py-2.5 text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-forest transition"
                      placeholder="Min 6 chars"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-ink/40 hover:text-ink transition"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink/75 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink/40">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      required
                      value={form.confirm}
                      onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                      className="w-full bg-cream/40 hover:bg-cream/60 focus:bg-white border border-ink/15 rounded-xl pl-9 pr-9 py-2.5 text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-forest transition"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((prev) => !prev)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-ink/40 hover:text-ink transition"
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 text-ink/75 text-xs cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.agree}
                    onChange={(e) => setForm({ ...form, agree: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded text-forest focus:ring-forest accent-forest shrink-0"
                  />
                  <span>
                    I want to create my personal travel journal and save my wanderlust memories.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-forest hover:bg-forest-dark text-cream font-semibold py-3.5 px-6 rounded-2xl shadow-stamp hover:brightness-105 active:scale-[0.99] transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Compass size={18} className="animate-spin text-clay" />
                    <span>Creating your journal...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account & Start Journal</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Footer / Switch to Login */}
            <div className="mt-8 pt-6 border-t border-ink/10 text-center">
              <p className="text-sm text-ink/70">
                Already registered with an account?{' '}
                <Link
                  to="/login"
                  className="font-bold text-forest hover:text-forest-dark hover:underline underline-offset-4 ml-1"
                >
                  Log In instead
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
