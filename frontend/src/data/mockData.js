// Mock data standing in for the Spring Boot API responses.
// Every field here mirrors a column in schema.sql so swapping in
// real axios calls later is a straight substitution.

export const initialTrips = [
  {
    id: 't1', name: 'Ella Adventure', destination: 'Ella, Sri Lanka',
    startDate: '2026-03-15', endDate: '2026-03-18',
    cover: 'https://images.unsplash.com/photo-1546708973-b339540b5162?w=1200&q=80',
    description: 'Three days chasing waterfalls, Nine Arch Bridge, and train windows in the hill country with batchmates.',
    type: 'Batch Trip', budget: 28500, favourite: true, rating: 5,
    lat: 6.8667, lng: 81.0466,
    defaultStudents: 6,
    studentBudgetPerPerson: 4750,
    transitMode: '🚆 Scenic Upcountry Train (3rd Class / Student Pass ~Rs. 420)',
    studentPerk: '🎓 50% discount on Ravana Zip-line & heritage museums with Uni ID card',
    studentTips: [
      'Take the 5:55 AM Podi Menike train from Colombo Fort for the coolest breeze & bridge view.',
      'Dorm beds in local backpacker homestays start at Rs. 2,000/night with free Wi-Fi.',
      'Local kottu & tea near the station are cheap and huge portions for sharing.'
    ],
    studentCategory: 'Batch Trip',
  },
  {
    id: 't2', name: 'Galle Fort Wander', destination: 'Galle, Sri Lanka',
    startDate: '2026-08-02', endDate: '2026-08-04',
    cover: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=80',
    description: 'Sunset walks on the ramparts, Dutch architecture, gelato, and coastal train ride after semester exams.',
    type: 'Campus Getaway', budget: 19000, favourite: false, rating: 4,
    lat: 6.0300, lng: 80.2167,
    defaultStudents: 4,
    studentBudgetPerPerson: 4750,
    transitMode: '🚆 Coastal Line Train (Colombo to Galle ocean-side seats)',
    studentPerk: '🎓 Free entry to Galle Fort ramparts; Maritime Museum has student concessional tickets',
    studentTips: [
      'Sit on the right side of the train when going south for uninterrupted sea views.',
      'Street food and isso wade at the beachside stalls are delicious and under Rs. 400.',
      'Bicycle rentals inside the fort cost ~Rs. 800/day and are great for exploring with friends.'
    ],
    studentCategory: 'Post-Exam Escape',
  },
  {
    id: 't3', name: 'Nuwara Eliya Escape', destination: 'Nuwara Eliya, Sri Lanka',
    startDate: '2026-06-10', endDate: '2026-06-12',
    cover: 'https://images.unsplash.com/photo-1563299796-17596ed6b017?w=1200&q=80',
    description: 'Tea estates, cool mountain mist, Gregory lake cycling, and evening bonfires with hostel roommates.',
    type: 'Relaxation', budget: 15500, favourite: true, rating: 5,
    lat: 6.9497, lng: 80.7891,
    defaultStudents: 5,
    studentBudgetPerPerson: 3100,
    transitMode: '🚆 Train to Nanu Oya ➔ CTB local bus up to Nuwara Eliya town',
    studentPerk: '🎓 Victoria Park & Botanical gardens offer discounted student entry vouchers',
    studentTips: [
      'Pack warm hoodies and thermal layers — temperatures drop to 12°C at night.',
      'Rent tandem bicycles around Lake Gregory for Rs. 300 per 30 minutes.',
      'Try fresh strawberry pancakes from roadside farm stalls.'
    ],
    studentCategory: 'Budget Weekend',
  },
  {
    id: 't4', name: 'Mirissa Coastline', destination: 'Mirissa, Sri Lanka',
    startDate: '2025-12-20', endDate: '2025-12-23',
    cover: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&q=80',
    description: 'Coconut Tree Hill sunrise, whale watching at dawn, and hammocks on the beach during December holidays.',
    type: 'Beach', budget: 22000, favourite: false, rating: 4,
    lat: 5.9483, lng: 80.4589,
    defaultStudents: 5,
    studentBudgetPerPerson: 4400,
    transitMode: '🚌 Southern Expressway Bus to Matara ➔ 20-min coastal bus',
    studentPerk: '🎓 Off-peak group whale safari bookings offer 25% student discounts',
    studentTips: [
      'Climb Coconut Tree Hill before 6:30 AM to avoid crowds and get clear sunrise photos.',
      'Roti shacks on the beach serve student meal deals for dinner.',
      'Snorkel gear can be rented cheaply near Parrot Rock for Rs. 500/day.'
    ],
    studentCategory: 'Semester Break',
  },
]

