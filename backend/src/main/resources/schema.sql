-- Reference schema for Travel Memories.
-- Hibernate (ddl-auto=update) will generate/evolve these tables automatically
-- from the JPA entities; this file documents the intended shape and can be
-- run manually if you prefer to manage the schema by hand.

CREATE TABLE IF NOT EXISTS users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  bio VARCHAR(280) DEFAULT 'Collecting moments, not things.',
  profile_photo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trips (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  name VARCHAR(150) NOT NULL,
  destination VARCHAR(150) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  cover_photo_url VARCHAR(500),
  description TEXT,
  travel_type VARCHAR(30) NOT NULL,
  budget DECIMAL(12,2) DEFAULT 0,
  rating TINYINT DEFAULT 0,
  is_favourite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_trips_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_trip_dates CHECK (end_date >= start_date),
  CONSTRAINT chk_trip_rating CHECK (rating BETWEEN 0 AND 5)
);

CREATE TABLE IF NOT EXISTS locations (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  trip_id BIGINT NOT NULL,
  name VARCHAR(150) NOT NULL,
  latitude DECIMAL(10,6) NOT NULL,
  longitude DECIMAL(10,6) NOT NULL,
  CONSTRAINT fk_locations_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS memories (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  trip_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  title VARCHAR(150) NOT NULL,
  location VARCHAR(150),
  memory_date DATE NOT NULL,
  description TEXT,
  mood VARCHAR(30),
  rating TINYINT DEFAULT 0,
  is_favourite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_memories_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  CONSTRAINT fk_memories_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_memory_rating CHECK (rating BETWEEN 0 AND 5)
);

CREATE TABLE IF NOT EXISTS memory_photos (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  memory_id BIGINT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  public_id VARCHAR(255) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_photos_memory FOREIGN KEY (memory_id) REFERENCES memories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS stories (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  trip_id BIGINT,
  user_id BIGINT NOT NULL,
  title VARCHAR(150) NOT NULL,
  cover_photo_url VARCHAR(500),
  location VARCHAR(150),
  story_date DATE,
  content LONGTEXT NOT NULL,
  tags VARCHAR(255),
  is_favourite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_stories_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE SET NULL,
  CONSTRAINT fk_stories_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS expenses (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  trip_id BIGINT NOT NULL,
  category VARCHAR(30) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  note VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_expenses_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  CONSTRAINT chk_expense_amount CHECK (amount > 0)
);

CREATE TABLE IF NOT EXISTS favourites (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  item_type VARCHAR(20) NOT NULL, -- TRIP | MEMORY | STORY | LOCATION
  item_id BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_favourites_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_favourite (user_id, item_type, item_id)
);
