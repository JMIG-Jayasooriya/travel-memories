import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Lock, Compass, Sparkles, ArrowRight, UserPlus, LogIn } from 'lucide-react'
import { useTravel } from '../context/TravelContext'

export default function AuthPromptModal({
  isOpen,
  onClose,
  title = 'Sign In to Continue',
  message = 'You need to be signed in to add memories, favourite moments, and organize your trips.',
  redirectPath = '/',
}) {
  const { login } = useTravel()
  const navigate = useNavigate()
  const [demoLoading, setDemoLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleDemoLogin = async () => {
    try {
      setDemoLoading(true)
      setError('')
      await login('demo@travelmemories.com', 'password123', true)
      onClose()
      if (redirectPath && redirectPath !== '/') {
        navigate(redirectPath)
      }
    } catch (err) {
      setError(err.message || 'Failed to sign in with demo account.')
    } finally {
      setDemoLoading(false)
    }
  }

  const handleNavigate = (path) => {
    onClose()
    navigate(path, { state: { from: { pathname: redirectPath } } })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-ink/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-paper w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-ink/10 p-6 sm:p-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-ink/5 hover:bg-ink/10 text-ink/70 flex items-center justify-center transition"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {/* Icon & Title */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-forest/10 text-forest flex items-center justify-center mx-auto mb-4">
            <Lock size={26} className="text-forest" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-clay/10 text-clay text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles size={12} /> Authentication Required
          </span>

          <h3 className="font-display text-2xl font-bold text-ink">
            {title}
          </h3>

          <p className="text-ink/70 text-sm mt-2 leading-relaxed">
            {message}
          </p>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium text-center">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 mt-6">
          {/* Quick Demo 1-Click */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={demoLoading}
            className="w-full flex items-center justify-between p-3.5 bg-gradient-to-r from-clay/15 via-forest/10 to-harbor/15 hover:from-clay/25 hover:to-harbor/25 border border-clay/30 rounded-2xl text-ink transition-all group active:scale-[0.99] shadow-sm text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-clay text-cream flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                ⚡
              </div>
              <div>
                <div className="text-xs font-bold text-forest flex items-center gap-1.5">
                  1-Click Instant Demo Login
                </div>
                <div className="text-[11px] text-ink/60">Continue as Alex Rivera</div>
              </div>
            </div>
            {demoLoading ? (
              <Compass size={16} className="animate-spin text-forest" />
            ) : (
              <ArrowRight size={16} className="text-forest group-hover:translate-x-1 transition" />
            )}
          </button>

          {/* Regular Login */}
          <button
            type="button"
            onClick={() => handleNavigate('/login')}
            className="w-full flex items-center justify-center gap-2 bg-forest hover:bg-forest-dark text-cream font-semibold py-3 px-4 rounded-2xl shadow-stamp hover:brightness-105 active:scale-[0.99] transition text-sm"
          >
            <LogIn size={16} />
            <span>Sign In with Account</span>
          </button>

          {/* Create New Account */}
          <button
            type="button"
            onClick={() => handleNavigate('/register')}
            className="w-full flex items-center justify-center gap-2 bg-paper hover:bg-cream border border-ink/20 text-forest font-semibold py-2.5 px-4 rounded-2xl hover:border-forest/40 active:scale-[0.99] transition text-sm"
          >
            <UserPlus size={16} />
            <span>Create Free Account</span>
          </button>
        </div>

        <div className="mt-5 pt-4 border-t border-ink/10 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-ink/50 hover:text-ink font-medium transition"
          >
            Cancel and continue browsing preview
          </button>
        </div>
      </div>
    </div>
  )
}
