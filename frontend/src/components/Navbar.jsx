import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Compass, Menu, X, Plus, MapPin, Camera, BookOpen, Heart, User, Home } from 'lucide-react'
import { useTravel } from '../context/TravelContext'

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/journey', label: 'My Journey', icon: MapPin },
  { to: '/trips', label: 'My Trips', icon: Compass },
  { to: '/memories', label: 'Memories', icon: Camera },
  { to: '/stories', label: 'Stories', icon: BookOpen },
  { to: '/favourites', label: 'Favourites', icon: Heart },
  { to: '/profile', label: 'Profile', icon: User },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { user } = useTravel()

  return (
    <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur border-b border-ink/10">
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 shrink-0">
          <span className="font-display text-xl font-semibold text-forest tracking-tight">
            Travel Memories
          </span>
        </NavLink>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive ? 'bg-forest text-cream' : 'text-ink/70 hover:text-forest hover:bg-forest/5'
                }`
              }
            >
              <Icon size={15} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => navigate('/add-memory')}
            className="flex items-center gap-1.5 bg-clay text-cream px-4 py-2 rounded-full text-sm font-semibold shadow-stamp hover:brightness-105 active:scale-95 transition"
          >
            <Plus size={16} /> Add Memory
          </button>
          {!user && (
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-forest hover:underline underline-offset-4"
            >
              Log in
            </button>
          )}
        </div>

        <button className="lg:hidden p-2 text-forest" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-ink/10 bg-paper px-5 py-3 flex flex-col gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-forest text-cream' : 'text-ink/80'
                }`
              }
            >
              <Icon size={16} /> {label}
            </NavLink>
          ))}
          <button
            onClick={() => { setOpen(false); navigate('/add-memory') }}
            className="flex items-center justify-center gap-1.5 bg-clay text-cream px-4 py-2.5 rounded-full text-sm font-semibold mt-2"
          >
            <Plus size={16} /> Add Memory
          </button>
        </div>
      )}
    </header>
  )
}
