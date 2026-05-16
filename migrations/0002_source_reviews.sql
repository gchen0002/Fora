CREATE TABLE IF NOT EXISTS opportunity_source_reviews (
  id TEXT PRIMARY KEY,
  submitted_url TEXT NOT NULL,
  canonical_url TEXT,
  source TEXT NOT NULL,
  title TEXT,
  decision TEXT NOT NULL CHECK (decision IN ('accept', 'quarantine', 'reject')),
  relevance_score INTEGER NOT NULL DEFAULT 0,
  source_trust_score INTEGER NOT NULL DEFAULT 0,
  parse_confidence INTEGER NOT NULL DEFAULT 0,
  risk_flags TEXT NOT NULL DEFAULT '[]',
  notes TEXT,
  raw_summary TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_source_reviews_decision ON opportunity_source_reviews(decision);
CREATE INDEX IF NOT EXISTS idx_source_reviews_source ON opportunity_source_reviews(source);
CREATE INDEX IF NOT EXISTS idx_source_reviews_canonical_url ON opportunity_source_reviews(canonical_url);
