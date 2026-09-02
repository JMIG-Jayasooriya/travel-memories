import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  initialTrips, initialMemories, initialStories, initialExpenses,
} from '../data/mockData'
import { authApi, getToken, setToken, clearToken } from '../api/auth'

const TravelContext = createContext(null)

let idCounter = 1000
const nextId = (prefix) => `${prefix}${idCounter++}`

const USER_STORAGE_KEY = 'travel_user'

export function TravelProvider({ children }) {
  // Initialize user from cached storage if available
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY) || sessionStorage.getItem(USER_STORAGE_KEY)
      return savedUser ? JSON.parse(savedUser) : null
    } catch {
      return null
    }
  })
  const [authLoading, setAuthLoading] = useState(true)

  const [trips, setTrips] = useState(initialTrips)
  const [memories, setMemories] = useState(initialMemories)
  const [stories, setStories] = useState(initialStories)
  const [expenses, setExpenses] = useState(initialExpenses)

  // Verify and hydrate session on initial load
  useEffect(() => {
    const hydrateSession = async () => {
      const token = getToken()
      if (!token) {
        setAuthLoading(false)
        return
      }

      try {
        const userData = await authApi.getMe()
        const currentUser = {
          id: userData.userId,
          name: userData.name,
          email: userData.email,
        }
        setUser(currentUser)
        // Keep storage in sync
        if (localStorage.getItem('token')) {
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser))
        } else {
          sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser))
        }
      } catch (err) {
        console.warn('Session expired or invalid:', err.message)
        clearToken()
        localStorage.removeItem(USER_STORAGE_KEY)
        sessionStorage.removeItem(USER_STORAGE_KEY)
        setUser(null)
      } finally {
        setAuthLoading(false)
      }
    }

    hydrateSession()
  }, [])

  // Login handler
  const login = async (email, password, remember = false) => {
    const data = await authApi.login({ email, password })
    setToken(data.token, remember)
    const currentUser = {
      id: data.userId,
      name: data.name || email.split('@')[0],
      email: data.email || email,
    }
    setUser(currentUser)
    if (remember) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser))
      sessionStorage.removeItem(USER_STORAGE_KEY)
    } else {
      sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser))
      localStorage.removeItem(USER_STORAGE_KEY)
    }
    return currentUser
  }

  // Register handler
  const register = async (name, email, password, remember = true) => {
    const data = await authApi.register({ name, email, password })
    setToken(data.token, remember)
    const currentUser = {
      id: data.userId,
      name: data.name,
      email: data.email,
    }
    setUser(currentUser)
    if (remember) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser))
      sessionStorage.removeItem(USER_STORAGE_KEY)
    } else {
      sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser))
      localStorage.removeItem(USER_STORAGE_KEY)
    }
    return currentUser
  }

  // Logout handler
  const logout = () => {
    clearToken()
    localStorage.removeItem(USER_STORAGE_KEY)
    sessionStorage.removeItem(USER_STORAGE_KEY)
    setUser(null)
  }

  const addTrip = (trip) => {
    const withId = { ...trip, id: nextId('t'), favourite: !!trip.favourite, rating: 0 }
    setTrips((prev) => [withId, ...prev])
    return withId
  }

  const addMemory = (memory) => {
    const withId = { ...memory, id: nextId('m'), favourite: !!memory.favourite }
    setMemories((prev) => [withId, ...prev])
    return withId
  }

  const addStory = (story) => {
    const withId = { ...story, id: nextId('s'), favourite: !!story.favourite }
    setStories((prev) => [withId, ...prev])
    return withId
  }

  const addExpense = (tripId, expense) => {
    setExpenses((prev) => ({
      ...prev,
      [tripId]: [...(prev[tripId] || []), { ...expense, id: nextId('e') }],
    }))
  }

  const toggleFavourite = (kind, id) => {
    const setters = { trip: setTrips, memory: setMemories, story: setStories }
    setters[kind]?.((prev) => prev.map((item) => (
      item.id === id ? { ...item, favourite: !item.favourite } : item
    )))
  }

  const stats = useMemo(() => {
    const placesVisited = new Set(trips.map((t) => t.destination.split(',')[0].trim())).size
    const totalPhotos = memories.length
    const totalExpenses = Object.values(expenses).flat().reduce((sum, e) => sum + Number(e.amount || 0), 0)
    return {
      placesVisited,
      trips: trips.length,
      memories: memories.length,
      favourites: trips.filter((t) => t.favourite).length
        + memories.filter((m) => m.favourite).length
        + stories.filter((s) => s.favourite).length,
      totalPhotos,
      totalExpenses,
    }
  }, [trips, memories, stories, expenses])

  const travelPersonality = useMemo(() => {
    const counts = {}
    memories.forEach((m) => { counts[m.mood] = (counts[m.mood] || 0) + 1 })
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
    const personalities = {
      Adventurous: { label: 'Adventure Lover', emoji: '🌄', blurb: 'Most of your memories are related to adventure and nature.' },
      Peaceful: { label: 'Quiet Wanderer', emoji: '🌿', blurb: 'You gravitate toward calm, unhurried moments.' },
      Exciting: { label: 'Thrill Chaser', emoji: '🤩', blurb: 'Your best memories come from the unexpected.' },
      Relaxing: { label: 'Slow Traveller', emoji: '😌', blurb: 'You travel to unwind, not to rush.' },
      Romantic: { label: 'Hopeless Romantic', emoji: '❤️', blurb: 'Sunsets and quiet corners find their way into your trips.' },
      Happy: { label: 'Joy Seeker', emoji: '😊', blurb: 'Your journal is full of small, happy moments.' },
      Family: { label: 'Memory Keeper', emoji: '👨‍👩‍👧', blurb: 'Your trips are built around the people you share them with.' },
    }
    return top ? personalities[top[0]] : personalities.Adventurous
  }, [memories])

  const value = {
    user, setUser,
    authLoading,
    login, register, logout,
    isAuthenticated: !!user,
    trips, addTrip,
    memories, addMemory,
    stories, addStory,
    expenses, addExpense,
    toggleFavourite,
    stats, travelPersonality,
  }

  return <TravelContext.Provider value={value}>{children}</TravelContext.Provider>
}

export function useTravel() {
  const ctx = useContext(TravelContext)
  if (!ctx) throw new Error('useTravel must be used within a TravelProvider')
  return ctx
}
