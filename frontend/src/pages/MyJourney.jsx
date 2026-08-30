import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Link } from 'react-router-dom'
import { useTravel } from '../context/TravelContext'
import TravelStats from '../components/TravelStats'
import Rating from '../components/Rating'

// Default Leaflet marker icons reference image files that don't resolve
// under bundlers — point them at the CDN copies instead.
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

export default function MyJourney() {
  const { trips, memories, stats } = useTravel()
  const [active, setActive] = useState(null)

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-12">
      <h1 className="font-display text-3xl font-semibold">My Journey</h1>
      <p className="text-ink/50 text-sm mt-1">Every pin is a trip you actually took.</p>

      <div className="grid md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-2 rounded-3xl overflow-hidden border border-ink/10 h-[480px]">
          <MapContainer center={[6.9, 80.7]} zoom={8} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {trips.map((t) => (
              <Marker key={t.id} position={[t.lat, t.lng]} icon={markerIcon} eventHandlers={{ click: () => setActive(t.id) }}>
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-xs text-ink/60">{t.destination}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="space-y-4">
          {active ? (
            <ActiveTripCard trip={trips.find((t) => t.id === active)} memoryCount={memories.filter((m) => m.tripId === active).length} />
          ) : (
            <div className="bg-paper border border-ink/10 rounded-3xl p-6 text-sm text-ink/50">
              Click a marker to see trip details.
            </div>
          )}
          <TravelStats stats={stats} />
        </div>
      </div>
    </div>
  )
}

function ActiveTripCard({ trip, memoryCount }) {
  if (!trip) return null
  return (
    <div className="bg-paper border border-ink/10 rounded-3xl overflow-hidden">
      <img src={trip.cover} alt={trip.name} className="w-full h-32 object-cover" />
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold">{trip.name}</h3>
        <p className="text-xs text-ink/50 mt-1">{new Date(trip.startDate).toLocaleDateString()}</p>
        <p className="text-sm text-ink/60 mt-2">{trip.description}</p>
        <div className="flex items-center justify-between mt-3">
          <Rating value={trip.rating} />
          <span className="text-xs text-ink/50">{memoryCount} photos</span>
        </div>
        <Link to={`/trips/${trip.id}`} className="block text-center mt-4 bg-forest text-cream rounded-full py-2 text-sm font-semibold">
          View Memories
        </Link>
      </div>
    </div>
  )
}
