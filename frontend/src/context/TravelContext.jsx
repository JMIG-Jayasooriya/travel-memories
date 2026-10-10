import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  initialTrips, initialMemories, initialStories, initialExpenses, initialWishlistPlaces,
} from '../data/mockData'
import { authApi, getToken, setToken, clearToken } from '../api/auth'

const TravelContext = createContext(null)

let idCounter = 1000
const nextId = (prefix) => `${prefix}${idCounter++}`

const USER_STORAGE_KEY = 'travel_user'

const REGISTERED_USERS_KEY = 'travel_registered_users'

const getStoredRegisteredUsers = () => {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const saveStoredRegisteredUsers = (users) => {
  try {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users))
  } catch (err) {
    console.error('Failed to save registered users', err)
  }
}

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
  const [wishlistPlaces, setWishlistPlaces] = useState(() => {
    try {
      const saved = localStorage.getItem('travel_wishlist_places')
      return saved ? JSON.parse(saved) : initialWishlistPlaces
    } catch {
      return initialWishlistPlaces
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('travel_wishlist_places', JSON.stringify(wishlistPlaces))
    } catch (e) {
      console.error('Failed to save wishlist places', e)
    }
  }, [wishlistPlaces])

  // Verify and hydrate session on initial load
  useEffect(() => {
    const hydrateSession = async () => {
      const token = getToken()
      const savedUser = localStorage.getItem(USER_STORAGE_KEY) || sessionStorage.getItem(USER_STORAGE_KEY)

      if (!token && !savedUser) {
        setAuthLoading(false)
        return
      }

      if (token && token.startsWith('mock-jwt-')) {
        // Local/mock token hydrated directly
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser))
          } catch {}
        }
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
        // If backend session failed but we have a saved user, check token type
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser))
          } catch {
            setUser(null)
          }
        } else {
          clearToken()
          localStorage.removeItem(USER_STORAGE_KEY)
          sessionStorage.removeItem(USER_STORAGE_KEY)
          setUser(null)
        }
      } finally {
        setAuthLoading(false)
      }
    }

    hydrateSession()
  }, [])

  // Login handler supporting email OR username
  const login = async (identifier, password, remember = false) => {
    const cleanId = (identifier || '').trim().toLowerCase()
    
    // First attempt real backend API if it looks like an email or backend is online
    let backendFailed = false
    let explicitBackendError = null

    try {
      const data = await authApi.login({ email: cleanId, password })
      setToken(data.token, remember)
      const currentUser = {
        id: data.userId,
        name: data.name || cleanId.split('@')[0],
        email: data.email || cleanId,
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
    } catch (err) {
      if (err.status === 401 || err.status === 400 || (err.data && err.data.message)) {
        explicitBackendError = err.message
      }
      backendFailed = true
    }

    // Offline / Local fallback: Check against local registered users and demo accounts
    const registeredUsers = getStoredRegisteredUsers()
    const matchedUser = registeredUsers.find(
      (u) =>
        (u.email?.toLowerCase() === cleanId || u.name?.toLowerCase() === cleanId || u.username?.toLowerCase() === cleanId) &&
        u.password === password
    )

    // Check demo credentials
    const isDemoAccount =
      (cleanId === 'demo@travelmemories.com' || cleanId === 'demo' || cleanId === 'traveler' || cleanId === 'admin') &&
      (password === 'password123' || password === 'demo' || password === 'admin')

    if (matchedUser) {
      const mockToken = `mock-jwt-${Date.now()}`
      setToken(mockToken, remember)
      const currentUser = {
        id: matchedUser.id || 'u_' + Date.now(),
        name: matchedUser.name || cleanId,
        email: matchedUser.email || `${cleanId}@travelmemories.local`,
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

    if (isDemoAccount) {
      const mockToken = `mock-jwt-demo-${Date.now()}`
      setToken(mockToken, remember)
      const currentUser = {
        id: 'demo-user-1',
        name: 'Alex Rivera',
        email: 'demo@travelmemories.com',
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

    if (explicitBackendError) {
      throw new Error(explicitBackendError)
    }

    throw new Error('Invalid username/email or password.')
  }

  // Register handler
  const register = async (name, email, password, remember = true) => {
    const cleanName = (name || '').trim()
    const cleanEmail = (email || '').trim().toLowerCase()

    // 1. Try backend API
    try {
      const data = await authApi.register({ name: cleanName, email: cleanEmail, password })
      setToken(data.token, remember)
      const currentUser = {
        id: data.userId,
        name: data.name || cleanName,
        email: data.email || cleanEmail,
      }
      setUser(currentUser)
      
      // Also cache in local registered users for offline resilience
      const registered = getStoredRegisteredUsers()
      if (!registered.some(u => u.email === cleanEmail)) {
        registered.push({ id: data.userId, name: cleanName, username: cleanName, email: cleanEmail, password })
        saveStoredRegisteredUsers(registered)
      }

      if (remember) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser))
        sessionStorage.removeItem(USER_STORAGE_KEY)
      } else {
        sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser))
        localStorage.removeItem(USER_STORAGE_KEY)
      }
      return currentUser
    } catch (err) {
      // If backend returned explicit conflict error
      if (err.status === 400 && err.message?.includes('already exists')) {
        throw new Error(err.message)
      }

      // Check if user already exists locally
      const registered = getStoredRegisteredUsers()
      if (registered.some((u) => u.email === cleanEmail || u.name?.toLowerCase() === cleanName.toLowerCase())) {
        throw new Error('An account with this username or email already exists.')
      }

      // Offline / Local registration fallback
      const newUser = {
        id: 'user_' + Date.now(),
        name: cleanName,
        username: cleanName,
        email: cleanEmail,
        password: password,
      }
      registered.push(newUser)
      saveStoredRegisteredUsers(registered)

      const mockToken = `mock-jwt-${Date.now()}`
      setToken(mockToken, remember)
      const currentUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
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
  }

  // Logout handler
  const logout = () => {
    clearToken()
    localStorage.removeItem(USER_STORAGE_KEY)
    sessionStorage.removeItem(USER_STORAGE_KEY)
    setUser(null)
  }

  // Update user profile (e.g. avatar, name, bio)
  const updateUser = (updates) => {
    setUser((prev) => {
      if (!prev) return null
      const updated = { ...prev, ...updates }
      try {
        if (localStorage.getItem(USER_STORAGE_KEY)) {
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated))
        } else {
          sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated))
        }
        const registered = getStoredRegisteredUsers()
        const index = registered.findIndex((u) => u.id === updated.id || u.email === updated.email)
        if (index !== -1) {
          registered[index] = { ...registered[index], ...updates }
          saveStoredRegisteredUsers(registered)
        }
      } catch (e) {
        console.error('Failed to sync updated user', e)
      }
      return updated
    })
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

  const addWishlistPlace = (place) => {
    const withId = {
      ...place,
      id: nextId('w'),
      estimatedBudget: Number(place.estimatedBudget) || 15000,
      defaultStudents: Number(place.defaultStudents) || 4,
      studentBudgetPerPerson: Math.round((Number(place.estimatedBudget) || 15000) / (Number(place.defaultStudents) || 4)),
      studentTips: place.studentTips || ['Pack light and carry student ID for discounts!'],
      studentPerk: place.studentPerk || '🎓 Student discounts available at local attractions',
      transitMode: place.transitMode || '🚆 Public Train / Express Bus',
    }
    setWishlistPlaces((prev) => [withId, ...prev])
    return withId
  }

  const convertWishlistToTrip = (wishlistId) => {
    const item = wishlistPlaces.find((w) => w.id === wishlistId)
    if (!item) return null
    const newTrip = addTrip({
      name: item.name,
      destination: item.destination,
      cover: item.cover,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      description: item.description,
      type: item.type || 'Batch Trip',
      budget: item.estimatedBudget || 18000,
      lat: item.lat || 6.9271,
      lng: item.lng || 79.8612,
      defaultStudents: item.defaultStudents || 4,
      studentBudgetPerPerson: item.studentBudgetPerPerson || 4500,
      transitMode: item.transitMode,
      studentPerk: item.studentPerk,
      studentTips: item.studentTips,
      studentCategory: item.type || 'Batch Trip',
    })
    setWishlistPlaces((prev) => prev.filter((w) => w.id !== wishlistId))
    return newTrip
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
    user, setUser, updateUser,
    authLoading,
    login, register, logout,
    isAuthenticated: !!user,
    trips, addTrip,
    memories, addMemory,
    stories, addStory,
    expenses, addExpense,
    wishlistPlaces, addWishlistPlace, convertWishlistToTrip, setWishlistPlaces,
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
