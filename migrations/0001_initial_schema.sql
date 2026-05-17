CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  clerk_user_id TEXT NOT NULL UNIQUE,
  display_name TEXT,
  location_text TEXT,
  latitude REAL,
  longitude REAL,
  mileage_range INTEGER,
  experience_level TEXT,
  remote_preference TEXT,
  cost_sensitivity INTEGER NOT NULL DEFAULT 0,
  identity_tags TEXT NOT NULL DEFAULT '[]',
  access_need_tags TEXT NOT NULL DEFAULT '[]',
  interest_tags TEXT NOT NULL DEFAULT '[]',
  goal_tags TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS opportunities (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL,
  category TEXT NOT NULL,
  location_text TEXT,
  latitude REAL,
  longitude REAL,
  is_remote INTEGER NOT NULL DEFAULT 0,
  deadline TEXT,
  cost TEXT,
  eligibility_tags TEXT NOT NULL DEFAULT '[]',
  accessibility_tags TEXT NOT NULL DEFAULT '[]',
  topic_tags TEXT NOT NULL DEFAULT '[]',
  experience_level_tags TEXT NOT NULL DEFAULT '[]',
  image_url TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_opportunity_actions (
  id TEXT PRIMARY KEY,
  clerk_user_id TEXT NOT NULL,
  opportunity_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('save', 'dismiss', 'share', 'applied')),
  playlist_name TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (opportunity_id) REFERENCES opportunities(id)
);

CREATE INDEX IF NOT EXISTS idx_opportunities_category ON opportunities(category);
CREATE INDEX IF NOT EXISTS idx_opportunities_deadline ON opportunities(deadline);
CREATE INDEX IF NOT EXISTS idx_opportunities_remote ON opportunities(is_remote);
CREATE INDEX IF NOT EXISTS idx_opportunities_updated_at ON opportunities(updated_at);
CREATE INDEX IF NOT EXISTS idx_actions_user_action ON user_opportunity_actions(clerk_user_id, action);
CREATE INDEX IF NOT EXISTS idx_actions_opportunity ON user_opportunity_actions(opportunity_id);
