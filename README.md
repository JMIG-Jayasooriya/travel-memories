# ✦ Travel Memories — Personal Digital Travel Journal

A modern, aesthetic digital travel scrapbook web application designed to curate trips, photo memories, interactive route maps, milestone stories, and travel expenses. Built with a rich vintage scrapbook aesthetic rather than a generic booking portal.

---

## 🌟 Key Features

### 1. 🏠 Public Landing Page with Action-Gating
- **Public Guest View**: Unsigned visitors are greeted by a full-screen scenic hero landing page (*"Every Journey Tells a Story"*).
- **Interactive Action-Gating**: Gated features (adding memories, viewing trips, favouriting polaroids) trigger an elegant **Auth Prompt Modal** offering:
  - ⚡ **1-Click Instant Demo Login** (Log in immediately as *Alex Rivera*)
  - 🔑 **Sign In with Credentials**
  - ✨ **Create Free Account**
- **Protected Routing**: Direct navigation to protected features is safely intercepted by `ProtectedRoute`.

### 2. 🌿 Authenticated Experience & Dynamic Hero
- Upon logging in, the home interface dynamically switches to a **new scenic cover picture** and personalized greeting (*"Welcome Back, {Name}"*).
- Displays real-time journal statistics (Places Visited, Total Trips, Memories, Favourites) and the scrapbook journal feed.

### 3. 🗺️ 6 Dedicated Feature Tabs & Separate Pages
Each core area of the application has its own dedicated page and top navigation tab:

| Tab | Route | Description |
|---|---|---|
| **Home** | `/` | Personalized dashboard, quick stats overview, and scrapbook memory feed |
| **Profile** | `/profile` | User avatar, editable bio/motto, journal metrics summary, and logout |
| **Trips** | `/trips` | Trip itineraries categorized by travel type (Beach, Hiking, City, Road Trip, etc.) |
| **Places Visited** | `/places-visited` | Interactive Leaflet world map with geocoded pins and destination cards |
| **Memories** | `/memories` | Scrapbook polaroid gallery with mood filters, real-time search, and detail modal |
| **Favourites** | `/favourites` | Curated showcase of starred trips, favourite polaroids, and long-form stories |

### 4. 📸 Rich Scrapbook Features
- **Interactive Memory Modal**: High-res photos, mood badges, ratings, locations, captions, and experience descriptions.
- **Trip Detail & Expense Management**: Track itinerary timelines, notes, ratings, and expense breakdowns per trip.
- **Offline Resilience**: Full offline fallback supporting local registrations, mock JWT generation, and persistent demo accounts.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS with custom design tokens (Forest, Cream, Clay, Paper, Ink)
- **Icons**: Lucide React
- **Mapping**: Leaflet & React-Leaflet (OpenStreetMap tiles)
- **State Management**: React Context (`TravelContext`) with session hydration and local storage fallback

### Backend
- **Framework**: Spring Boot 3.x with Java 17
- **Security**: Spring Security + Stateless JWT Token Authentication
- **Persistence**: Spring Data JPA / Hibernate
- **Database**: MySQL (with auto-evolving schema)

---

## 📁 Project Structure

```
travel-memories/
├── frontend/
│   ├── src/
│   │   ├── api/             # API client & auth services (JWT handler)
│   │   ├── components/      # UI components (Navbar, MemoryCard, MemoryModal, AuthPromptModal, etc.)
│   │   ├── context/         # TravelContext state, auth handlers, and data mutations
│   │   ├── data/            # Mock travel data, moods, and initial state
│   │   ├── pages/           # Separate page views:
│   │   │   ├── Home.jsx           # Landing / Dashboard
│   │   │   ├── Trips.jsx          # Curated Trips
│   │   │   ├── TripDetail.jsx     # Trip Timeline & Expenses
│   │   │   ├── PlacesVisited.jsx  # Leaflet Map & Destinations
│   │   │   ├── Memories.jsx       # Photo Gallery & Mood Filters
│   │   │   ├── Favourites.jsx     # Starred Items
│   │   │   ├── AddMemory.jsx      # Log New Memory
│   │   │   ├── CreateTrip.jsx     # Create Journey
│   │   │   ├── Profile.jsx        # User Profile & Bio
│   │   │   ├── Login.jsx          # Sign In & Demo Access
│   │   │   └── Register.jsx       # Create Account
│   │   ├── App.jsx          # Route definitions & layout structure
│   │   ├── index.css        # Custom CSS variables, typography & scrollbar styles
│   │   └── main.jsx         # App entry point
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/main/
│   │   ├── java/com/travelmemories/
│   │   │   ├── config/      # Security & CORS configuration
│   │   │   ├── controller/  # REST endpoints (AuthController, TripController)
│   │   │   ├── entity/      # JPA Entities (User, Trip, Memory, Story, Expense, Favourite)
│   │   │   ├── repository/  # Spring Data Repositories
│   │   │   └── service/     # Business logic & JWT services
│   │   └── resources/
│   │       ├── application.properties
│   │       └── schema.sql   # Relational database schema
│   └── pom.xml
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Frontend Setup (Works immediately out-of-the-box)

```bash
cd frontend
npm install
npm run dev
```

Open **`http://localhost:5173`** in your browser.

> [!TIP]
> **Demo Account**: You can sign in using **1-Click Instant Demo Login** on the login page or enter:
> - **Identifier**: `demo@travelmemories.com` or `demo`
> - **Password**: `password123`

---

### 2. Backend Setup (Optional for Full Database Persistence)

1. Create a MySQL database (e.g. `travel_memories`).
2. Configure your database credentials in `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/travel_memories?useSSL=false&serverTimezone=UTC
   spring.datasource.username=your_mysql_user
   spring.datasource.password=your_mysql_password
   ```
3. Run the Spring Boot application:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

---

## 🎨 Design Philosophy

- **Color Palette**:
  - `Cream` (`#F7F4EE`) — Warm, paper-like background.
  - `Forest` (`#1F3A2B`) — Deep pine green for headers, badges, and primary branding.
  - `Clay` (`#C46849`) — Terracotta accent for call-to-actions, timestamps, and badges.
  - `Paper` (`#FFFFFF`) — Crisp polaroid card surfaces with organic stamp shadows.
  - `Ink` (`#1D231F`) — Dark charcoal for high-contrast, readable typography.
- **Typography**:
  - Display: *Fraunces* (editorial serif)
  - Body: *Work Sans* / *Inter* (clean modern sans)
  - Accents: *Caveat* (handwritten captions and quotes)

---

## 📄 License
This project is open-source under the MIT License.
