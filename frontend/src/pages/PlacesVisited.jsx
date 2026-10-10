import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  MapPin,
  Compass,
  Calendar,
  Camera,
  Plus,
  Sparkles,
  Navigation,
  GraduationCap,
  Wallet,
  Users,
  Train,
  Share2,
  Copy,
  Check,
  CheckCircle2,
  Search,
  Filter,
  X,
  ChevronRight,
  Bookmark,
  Tag,
  ArrowRight,
  Info,
  ZoomIn,
} from 'lucide-react'
import { useTravel } from '../context/TravelContext'
import Rating from '../components/Rating'
import MemoryModal from '../components/MemoryModal'

// Fix Leaflet marker icons with clean custom pins that work reliably offline
const createCustomPin = (isWishlist = false) =>
  L.divIcon({
    className: 'custom-map-pin',
    html: `<div style="
      background: ${isWishlist ? '#C86D51' : '#2D5A43'};
      color: #FFFDF9;
      width: 32px;
      height: 32px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(27, 43, 34, 0.35);
      border: 2.5px solid #FFFDF9;
    ">
      <span style="transform: rotate(45deg); font-size: 13px; line-height: 1;">${isWishlist ? '✨' : '📍'}</span>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })

const visitedPin = createCustomPin(false)
const wishlistPin = createCustomPin(true)
const FALLBACK_PHOTO = 'https://images.unsplash.com/photo-1546708973-b339540b5162?w=1200&q=80'

const sampleCoverOptions = [
  { label: 'Sigiriya Rock', url: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?w=1200&q=80' },
  { label: 'Nine Arch Bridge', url: 'https://images.unsplash.com/photo-1546708973-b339540b5162?w=1200&q=80' },
  { label: 'Galle Lighthouse', url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=80' },
  { label: 'Knuckles Camping', url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&q=80' },
  { label: 'Mirissa Beach', url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&q=80' },
]

export default function PlacesVisited() {
  const {
    trips,
    memories,
    stats,
    wishlistPlaces = [],
    addWishlistPlace,
    convertWishlistToTrip,
  } = useTravel()

  // Tab: 'visited' | 'wishlist' | 'guide'
  const [activeTab, setActiveTab] = useState('visited')
  const [activePlaceId, setActivePlaceId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all') // 'all' | 'budget' | 'train' | 'batch' | 'nature' | 'beach'
  const [studentSplitCount, setStudentSplitCount] = useState(4)
  const [copiedToast, setCopiedToast] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [previewPhotoMemory, setPreviewPhotoMemory] = useState(null)

  const handlePreviewPlacePhoto = (place) => {
    setPreviewPhotoMemory({
      id: place.id,
      title: place.tripName || place.name,
      location: place.name,
      caption: place.description,
      photos: [place.cover || FALLBACK_PHOTO],
      photo: place.cover || FALLBACK_PHOTO,
      initialIndex: 0,
      mood: 'Adventurous',
      companionType: 'Batchmates',
    })
  }

  // Student Packing checklist state
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'University Student ID Card (for ticket concessions)', checked: true },
    { id: 2, text: 'Train season pass / pre-booked 3rd class tickets', checked: true },
    { id: 3, text: '20,000mAh Power Bank & charging cables', checked: false },
    { id: 4, text: 'Lightweight rain poncho / windbreaker', checked: true },
    { id: 5, text: 'Reusable water bottle & energy snacks (glucose/biscuits)', checked: false },
    { id: 6, text: 'Emergency cash notes for rural tea stalls & local kottu', checked: true },
  ])

  // New Destination Form state
  const [newPlace, setNewPlace] = useState({
    name: '',
    destination: '',
    cover: sampleCoverOptions[0].url,
    estimatedBudget: 16000,
    defaultStudents: 4,
    type: 'Batch Trip',
    transitMode: '🚆 Scenic Train / Express Bus',
    studentPerk: '🎓 50% discount with University Student ID',
    description: '',
    targetList: 'wishlist', // 'wishlist' | 'visited'
  })

  // Format visited locations
  const visitedPlaces = useMemo(() => {
    return trips.map((t) => ({
      id: t.id,
      isWishlist: false,
      name: t.destination,
      tripName: t.name,
      cover: t.cover,
      date: t.startDate,
      lat: t.lat || 6.9271,
      lng: t.lng || 79.8612,
      memoryCount: memories.filter((m) => m.tripId === t.id).length,
      rating: t.rating || 5,
      type: t.type || 'Batch Trip',
      budget: t.budget || 20000,
      defaultStudents: t.defaultStudents || 4,
      studentBudgetPerPerson: t.studentBudgetPerPerson || Math.round((t.budget || 20000) / 4),
      transitMode: t.transitMode || '🚆 Scenic Upcountry Train / Express Bus',
      studentPerk: t.studentPerk || '🎓 Concessional student rates with University ID',
      studentTips: t.studentTips || [
        'Travel in a group of 4-6 to divide accommodation & transport costs.',
        'Carry your student ID to claim heritage site and botanical garden entry discounts.',
        'Opt for local family-run homestays or hostels with high student ratings.',
      ],
      description: t.description || 'A memorable destination in your undergrad travel journal.',
    }))
  }, [trips, memories])

  // Format wishlist places
  const formattedWishlist = useMemo(() => {
    return wishlistPlaces.map((w) => ({
      id: w.id,
      isWishlist: true,
      name: w.destination || w.name,
      tripName: w.name,
      cover: w.cover,
      date: w.bestSeason || 'Upcoming Break',
      lat: w.lat || 7.0,
      lng: w.lng || 80.5,
      memoryCount: 0,
      rating: 5,
      type: w.type || 'Semester Break',
      budget: w.estimatedBudget || 18000,
      defaultStudents: w.defaultStudents || 4,
      studentBudgetPerPerson: w.studentBudgetPerPerson || Math.round((w.estimatedBudget || 18000) / 4),
      transitMode: w.transitMode || '🚌 Public CTB Express Bus ➔ Tuk-tuk split',
      studentPerk: w.studentPerk || '🎓 Budget student group entry available',
      studentTips: w.studentTips || [
        'Book train or expressway bus tickets 2-3 weeks before semester break.',
        'Divide bulk food and tent gear among batchmates to pack light.',
      ],
      description: w.description || 'An unmissable destination on the undergrad bucket list.',
      bestSeason: w.bestSeason,
    }))
  }, [wishlistPlaces])

  // Current display items based on activeTab
  const currentItems = activeTab === 'visited' ? visitedPlaces : formattedWishlist

  // Filter & Search logic
  const filteredPlaces = useMemo(() => {
    return currentItems.filter((place) => {
      // Search query filter
      const matchesSearch =
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.tripName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (place.description && place.description.toLowerCase().includes(searchQuery.toLowerCase()))

      if (!matchesSearch) return false

      // Category filter
      if (filterCategory === 'all') return true
      if (filterCategory === 'budget') return place.studentBudgetPerPerson <= 4500
      if (filterCategory === 'train')
        return place.transitMode.toLowerCase().includes('train') || place.transitMode.toLowerCase().includes('rail')
      if (filterCategory === 'batch')
        return place.type.toLowerCase().includes('batch') || place.type.toLowerCase().includes('campus')
      if (filterCategory === 'nature')
        return (
          place.type.toLowerCase().includes('camp') ||
          place.type.toLowerCase().includes('trek') ||
          place.type.toLowerCase().includes('hike') ||
          place.type.toLowerCase().includes('adventure')
        )
      if (filterCategory === 'beach')
        return place.type.toLowerCase().includes('beach') || place.type.toLowerCase().includes('coast')

      return true
    })
  }, [currentItems, searchQuery, filterCategory])

  // Active Selected Place
  const activePlace = useMemo(() => {
    if (activePlaceId) {
      const found = [...visitedPlaces, ...formattedWishlist].find((p) => p.id === activePlaceId)
      if (found) return found
    }
    return filteredPlaces[0] || visitedPlaces[0] || formattedWishlist[0]
  }, [activePlaceId, filteredPlaces, visitedPlaces, formattedWishlist])

  // Calculate split costs dynamically
  const splitCostPerStudent = useMemo(() => {
    if (!activePlace) return 0
    const total = activePlace.budget || 20000
    return Math.round(total / Math.max(1, studentSplitCount))
  }, [activePlace, studentSplitCount])

  // Share to WhatsApp Handler
  const handleShareWhatsApp = (place) => {
    if (!place) return
    const perPerson = Math.round((place.budget || 20000) / studentSplitCount)
    const text =
      `🎓 *Undergrad Trip Itinerary: ${place.tripName}* (${place.name})\n\n` +
      `👥 *Traveling Group:* ${studentSplitCount} Batchmates\n` +
      `💰 *Estimated Cost:* Rs. ${perPerson.toLocaleString()} per student (Total: Rs. ${(place.budget || 20000).toLocaleString()})\n` +
      `🚆 *Commute Guide:* ${place.transitMode}\n` +
      `✨ *Student ID Perk:* ${place.studentPerk}\n\n` +
      `💡 *Top Student Tip:* ${place.studentTips?.[0] || 'Pack light and carry University ID!'}\n\n` +
      `📍 Shared from Travel Memories Journal`

    navigator.clipboard.writeText(text).then(() => {
      setCopiedToast(true)
      setTimeout(() => setCopiedToast(false), 3200)
    })
  }

  // Toggle checklist item
  const toggleChecklistItem = (id) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    )
  }

  // Handle Mark Wishlist as Visited
  const handleMarkAsVisited = (wishlistId) => {
    const createdTrip = convertWishlistToTrip(wishlistId)
    if (createdTrip) {
      setActiveTab('visited')
      setActivePlaceId(createdTrip.id)
    }
  }

  // Handle Submit New Destination
  const handleCreateNewDestination = (e) => {
    e.preventDefault()
    if (!newPlace.name.trim() || !newPlace.destination.trim()) return

    if (newPlace.targetList === 'wishlist') {
      const added = addWishlistPlace({
        name: newPlace.name,
        destination: newPlace.destination,
        cover: newPlace.cover,
        estimatedBudget: Number(newPlace.estimatedBudget),
        defaultStudents: Number(newPlace.defaultStudents),
        type: newPlace.type,
        transitMode: newPlace.transitMode,
        studentPerk: newPlace.studentPerk,
        description: newPlace.description || `Exciting student destination in ${newPlace.destination}.`,
        studentTips: [
          'Travel with batchmates to split dorm and meal expenses.',
          'Always flash your University ID for student group concessions.',
        ],
      })
      setActiveTab('wishlist')
      setActivePlaceId(added.id)
    } else {
      // Visited Journey
      const newTrip = convertWishlistToTrip({
        name: newPlace.name,
        destination: newPlace.destination,
        cover: newPlace.cover,
        estimatedBudget: Number(newPlace.estimatedBudget),
        defaultStudents: Number(newPlace.defaultStudents),
        type: newPlace.type,
        transitMode: newPlace.transitMode,
        studentPerk: newPlace.studentPerk,
        description: newPlace.description,
      })
      setActiveTab('visited')
      if (newTrip) setActivePlaceId(newTrip.id)
    }

    setShowAddModal(false)
    setNewPlace({
      name: '',
      destination: '',
      cover: sampleCoverOptions[0].url,
      estimatedBudget: 16000,
      defaultStudents: 4,
      type: 'Batch Trip',
      transitMode: '🚆 Scenic Train / Express Bus',
      studentPerk: '🎓 50% discount with University Student ID',
      description: '',
      targetList: 'wishlist',
    })
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 pb-28">
      {/* Toast Notification */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-forest text-cream px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-cream/20 animate-bounce">
          <CheckCircle2 size={20} className="text-cream" />
          <div className="text-xs sm:text-sm font-semibold">
            Itinerary copied to clipboard! Ready to paste into your Batch WhatsApp Group 🚀
          </div>
        </div>
      )}

      {/* Header Banner - Undergrad Edition */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-ink/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest/10 text-forest text-xs font-bold tracking-wide mb-2.5">
            <GraduationCap size={15} /> Undergrad Travel Atlas & Campus Escapes
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight">
            Places Visited & Student Explorer
          </h1>
          <p className="text-ink/65 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
            Budget-friendly getaways, batch trip routes, scenic train trails, and campus weekend escapes across Sri Lanka.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-clay text-cream px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold shadow-stamp hover:brightness-110 active:scale-95 transition"
          >
            <Plus size={16} strokeWidth={2.5} /> Pin New Destination
          </button>
          <Link
            to="/create-trip"
            className="inline-flex items-center gap-2 bg-paper border border-ink/15 text-ink hover:text-forest hover:border-forest/40 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition shadow-sm"
          >
            <Compass size={15} /> Log Journey Log
          </Link>
        </div>
      </div>

      {/* Student Metrics & Quick Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 mt-6">
        <div className="bg-paper border border-ink/10 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-ink/50 text-xs font-semibold mb-1">
            <MapPin size={14} className="text-forest" /> Visited Places
          </div>
          <div className="text-2xl sm:text-3xl font-display font-bold text-ink">
            {visitedPlaces.length}
          </div>
          <p className="text-[11px] text-ink/55 mt-0.5">Unique Sri Lankan spots</p>
        </div>

        <div className="bg-paper border border-ink/10 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-ink/50 text-xs font-semibold mb-1">
            <Bookmark size={14} className="text-clay" /> Semester Wishlist
          </div>
          <div className="text-2xl sm:text-3xl font-display font-bold text-ink">
            {wishlistPlaces.length}
          </div>
          <p className="text-[11px] text-ink/55 mt-0.5">Post-exam dream trips</p>
        </div>

        <div className="bg-paper border border-ink/10 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-ink/50 text-xs font-semibold mb-1">
            <Wallet size={14} className="text-emerald-600" /> Avg. Student Cost
          </div>
          <div className="text-2xl sm:text-3xl font-display font-bold text-ink">
            Rs. 4,250
          </div>
          <p className="text-[11px] text-ink/55 mt-0.5">Per person with batchmates</p>
        </div>

        <div className="bg-paper border border-ink/10 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-ink/50 text-xs font-semibold mb-1">
            <Train size={14} className="text-blue-600" /> Train Accessible
          </div>
          <div className="text-2xl sm:text-3xl font-display font-bold text-ink">
            85%
          </div>
          <p className="text-[11px] text-ink/55 mt-0.5">Scenic rail & CTB routes</p>
        </div>
      </div>

      {/* Main Tab Navigation: Visited vs Semester Wishlist vs Student Guide */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8 pb-4 border-b border-ink/10">
        <div className="flex items-center gap-2 p-1 bg-ink/5 rounded-2xl max-w-fit">
          <button
            onClick={() => {
              setActiveTab('visited')
              setActivePlaceId(visitedPlaces[0]?.id)
            }}
            className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'visited'
                ? 'bg-paper text-forest shadow-sm ring-1 ring-ink/10'
                : 'text-ink/65 hover:text-ink'
            }`}
          >
            <MapPin size={15} /> Visited Journeys ({visitedPlaces.length})
          </button>

          <button
            onClick={() => {
              setActiveTab('wishlist')
              setActivePlaceId(formattedWishlist[0]?.id)
            }}
            className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'wishlist'
                ? 'bg-paper text-clay shadow-sm ring-1 ring-ink/10'
                : 'text-ink/65 hover:text-ink'
            }`}
          >
            <Sparkles size={15} /> Semester Break Wishlist ({formattedWishlist.length})
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'guide'
                ? 'bg-paper text-forest shadow-sm ring-1 ring-ink/10'
                : 'text-ink/65 hover:text-ink'
            }`}
          >
            <GraduationCap size={15} /> Student Packing & Tips
          </button>
        </div>

        {/* Real-time search */}
        {activeTab !== 'guide' && (
          <div className="relative min-w-[240px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              type="text"
              placeholder="Search spots, trains, vibes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-paper border border-ink/15 text-ink placeholder-ink/40 text-xs sm:text-sm rounded-full pl-9 pr-4 py-2 outline-none focus:border-forest transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
              >
                <X size={13} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Category Filter Chips for Students */}
      {activeTab !== 'guide' && (
        <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
          <span className="text-xs font-semibold text-ink/50 flex items-center gap-1 shrink-0 mr-1">
            <Filter size={12} /> Filter:
          </span>
          {[
            { id: 'all', label: 'All Destinations', emoji: '🌟' },
            { id: 'budget', label: 'Pocket Friendly (< Rs. 4,500/pp)', emoji: '💸' },
            { id: 'train', label: 'Train & Rail Accessible', emoji: '🚆' },
            { id: 'batch', label: 'Batch & Campus Trips', emoji: '👥' },
            { id: 'nature', label: 'Hiking & Cloud Forest Camps', emoji: '⛺' },
            { id: 'beach', label: 'Post-Exam Beach & Surf', emoji: '🏖️' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                filterCategory === cat.id
                  ? 'bg-forest text-cream shadow-sm'
                  : 'bg-paper border border-ink/10 text-ink/70 hover:bg-forest/5'
              }`}
            >
              <span>{cat.emoji}</span> {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Guide & Packing Checklist Tab View */}
      {activeTab === 'guide' ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-6">
          {/* Packing Checklist */}
          <div className="md:col-span-6 bg-paper border border-ink/10 rounded-3xl p-6 sm:p-8 shadow-stamp">
            <div className="flex items-center justify-between pb-4 border-b border-ink/10">
              <div>
                <h3 className="font-display font-bold text-xl text-ink flex items-center gap-2">
                  <GraduationCap className="text-forest" size={20} /> Undergrad Trip Packing Checklist
                </h3>
                <p className="text-xs text-ink/60 mt-1">
                  Essential checklist tailored for batch trips, train rides, and dorm stays.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                    item.checked
                      ? 'bg-forest/5 border-forest/30 text-ink'
                      : 'bg-cream/40 border-ink/10 text-ink/70 hover:bg-cream/70'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-forest focus:ring-forest cursor-pointer"
                  />
                  <span
                    className={`text-xs sm:text-sm font-medium ${
                      item.checked ? 'line-through text-ink/50' : ''
                    }`}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-forest/10 border border-forest/20 text-xs text-forest flex items-start gap-2.5">
              <Info size={16} className="shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Golden Student Rule:</span> Always carry your valid University Student ID card. Many national parks, botanical gardens, and archaeological heritage sites in Sri Lanka grant 50% discount to local undergraduates!
              </div>
            </div>
          </div>

          {/* Student Travel Hacks & Train Guides */}
          <div className="md:col-span-6 space-y-6">
            <div className="bg-paper border border-ink/10 rounded-3xl p-6 sm:p-8 shadow-stamp">
              <h3 className="font-display font-bold text-xl text-ink flex items-center gap-2">
                <Train className="text-clay" size={20} /> Sri Lanka Scenic Rail Lifehacks
              </h3>
              <ul className="mt-4 space-y-3.5 text-xs sm:text-sm text-ink/75">
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-forest">1.</span>
                  <span>
                    <strong>Colombo Fort to Ella (Main Line):</strong> Book 3rd class reserved tickets 30 days ahead online via Sri Lanka Railways. Unreserved 3rd class is only ~Rs. 420! Sit on the right side from Colombo to Kandy, then left side from Kandy to Ella for the best vistas.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-forest">2.</span>
                  <span>
                    <strong>Coastal Line to Galle / Matara:</strong> Take the ocean-side commuter train right after your semester exams. Open doors with ocean spray right by your feet.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-forest">3.</span>
                  <span>
                    <strong>Hostels over Luxury Stays:</strong> Sri Lanka has an abundance of backpacker hostels in Ella, Sigiriya, Mirissa, and Kandy starting from Rs. 1,800 - 2,500/night with free high-speed Wi-Fi and common study terraces.
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-paper border border-ink/10 rounded-3xl p-6 sm:p-8 shadow-stamp flex flex-col justify-between">
              <div>
                <h4 className="font-display font-bold text-lg text-ink">Ready to Plan the Next Batch Escape?</h4>
                <p className="text-xs text-ink/65 mt-1.5 leading-relaxed">
                  Pin any upcoming mountain trek or beach getaway to your Semester Wishlist to start splitting costs with batchmates.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveTab('wishlist')
                  setShowAddModal(true)
                }}
                className="mt-5 inline-flex items-center justify-center gap-2 bg-clay text-cream px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold shadow-stamp hover:brightness-110 transition"
              >
                <Plus size={15} /> Add Destination to Next Vacation Wishlist
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Map & Interactive Spotlight Section */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          {/* Leaflet Map Container */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-ink/10 shadow-stamp bg-paper h-[480px] relative z-10">
            <div className="absolute top-3 left-3 z-[400] bg-paper/95 backdrop-blur px-3 py-1.5 rounded-full border border-ink/10 text-[11px] font-bold text-ink shadow-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-forest animate-pulse" />
              <span>{activeTab === 'visited' ? 'Visited Journeys Map' : 'Semester Wishlist Map'}</span>
              <span className="text-ink/40">·</span>
              <span className="text-ink/60">{filteredPlaces.length} pins</span>
            </div>

            <MapContainer
              center={[activePlace?.lat || 6.9, activePlace?.lng || 80.7]}
              zoom={8}
              scrollWheelZoom={false}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Render Visited Pins */}
              {activeTab === 'visited' &&
                visitedPlaces.map((t) => (
                  <Marker
                    key={t.id}
                    position={[t.lat, t.lng]}
                    icon={visitedPin}
                    eventHandlers={{
                      click: () => setActivePlaceId(t.id),
                    }}
                  >
                    <Popup>
                      <div className="text-xs p-1 min-w-[150px]">
                        <p className="font-bold text-forest text-sm">{t.tripName}</p>
                        <p className="text-ink/70 font-medium">{t.name}</p>
                        <p className="text-clay font-bold mt-1">
                          Rs. {t.studentBudgetPerPerson.toLocaleString()} / student
                        </p>
                        <p className="text-[10px] text-ink/50 mt-0.5">{t.transitMode}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}

              {/* Render Wishlist Pins */}
              {activeTab === 'wishlist' &&
                formattedWishlist.map((w) => (
                  <Marker
                    key={w.id}
                    position={[w.lat, w.lng]}
                    icon={wishlistPin}
                    eventHandlers={{
                      click: () => setActivePlaceId(w.id),
                    }}
                  >
                    <Popup>
                      <div className="text-xs p-1 min-w-[150px]">
                        <p className="font-bold text-clay text-sm">{w.tripName}</p>
                        <p className="text-ink/70 font-medium">{w.name}</p>
                        <p className="text-forest font-bold mt-1">
                          Rs. {w.studentBudgetPerPerson.toLocaleString()} / student
                        </p>
                        <p className="text-[10px] text-ink/50 mt-0.5">{w.bestSeason}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
            </MapContainer>
          </div>

          {/* Selected Destination Spotlight Card — Undergrad Edition */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            {activePlace ? (
              <div className="bg-paper border border-ink/10 rounded-3xl overflow-hidden shadow-stamp flex flex-col h-full">
                {/* Cover & Badges */}
                <div
                  onClick={() => handlePreviewPlacePhoto(activePlace)}
                  className="relative aspect-[16/9] bg-ink/5 overflow-hidden cursor-pointer group/img"
                  title="Click to zoom photo full screen"
                >
                  <img
                    src={activePlace.cover || FALLBACK_PHOTO}
                    alt={activePlace.tripName}
                    className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = FALLBACK_PHOTO
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity" />

                  {/* Zoom Overlay Badge */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all pointer-events-none z-10 bg-black/20 backdrop-blur-[1px]">
                    <span className="bg-ink/85 backdrop-blur-md text-cream text-xs font-bold px-3.5 py-2 rounded-full flex items-center gap-2 shadow-2xl border border-white/20">
                      <ZoomIn size={14} /> Click to Zoom Photo
                    </span>
                  </div>

                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-20">
                    <span className="bg-paper/95 backdrop-blur px-2.5 py-1 rounded-full text-xs font-bold text-forest shadow-sm">
                      {activePlace.type}
                    </span>
                    {activePlace.isWishlist && (
                      <span className="bg-clay/95 backdrop-blur text-cream px-2.5 py-1 rounded-full text-xs font-bold shadow-sm">
                        ✨ Wishlist
                      </span>
                    )}
                  </div>

                  {/* Quick Zoom Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePreviewPlacePhoto(activePlace)
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-cream/90 hover:bg-cream backdrop-blur flex items-center justify-center shadow-sm transition active:scale-90 z-20 text-ink/70 hover:text-forest"
                    title="Zoom photo full screen"
                  >
                    <ZoomIn size={14} />
                  </button>

                  <span className="absolute bottom-3 right-3 bg-ink/80 backdrop-blur text-cream px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 z-20">
                    <Wallet size={12} className="text-emerald-400" />
                    Rs. {activePlace.studentBudgetPerPerson.toLocaleString()} / person
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-ink/55 mb-1 font-medium">
                      <MapPin size={13} className="text-clay shrink-0" />
                      <span className="truncate">{activePlace.name}</span>
                    </div>

                    <h3 className="font-display font-extrabold text-2xl text-ink leading-tight">
                      {activePlace.tripName}
                    </h3>

                    <p className="text-xs text-ink/70 mt-2 line-clamp-2 leading-relaxed">
                      {activePlace.description}
                    </p>

                    {/* Interactive Group Split-Cost Widget */}
                    <div className="mt-4 p-3.5 rounded-2xl bg-forest/5 border border-forest/15">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-forest flex items-center gap-1.5">
                          <Users size={14} /> Batch Split Calculator
                        </span>

                        <div className="flex items-center gap-2 bg-paper px-2 py-1 rounded-full border border-forest/20 text-xs">
                          <button
                            onClick={() => setStudentSplitCount(Math.max(1, studentSplitCount - 1))}
                            className="w-5 h-5 rounded-full bg-forest/10 hover:bg-forest text-forest hover:text-cream flex items-center justify-center font-bold transition"
                            title="Decrease friends"
                          >
                            -
                          </button>
                          <span className="font-bold text-forest min-w-[65px] text-center">
                            {studentSplitCount} Students
                          </span>
                          <button
                            onClick={() => setStudentSplitCount(Math.min(15, studentSplitCount + 1))}
                            className="w-5 h-5 rounded-full bg-forest/10 hover:bg-forest text-forest hover:text-cream flex items-center justify-center font-bold transition"
                            title="Add friend"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-forest/10">
                        <span className="text-[11px] text-ink/60">
                          Total Budget: Rs. {(activePlace.budget || 20000).toLocaleString()}
                        </span>
                        <div className="text-right">
                          <span className="text-xs text-ink/60">Your Share: </span>
                          <span className="text-base font-extrabold text-forest">
                            Rs. {splitCostPerStudent.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Student Perks & Transit Guide */}
                    <div className="mt-3.5 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-ink/80 bg-paper border border-ink/10 p-2.5 rounded-xl">
                        <Train size={14} className="text-blue-600 shrink-0" />
                        <span className="truncate">
                          <strong>Transit:</strong> {activePlace.transitMode}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-forest bg-forest/10 p-2.5 rounded-xl font-medium">
                        <GraduationCap size={15} className="shrink-0" />
                        <span className="truncate">{activePlace.studentPerk}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & WhatsApp Sharing */}
                  <div className="pt-3 border-t border-ink/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <button
                      onClick={() => handleShareWhatsApp(activePlace)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-paper hover:bg-forest/10 text-forest border border-forest/30 px-3.5 py-2 rounded-full text-xs font-bold transition shadow-sm"
                      title="Copy itinerary formatted for WhatsApp"
                    >
                      <Share2 size={13} /> Share with Batch
                    </button>

                    {activePlace.isWishlist ? (
                      <button
                        onClick={() => handleMarkAsVisited(activePlace.id)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-clay text-cream px-4 py-2 rounded-full text-xs font-bold shadow-sm hover:brightness-110 transition"
                      >
                        <Check size={13} strokeWidth={3} /> Mark Visited
                      </button>
                    ) : (
                      <Link
                        to={`/trips/${activePlace.id}`}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1 text-xs font-bold text-forest hover:underline"
                      >
                        View Trip Scrapbook &rarr;
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-paper border border-ink/10 rounded-3xl p-8 text-center flex flex-col items-center justify-center h-full">
                <Navigation className="text-forest/30 mb-2" size={32} />
                <p className="text-sm font-semibold text-ink">Select a pin on the map</p>
                <p className="text-xs text-ink/50 mt-1">
                  Click any marker to view student budget split and travel tips.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grid of Destinations Section */}
      {activeTab !== 'guide' && (
        <div className="mt-14">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-ink/10">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">
                {activeTab === 'visited' ? 'All Visited Destinations' : 'Semester Break Wishlist Spots'}
              </h2>
              <p className="text-xs text-ink/60 mt-0.5">
                Showing {filteredPlaces.length} student-friendly locations
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-forest bg-forest/10 hover:bg-forest/20 px-3.5 py-1.5 rounded-full transition"
            >
              <Plus size={14} /> Add Place
            </button>
          </div>

          {filteredPlaces.length === 0 ? (
            <div className="bg-paper border border-ink/10 rounded-3xl p-12 text-center">
              <Compass className="mx-auto text-forest/40 mb-3" size={36} />
              <h3 className="font-display text-lg font-bold text-ink">No destinations matched your filter</h3>
              <p className="text-xs text-ink/60 mt-1 max-w-sm mx-auto">
                Try selecting "All Destinations" or clearing your search term.
              </p>
              <button
                onClick={() => {
                  setFilterCategory('all')
                  setSearchQuery('')
                }}
                className="mt-4 inline-flex items-center gap-1.5 bg-forest text-cream px-4 py-2 rounded-full text-xs font-semibold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredPlaces.map((place) => (
                <div
                  key={place.id}
                  onClick={() => setActivePlaceId(place.id)}
                  className={`bg-paper rounded-2xl overflow-hidden border transition cursor-pointer group shadow-sm hover:shadow-md flex flex-col justify-between ${
                    activePlace?.id === place.id
                      ? 'border-forest ring-2 ring-forest/20 shadow-md'
                      : 'border-ink/10'
                  }`}
                >
                  <div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePreviewPlacePhoto(place)
                      }}
                      className="relative aspect-[4/3] bg-ink/10 overflow-hidden group/img cursor-pointer"
                      title="Click to zoom destination photo"
                    >
                      <img
                        src={place.cover || FALLBACK_PHOTO}
                        alt={place.name}
                        className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700 ease-out"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null
                          e.currentTarget.src = FALLBACK_PHOTO
                        }}
                      />

                      {/* Zoom Overlay Badge */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all pointer-events-none z-10 bg-black/20 backdrop-blur-[1px]">
                        <span className="bg-ink/85 backdrop-blur-md text-cream text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl border border-white/20">
                          <ZoomIn size={12} /> Click to Zoom
                        </span>
                      </div>

                      <div className="absolute top-2 left-2 flex gap-1 z-20">
                        <span className="bg-paper/95 backdrop-blur text-forest text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {place.type}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePreviewPlacePhoto(place)
                        }}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-cream/90 hover:bg-cream backdrop-blur flex items-center justify-center shadow-sm transition active:scale-90 z-20 text-ink/70 hover:text-forest"
                        title="Zoom photo full screen"
                      >
                        <ZoomIn size={13} />
                      </button>

                      <span className="absolute bottom-2 left-2 bg-ink/80 backdrop-blur text-cream text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 z-20">
                        {place.isWishlist ? (
                          <>
                            <Sparkles size={10} className="text-yellow-400" /> Wishlist
                          </>
                        ) : (
                          <>
                            <Camera size={10} /> {place.memoryCount} memories
                          </>
                        )}
                      </span>

                      <span className="absolute bottom-2 right-2 bg-forest/95 backdrop-blur text-cream text-[10px] font-bold px-2 py-0.5 rounded-full z-20">
                        Rs. {place.studentBudgetPerPerson.toLocaleString()}
                      </span>
                    </div>

                    <div className="p-3.5">
                      <h4 className="font-display font-bold text-sm text-ink group-hover:text-forest transition truncate">
                        {place.tripName}
                      </h4>
                      <p className="text-[11px] text-ink/55 mt-0.5 truncate flex items-center gap-1">
                        <MapPin size={11} className="text-clay" /> {place.name}
                      </p>
                      <p className="text-[10px] text-ink/50 mt-1 truncate">
                        {place.transitMode}
                      </p>
                    </div>
                  </div>

                  <div className="px-3.5 pb-3 pt-2 border-t border-ink/5 flex items-center justify-between text-[11px]">
                    <span className="text-forest font-semibold flex items-center gap-1">
                      <GraduationCap size={12} /> ID Perk
                    </span>
                    <span className="text-ink/60 font-medium group-hover:text-forest transition flex items-center gap-0.5">
                      View <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add New Destination / Wishlist Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-paper border border-ink/15 rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-ink/10">
              <div>
                <h3 className="font-display font-bold text-xl text-ink">Pin a New Destination</h3>
                <p className="text-xs text-ink/60 mt-0.5">
                  Save a student-friendly spot to your map and journal.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-ink/50 hover:text-ink p-1 rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateNewDestination} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink/80 mb-1">Destination List</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewPlace((p) => ({ ...p, targetList: 'wishlist' }))}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      newPlace.targetList === 'wishlist'
                        ? 'bg-clay text-cream border-clay shadow-sm'
                        : 'bg-cream/50 text-ink/70 border-ink/10'
                    }`}
                  >
                    ✨ Semester Wishlist
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPlace((p) => ({ ...p, targetList: 'visited' }))}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      newPlace.targetList === 'visited'
                        ? 'bg-forest text-cream border-forest shadow-sm'
                        : 'bg-cream/50 text-ink/70 border-ink/10'
                    }`}
                  >
                    📍 Visited Destination
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink/80 mb-1">Place Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hanthana Mountain Trek, Hiriketiya Beach"
                  value={newPlace.name}
                  onChange={(e) => setNewPlace((p) => ({ ...p, name: e.target.value }))}
                  className="w-full bg-cream/40 border border-ink/15 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-ink outline-none focus:border-forest"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink/80 mb-1">Location / District</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kandy, Sri Lanka"
                  value={newPlace.destination}
                  onChange={(e) => setNewPlace((p) => ({ ...p, destination: e.target.value }))}
                  className="w-full bg-cream/40 border border-ink/15 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-ink outline-none focus:border-forest"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink/80 mb-1">Estimated Budget (LKR)</label>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    value={newPlace.estimatedBudget}
                    onChange={(e) => setNewPlace((p) => ({ ...p, estimatedBudget: e.target.value }))}
                    className="w-full bg-cream/40 border border-ink/15 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-ink outline-none focus:border-forest"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink/80 mb-1">Split with Students</label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={newPlace.defaultStudents}
                    onChange={(e) => setNewPlace((p) => ({ ...p, defaultStudents: e.target.value }))}
                    className="w-full bg-cream/40 border border-ink/15 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-ink outline-none focus:border-forest"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink/80 mb-1">Commute & Transit Mode</label>
                <input
                  type="text"
                  placeholder="e.g. 🚆 Scenic Upcountry Train / CTB Express Bus"
                  value={newPlace.transitMode}
                  onChange={(e) => setNewPlace((p) => ({ ...p, transitMode: e.target.value }))}
                  className="w-full bg-cream/40 border border-ink/15 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-ink outline-none focus:border-forest"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink/80 mb-1">Student Perk / ID Hack</label>
                <input
                  type="text"
                  placeholder="e.g. 🎓 50% discount on tickets with University ID"
                  value={newPlace.studentPerk}
                  onChange={(e) => setNewPlace((p) => ({ ...p, studentPerk: e.target.value }))}
                  className="w-full bg-cream/40 border border-ink/15 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-ink outline-none focus:border-forest"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink/80 mb-1">Cover Photo</label>
                <div className="flex gap-2 overflow-x-auto py-1 mb-2">
                  {sampleCoverOptions.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setNewPlace((p) => ({ ...p, cover: opt.url }))}
                      className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 ${
                        newPlace.cover === opt.url ? 'border-forest scale-105' : 'border-transparent opacity-60'
                      }`}
                    >
                      <img src={opt.url} alt={opt.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  placeholder="Or paste custom image URL"
                  value={newPlace.cover}
                  onChange={(e) => setNewPlace((p) => ({ ...p, cover: e.target.value }))}
                  className="w-full bg-cream/40 border border-ink/15 rounded-xl px-3.5 py-2 text-xs text-ink outline-none focus:border-forest"
                />
              </div>

              <div className="pt-4 border-t border-ink/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-ink/60 hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-forest text-cream px-5 py-2 rounded-full text-xs font-bold hover:brightness-110 shadow-sm"
                >
                  Save Destination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Destination Photo Zoom Lightbox Modal */}
      <MemoryModal
        memory={previewPhotoMemory}
        onClose={() => setPreviewPhotoMemory(null)}
      />
    </div>
  )
}