export const initialWishlistPlaces = [
  {
    id: 'w1',
    name: 'Pidurangala Sunrise Rock',
    destination: 'Sigiriya, Sri Lanka',
    cover: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?w=1200&q=80',
    description: 'Budget dawn hike facing the world-famous Sigiriya Rock. Incredible 360-degree sunrise view with batchmates.',
    lat: 7.9575,
    lng: 80.7628,
    estimatedBudget: 18000,
    defaultStudents: 4,
    studentBudgetPerPerson: 4500,
    type: 'Semester Break Trek',
    transitMode: '🚌 Express Bus to Dambulla ➔ Tuk-tuk split with batchmates',
    studentPerk: '🎓 Pidurangala entry is only Rs. 1,000 (saves 90% compared to Lion Rock!)',
    bestSeason: 'August Semester Break',
    studentTips: [
      'Start climbing at 4:45 AM with phone torches to catch the first light.',
      'Wear good grip shoes - boulder climbing at the very top.',
      'Stay at a backpacker dorm in Sigiriya village for Rs. 2,200/night with breakfast.'
    ]
  },
  {
    id: 'w2',
    name: 'Knuckles Cloud Forest Camping',
    destination: 'Matale / Kandy, Sri Lanka',
    cover: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&q=80',
    description: 'High-altitude cloud forest hike & campfire stargazing with university batchmates and club members.',
    lat: 7.4667,
    lng: 80.7833,
    estimatedBudget: 21000,
    defaultStudents: 6,
    studentBudgetPerPerson: 3500,
    type: 'Batch Camping',
    transitMode: '🚆 Intercity Train to Kandy ➔ Deanston local bus',
    studentPerk: '🎓 Group student concession available for Forest Dept campsite permits',
    bestSeason: 'April / December Holidays',
    studentTips: [
      'Bring leech socks, rain covers, and dry firewood for the campfire.',
      'Split tent rentals from university outdoor equipment stores.',
      'Cook noodles and hot chocolate over a portable gas burner under the stars.'
    ]
  },
  {
    id: 'w3',
    name: "Adam's Peak (Sri Pada) Night Hike",
    destination: 'Hatton, Sri Lanka',
    cover: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80',
    description: 'Legendary night-time staircase trek through the clouds to witness the magical Ira Sevaya (solar sunrise) at 2,243m.',
    lat: 6.8096,
    lng: 80.4994,
    estimatedBudget: 14000,
    defaultStudents: 5,
    studentBudgetPerPerson: 2800,
    type: 'Pilgrimage & Hike',
    transitMode: '🚆 Night Mail Train to Hatton ➔ CTB Shuttle to Nallathanniya',
    studentPerk: '🎓 Free public mountain entry! Endless warm tea & sweet roti shacks all the way up',
    bestSeason: 'December - April (Season Peak)',
    studentTips: [
      'Start from Nallathanniya base at 1:00 AM to reach summit before 5:30 AM sunrise.',
      'Layer warm jackets; the wind at 2,243m elevation is freezing before dawn.',
      'Keep glucose packets and water bottles handy for the 5,000 stairs.'
    ]
  },
  {
    id: 'w4',
    name: 'Arugam Bay Surf & Chill',
    destination: 'Pottuvil, Sri Lanka',
    cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
    description: 'Post-exam beach escape. Cheap seaside cabanas, beginner surf board rentals, and relaxing beach bonfires with friends.',
    lat: 6.8415,
    lng: 81.8344,
    estimatedBudget: 32000,
    defaultStudents: 4,
    studentBudgetPerPerson: 8000,
    type: 'Post-Exam Beach',
    transitMode: '🚌 Highway Night Express Bus from Makumbura Multimodal Hub',
    studentPerk: '🎓 Surf shacks offer 30% group discounts for students on off-peak weekdays',
    bestSeason: 'July - September Break',
    studentTips: [
      'Rent surf boards together for 3-day group package deals.',
      'Eat at local roti stands and beach huts for budget meals.',
      'Rent shared bicycles to ride to Peanut Farm and Elephant Rock.'
    ]
  }
]

export const companionTypes = [
  { key: 'Batchmates', label: 'Batchmates / Uni Friends', emoji: '🎓' },
  { key: 'Roommates', label: 'Hostel Roommates', emoji: '🏠' },
  { key: 'Club', label: 'Uni Club / Society', emoji: '🏕️' },
  { key: 'Solo', label: 'Solo Student Wanderer', emoji: '🎒' },
  { key: 'Friends', label: 'Friends', emoji: '👥' },
  { key: 'Family', label: 'Family', emoji: '👨‍👩‍👧' },
  { key: 'Official', label: 'Study Tour / Internship', emoji: '💼' },
  { key: 'Other', label: 'Other', emoji: '✨' },
]

export const initialMemories = [
  {
    id: 'm1', tripId: 't1', title: 'Sunset at Ella Rock',
    photo: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=900&q=80',
    photos: [
      'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=900&q=80',
      'https://images.unsplash.com/photo-1546708973-b339540b5162?w=900&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=900&q=80',
    ],
    caption: 'One of the most beautiful sunsets I have ever seen.',
    location: 'Ella', date: '2026-03-16', mood: 'Adventurous', companionType: 'Friends', rating: 5, favourite: true,
  },
  {
    id: 'm2', tripId: 't1', title: 'Nine Arch Bridge, morning fog',
    photo: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=900&q=80',
    photos: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=900&q=80',
      'https://images.unsplash.com/photo-1546708973-b339540b5162?w=900&q=80',
      'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=900&q=80',
    ],
    caption: 'Waited forty minutes for a train that took ten seconds to cross.',
    location: 'Ella', date: '2026-03-17', mood: 'Peaceful', companionType: 'Solo', rating: 5, favourite: false,
  },
  {
    id: 'm3', tripId: 't2', title: 'Rampart walk',
    photo: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=900&q=80',
    photos: [
      'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=900&q=80',
      'https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?w=900&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80',
    ],
    caption: 'Lighthouse glowing gold, everyone slowed their pace without noticing.',
    location: 'Galle', date: '2026-08-03', mood: 'Relaxing', companionType: 'Family', rating: 4, favourite: true,
  },
  {
    id: 'm4', tripId: 't3', title: 'Tea pickers at first light',
    photo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=900&q=80',
    photos: [
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=900&q=80',
      'https://images.unsplash.com/photo-1563299796-17596ed6b017?w=900&q=80',
      'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?w=900&q=80',
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
    cover: 'https://images.unsplash.com/photo-1546708973-b339540b5162?w=1200&q=80',
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

export const travelTypes = ['Batch Trip', 'Campus Getaway', 'Semester Break', 'Budget Trek', 'Adventure', 'Relaxation', 'Nature', 'Photography', 'Beach', 'Cultural', 'Road Trip']
