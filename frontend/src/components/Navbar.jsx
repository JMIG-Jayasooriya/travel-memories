import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Compass, Menu, X, Plus, Home, LogOut, User, Sparkles } from 'lucide-react'
import { useTravel } from '../context/TravelContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useTravel()

  const links = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/trips', label: 'Trips', icon: Compass },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur-md border-b border-ink/10 shadow-sm transition-all">
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-forest text-cream flex items-center justify-center font-display font-bold text-lg shadow-sm group-hover:scale-105 transition">
            ✦
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl font-bold text-forest tracking-tight leading-none">
              Travel Memories
            </span>
            <span className="text-[10px] uppercase tracking-wider text-ink/40 font-medium mt-0.5">
              Personal Travel Journal
            </span>
          </div>
        </NavLink>

        {/* Desktop Nav - Only when logged in */}
        {user ? (
          <nav className="hidden md:flex items-center gap-2">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-forest text-cream shadow-sm font-semibold'
                      : 'text-ink/75 hover:text-forest hover:bg-forest/5'
                  }`
                }
              >
                <Icon size={16} strokeWidth={2} />
                {label}
              </NavLink>
            ))}
          </nav>
        ) : (
          <div className="hidden md:flex items-center gap-2 text-xs font-medium text-ink/50 bg-forest/5 px-3 py-1 rounded-full">
            <span>🔒 Login required to view personal journals</span>
          </div>
        )}

        {/* Header Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <button
                onClick={() => navigate('/add-memory')}
                className="flex items-center gap-1.5 bg-clay text-cream px-4 py-2 rounded-full text-sm font-semibold shadow-stamp hover:brightness-105 active:scale-95 transition"
              >
                <Plus size={16} strokeWidth={2.5} /> Add Memory
              </button>
              <div className="flex items-center gap-2 pl-2 border-l border-ink/10">
                <NavLink
                  to="/profile"
                  className="flex items-center gap-2 text-xs font-medium text-ink hover:text-forest bg-forest/5 hover:bg-forest/10 px-3 py-1.5 rounded-full transition"
                  title="View Profile"
                >
                  <span className="w-6 h-6 rounded-full bg-forest text-cream text-xs font-semibold flex items-center justify-center">
                    {(user.name || user.email || 'U')[0].toUpperCase()}
                  </span>
                  <span className="max-w-[120px] truncate">{user.name || user.email.split('@')[0]}</span>
                </NavLink>
                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="p-2 text-ink/40 hover:text-red-600 rounded-full hover:bg-red-50 transition"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-semibold text-forest hover:underline underline-offset-4 px-3 py-1.5"
              >
                Log In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="text-sm font-semibold bg-forest text-cream hover:brightness-110 px-4 py-2 rounded-full transition shadow-sm"
              >
                Create Account
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          className="md:hidden p-2 text-forest rounded-lg hover:bg-forest/5"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {open && (
        <div className="md:hidden border-t border-ink/10 bg-paper px-5 py-4 flex flex-col gap-2 shadow-lg">
          {user ? (
            <>
              {links.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium ${
                      isActive ? 'bg-forest text-cream' : 'text-ink/80 hover:bg-forest/5'
                    }`
                  }
                >
                  <Icon size={18} /> {label}
                </NavLink>
              ))}
              <button
                onClick={() => { setOpen(false); navigate('/add-memory') }}
                className="flex items-center justify-center gap-1.5 bg-clay text-cream px-4 py-2.5 rounded-full text-sm font-semibold mt-2 shadow-sm"
              >
                <Plus size={16} strokeWidth={2.5} /> Add Memory
              </button>
              <div className="flex items-center justify-between pt-3 mt-1 border-t border-ink/10">
                <NavLink
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 text-sm font-medium text-ink"
                >
                  <span className="w-7 h-7 rounded-full bg-forest text-cream text-xs font-semibold flex items-center justify-center">
                    {(user.name || user.email || 'U')[0].toUpperCase()}
                  </span>
                  <span>{user.name || user.email}</span>
                </NavLink>
                <button
                  onClick={() => { setOpen(false); handleLogout() }}
                  className="text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full"
                >
                  Log out
                </button>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => { setOpen(false); navigate('/login') }}
                className="text-center py-2.5 text-sm font-semibold border border-ink/20 rounded-full text-forest bg-paper hover:bg-cream"
              >
                Log In
              </button>
              <button
                onClick={() => { setOpen(false); navigate('/register') }}
                className="text-center py-2.5 text-sm font-semibold bg-forest text-cream rounded-full hover:brightness-110"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}


