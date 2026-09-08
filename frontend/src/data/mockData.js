// Mock data standing in for the Spring Boot API responses.
// Every field here mirrors a column in schema.sql so swapping in
// real axios calls later is a straight substitution.

export const initialTrips = [
  {
    id: 't1', name: 'Ella Adventure', destination: 'Ella, Sri Lanka',
    startDate: '2026-03-15', endDate: '2026-03-18',
    cover: 'https://images.unsplash.com/photo-1586183189334-25997a53f818?w=1200&q=80',
    description: 'Three days chasing waterfalls and train windows in the hill country.',
    type: 'Adventure', budget: 28500, favourite: true, rating: 5,
    lat: 6.8667, lng: 81.0466,
  },
  {
    id: 't2', name: 'Galle Fort Wander', destination: 'Galle, Sri Lanka',
    startDate: '2026-08-02', endDate: '2026-08-04',
    cover: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=80',
    description: 'Ramparts at sunset and too much fresh seafood.',
    type: 'Cultural', budget: 19000, favourite: false, rating: 4,
    lat: 6.0300, lng: 80.2167,
  },
  {
    id: 't3', name: 'Nuwara Eliya Escape', destination: 'Nuwara Eliya, Sri Lanka',
    startDate: '2026-06-10', endDate: '2026-06-12',
    cover: 'https://images.unsplash.com/photo-1563299796-17596ed6b017?w=1200&q=80',
    description: 'Tea estates, cool mist, and a fireplace every evening.',
    type: 'Relaxation', budget: 15500, favourite: true, rating: 5,
    lat: 6.9497, lng: 80.7891,
  },
  {
    id: 't4', name: 'Mirissa Coastline', destination: 'Mirissa, Sri Lanka',
    startDate: '2025-12-20', endDate: '2025-12-23',
    cover: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&q=80',
    description: 'Whale watching at dawn, hammocks the rest of the day.',
    type: 'Beach', budget: 22000, favourite: false, rating: 4,
    lat: 5.9483, lng: 80.4589,
  },
]

export const companionTypes = [
  { key: 'Solo', label: 'Solo', emoji: '🧍' },
  { key: 'Friends', label: 'Friends', emoji: '👥' },
  { key: 'Family', label: 'Family', emoji: '👨‍👩‍👧' },
  { key: 'Official', label: 'Official', emoji: '💼' },
  { key: 'Other', label: 'Other', emoji: '✨' },
]

export const initialMemories = [
  {
    id: 'm1', tripId: 't1', title: 'Sunset at Ella Rock',
    photo: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=900&q=80',
    photos: [
      'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=900&q=80',
      'https://images.unsplash.com/photo-1586183189334-25997a53f818?w=900&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=900&q=80',
    ],
    caption: 'One of the most beautiful sunsets I have ever seen.',
    location: 'Ella', date: '2026-03-16', mood: 'Adventurous', companionType: 'Friends', rating: 5, favourite: true,
  },
  {
    id: 'm2', tripId: 't1', title: 'Nine Arch Bridge, morning fog',
    photo: 'https://images.unsplash.com/photo-1596395463642-9d8f6c1ff611?w=900&q=80',
    photos: [
      'https://images.unsplash.com/photo-1596395463642-9d8f6c1ff611?w=900&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=900&q=80',
    ],
    caption: 'Waited forty minutes for a train that took ten seconds to cross.',
    location: 'Ella', date: '2026-03-17', mood: 'Peaceful', companionType: 'Solo', rating: 5, favourite: false,
  },
  {
    id: 'm3', tripId: 't2', title: 'Rampart walk',
    photo: 'https://images.unsplash.com/photo-1590059390047-f5f1f8b1c1c9?w=900&q=80',
    photos: [
      'https://images.unsplash.com/photo-1590059390047-f5f1f8b1c1c9?w=900&q=80',
      'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=900&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80',
    ],
    caption: 'Lighthouse glowing gold, everyone slowed their pace without noticing.',
    location: 'Galle', date: '2026-08-03', mood: 'Relaxing', companionType: 'Family', rating: 4, favourite: true,
  },
  {
    id: 'm4', tripId: 't3', title: 'Tea pickers at first light',
    photo: 'https://images.unsplash.com/photo-1571167530149-c72f2c8c1c1b?w=900&q=80',
    photos: [
      'https://images.unsplash.com/photo-1571167530149-c72f2c8c1c1b?w=900&q=80',
      'https://images.unsplash.com/photo-1563299796-17596ed6b017?w=900&q=80',
    ],
    caption: 'The whole valley smelled like green tea and woodsmoke.',
    location: 'Nuwara Eliya', date: '2026-06-11', mood: 'Peaceful', companionType: 'Solo', rating: 5, favourite: false,
  },
  {
    id: 'm5', tripId: 't4', title: 'Whale watching at dawn',
    photo: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=900&q=80',
    photos: [
      'https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=900&q=80',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=900&q=80',
    ],
    caption: 'A blue whale surfaced twenty metres from the boat. Nobody spoke.',
    location: 'Mirissa', date: '2025-12-21', mood: 'Exciting', companionType: 'Official', rating: 5, favourite: true,
  },
]

export const initialStories = [
  {
    id: 's1', tripId: 't1', title: 'A Weekend in Ella',
    cover: 'https://images.unsplash.com/photo-1586183189334-25997a53f818?w=1200&q=80',
    location: 'Ella', date: '2026-03-18',
    tags: ['hill country', 'trains', 'hiking'],
    content: `We started early, before the mist had a chance to burn off the valley. The train to Ella climbs so slowly you can watch tea leaves change colour with the altitude. By the time we reached Nine Arch Bridge the fog had lifted just enough to see the whole thing at once — nine stone arches holding up a single track over green.\n\nWe spent the second day chasing waterfalls we'd only seen tagged on a map, and the third watching the sun drop behind Ella Rock with our feet hanging off the edge. Some trips are about seeing things. This one was mostly about slowing down.`,
    favourite: true,
  },
  {
    id: 's2', tripId: 't4', title: 'Whales Before Breakfast',
    cover: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=1200&q=80',
    location: 'Mirissa', date: '2025-12-23',
    tags: ['ocean', 'wildlife'],
    content: `The boat left the harbour at 6am, still dark. Nobody expected much — the guide had warned us sightings weren't guaranteed. An hour out, the water went still, then a shape the length of a bus rose out of it like it had somewhere to be.\n\nWe spent the rest of the trip talking about almost nothing else.`,
    favourite: false,
  },
]

export const expenseCategories = ['Transportation', 'Accommodation', 'Food', 'Activities', 'Shopping', 'Other']

export const initialExpenses = {
  t1: [
    { id: 'e1', category: 'Transportation', amount: 8000 },
    { id: 'e2', category: 'Accommodation', amount: 10000 },
    { id: 'e3', category: 'Food', amount: 5500 },
    { id: 'e4', category: 'Activities', amount: 3000 },
    { id: 'e5', category: 'Other', amount: 2000 },
  ],
}

export const moods = [
  { key: 'Happy', emoji: '😊' },
  { key: 'Adventurous', emoji: '🌄' },
  { key: 'Relaxing', emoji: '😌' },
  { key: 'Romantic', emoji: '❤️' },
  { key: 'Peaceful', emoji: '🌿' },
  { key: 'Exciting', emoji: '🤩' },
  { key: 'Family', emoji: '👨‍👩‍👧' },
]

export const travelTypes = ['Adventure', 'Relaxation', 'Nature', 'Photography', 'Family', 'Beach', 'Cultural', 'Road Trip']
