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
import PlacesVisited from './pages/PlacesVisited'
import Memories from './pages/Memories'
import Favourites from './pages/Favourites'
import { useTravel } from './context/TravelContext'

export default function App() {
  const { user } = useTravel()
  return (
    <div className="min-h-screen flex flex-col bg-cream text-ink antialiased">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Home Landing Route */}
          <Route path="/" element={<Home />} />
          
          {/* Core Feature Routes */}
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
            path="/places-visited"
            element={
              <ProtectedRoute>
                <PlacesVisited />
              </ProtectedRoute>
            }
          />
          <Route
            path="/memories"
            element={
              <ProtectedRoute>
                <Memories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favourites"
            element={
              <ProtectedRoute>
                <Favourites />
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

          {/* Legacy / Alias route redirects */}
          <Route path="/journey" element={<Navigate to="/places-visited" replace />} />
          <Route path="/dashboard" element={<Navigate to="/profile" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {user && <Footer />}
    </div>
  )
}


