import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, Compass, Calendar, Camera, Plus, Sparkles, Navigation } from 'lucide-react'
import { useTravel } from '../context/TravelContext'
import TravelStats from '../components/TravelStats'
import Rating from '../components/Rating'

// Fix Leaflet marker icons under bundlers
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

export default function PlacesVisited() {
  const { trips, memories, stats } = useTravel()
  const [activeTripId, setActiveTripId] = useState(null)

  // Extract distinct places visited
  const visitedPlaces = trips.map((t) => ({
    id: t.id,
    name: t.destination,
    tripName: t.name,
    cover: t.cover,
    date: t.startDate,
    lat: t.lat || 6.9271,
    lng: t.lng || 79.8612,
    memoryCount: memories.filter((m) => m.tripId === t.id).length,
    rating: t.rating || 5,
    type: t.type,
  }))

  const activeTrip = trips.find((t) => t.id === activeTripId) || trips[0]

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-10 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ink/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest/10 text-forest text-xs font-semibold mb-2">
            <MapPin size={13} /> Wanderlust Atlas
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink">Places Visited</h1>
          <p className="text-ink/60 text-sm mt-1">
            You have explored <span className="font-semibold text-forest">{stats.placesVisited} unique destinations</span> across {trips.length} journeys.
          </p>
        </div>

        <Link
          to="/create-trip"
          className="inline-flex items-center justify-center gap-2 bg-clay text-cream px-5 py-2.5 rounded-full text-sm font-semibold shadow-stamp hover:brightness-110 active:scale-95 transition self-start sm:self-auto"
        >
          <Plus size={16} strokeWidth={2.5} /> Add New Place
        </Link>
      </div>

      {/* Interactive Map & Active Place Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Map Container */}
        <div className="lg:col-span-8 rounded-3xl overflow-hidden border border-ink/10 shadow-stamp bg-paper h-[440px] relative z-10">
          <MapContainer
            center={[trips[0]?.lat || 6.9, trips[0]?.lng || 80.7]}
            zoom={8}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {trips.map((t) => (
              <Marker
                key={t.id}
                position={[t.lat || 6.9, t.lng || 80.7]}
                icon={markerIcon}
                eventHandlers={{
                  click: () => setActiveTripId(t.id),
                }}
              >
                <Popup>
                  <div className="text-xs p-1">
                    <p className="font-bold text-forest text-sm">{t.name}</p>
                    <p className="text-ink/70 font-medium">{t.destination}</p>
                    <p className="text-clay font-semibold mt-1">
                      {memories.filter((m) => m.tripId === t.id).length} memories
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Selected Place Card / Spotlight */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-4">
          {activeTrip ? (
            <div className="bg-paper border border-ink/10 rounded-3xl overflow-hidden shadow-stamp flex flex-col h-full">
              <div className="relative aspect-[16/9] bg-ink/5">
                <img
                  src={activeTrip.cover}
                  alt={activeTrip.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-paper/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-semibold text-forest">
                  {activeTrip.type || 'Journey'}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-ink/50 mb-1">
                    <MapPin size={13} className="text-clay" />
                    <span className="font-medium text-ink/80">{activeTrip.destination}</span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-ink">
                    {activeTrip.name}
                  </h3>
                  <p className="text-xs text-ink/65 mt-2 line-clamp-3">
                    {activeTrip.description || 'A memorable destination in your travel journal.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-ink/10 flex items-center justify-between">
                  <span className="text-xs text-ink/50 flex items-center gap-1">
                    <Camera size={13} />
                    {memories.filter((m) => m.tripId === activeTrip.id).length} memories
                  </span>
                  <Link
                    to={`/trips/${activeTrip.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-forest hover:underline"
                  >
                    View Trip Details &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-paper border border-ink/10 rounded-3xl p-8 text-center flex flex-col items-center justify-center h-full">
              <Navigation className="text-forest/30 mb-2" size={32} />
              <p className="text-sm font-semibold text-ink">Select a pin on the map</p>
              <p className="text-xs text-ink/50 mt-1">Click any marker to view destination highlights.</p>
            </div>
          )}
        </div>
      </div>

      {/* Grid of Visited Locations */}
      <div className="mt-14">
        <h2 className="font-display text-2xl font-bold text-ink mb-6">All Visited Destinations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {visitedPlaces.map((place) => (
            <div
              key={place.id}
              onClick={() => setActiveTripId(place.id)}
              className={`bg-paper rounded-2xl overflow-hidden border transition cursor-pointer group shadow-sm hover:shadow-md ${
                activeTripId === place.id ? 'border-forest ring-2 ring-forest/20' : 'border-ink/10'
              }`}
            >
              <div className="relative aspect-[4/3] bg-ink/10 overflow-hidden">
                <img
                  src={place.cover}
                  alt={place.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2 left-2 bg-ink/75 backdrop-blur text-cream text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Camera size={10} /> {place.memoryCount}
                </span>
              </div>
              <div className="p-3.5">
                <h4 className="font-display font-semibold text-sm text-ink group-hover:text-forest transition truncate">
                  {place.name}
                </h4>
                <p className="text-[11px] text-ink/50 mt-0.5 truncate">
                  Trip: {place.tripName}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
