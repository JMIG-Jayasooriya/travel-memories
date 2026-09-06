import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Trips from './pages/Trips'
import CreateTrip from './pages/CreateTrip'
import TripDetail from './pages/TripDetail'
import AddMemory from './pages/AddMemory'
import Profile from './pages/Profile'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-cream text-ink antialiased">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Core Simple Routes - Protected Gate */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trips"
            element={
              <ProtectedRoute>
                <Trips />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trips/:id"
            element={
              <ProtectedRoute>
                <TripDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-memory"
            element={
              <ProtectedRoute>
                <AddMemory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-trip"
            element={
              <ProtectedRoute>
                <CreateTrip />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Legacy route redirects to keep app simple and unified */}
          <Route path="/memories" element={<Navigate to="/" replace />} />
          <Route path="/stories" element={<Navigate to="/" replace />} />
          <Route path="/stories/:id" element={<Navigate to="/" replace />} />
          <Route path="/favourites" element={<Navigate to="/" replace />} />
          <Route path="/journey" element={<Navigate to="/trips" replace />} />
          <Route path="/dashboard" element={<Navigate to="/profile" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}


