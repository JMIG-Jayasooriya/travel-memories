import React, { createContext, useContext, useMemo, useState } from 'react'
import {
  initialTrips, initialMemories, initialStories, initialExpenses,
} from '../data/mockData'

// In a real deployment this context's setters would call the Spring Boot
// API (see /backend) via axios instead of mutating local state directly.
const TravelContext = createContext(null)

let idCounter = 1000
const nextId = (prefix) => `${prefix}${idCounter++}`

export function TravelProvider({ children }) {
  const [user, setUser] = useState(null) // null = logged out
  const [trips, setTrips] = useState(initialTrips)
  const [memories, setMemories] = useState(initialMemories)
  const [stories, setStories] = useState(initialStories)
  const [expenses, setExpenses] = useState(initialExpenses)

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
