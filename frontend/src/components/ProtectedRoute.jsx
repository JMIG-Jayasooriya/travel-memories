import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'
import { Compass } from 'lucide-react'

export default function ProtectedRoute({ children }) {
  const { user, authLoading } = useTravel()
  const location = useLocation()

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-forest">
        <Compass className="animate-spin mb-3 text-clay" size={36} />
        <p className="font-display text-lg font-medium text-ink">Opening your journal...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
