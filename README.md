# Travel Memories — Digital Travel Diary

A personal travel-diary web app: trips, photo memories, long-form stories,
a travel map, expenses, and favourites — built to feel like a scrapbook,
not a booking site.

```
travel-memories/
├── frontend/   React + Vite + Tailwind — fully working UI with mock data
└── backend/    Spring Boot + MySQL + JWT — real auth & trips API, schema for everything else
```

## Frontend (works immediately, no setup beyond npm)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. Everything is wired up and interactive —
create trips, add memories with mood/rating, write stories, log expenses,
favourite things, browse the Leaflet map — but state lives in React
context (`src/context/TravelContext.jsx`), not a database, so it resets
on refresh. Swapping in real data means replacing the functions in that
file with `axios` calls to the endpoints below.

Pages implemented: Home, My Journey (map), My Trips, Create Trip, Trip
Detail (with expenses), Memories (with filters), Add Memory, Stories,
Story Detail, Favourites, Profile, Login, Register, Dashboard.

## Backend

```bash
cd backend
# create a MySQL database and update src/main/resources/application.properties
mvn spring-boot:run
```

Implemented end-to-end with real JWT auth and validation:
- `POST /api/auth/register`, `POST /api/auth/login`
- `GET/POST/PUT/DELETE /api/trips` (and `/api/trips/{id}`) — scoped to
  the logged-in user via the JWT, rejects `endDate < startDate`

`schema.sql` defines the full data model from the spec (users, trips,
locations, memories, memory_photos, stories, expenses, favourites) and
`spring.jpa.hibernate.ddl-auto=update` will create/evolve these tables
from the JPA entities automatically — you don't need to run the SQL by
hand unless you want to.

**Entities and repositories exist for every table** (Memory, Story,
Expense, Favourite, MemoryPhoto). Only `TripController` and
`AuthController` are wired up as full REST controllers, as a reference
implementation — `MemoryController`, `StoryController`,
`ExpenseController`, and `FavouriteController` follow the exact same
pattern (scope every query to `@AuthenticationPrincipal AuthenticatedUser`,
validate the DTO, 404 if the owner doesn't match) and are the natural
next files to add.

Not included (flagged so nothing is silently missing): Cloudinary photo
upload wiring (the `MemoryPhoto` table and `cloudinary.*` properties are
ready for it), and password-reset email flow for "Forgot password."

## Design

Warm cream/forest-green/clay palette per the brief, Fraunces for display
type, Work Sans for body text, and a hand-written accent face (Caveat)
for captions — leaning into the "scrapbook" instruction rather than a
generic travel-brand look. Photo cards get a slight rotation and
straighten on hover, like items pinned to a page.
