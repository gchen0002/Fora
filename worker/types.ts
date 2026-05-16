export interface Env {
  DB: D1Database;
  ADMIN_INGEST_SECRET: string;
  CLERK_SECRET_KEY: string;
  FRONTEND_ORIGIN?: string;
}

export interface Profile {
  id: string;
  clerk_user_id: string;
  display_name: string | null;
  location_text: string | null;
  latitude: number | null;
  longitude: number | null;
  mileage_range: number | null;
  experience_level: string | null;
  remote_preference: string | null;
  cost_sensitivity: number;
  identity_tags: string;
  access_need_tags: string;
  interest_tags: string;
  goal_tags: string;
  created_at: string;
  updated_at: string;
}

export interface OpportunityRow {
  id: string;
  title: string;
  organization: string;
  description: string;
  url: string;
  source: string;
  category: string;
  location_text: string | null;
  latitude: number | null;
  longitude: number | null;
  is_remote: number;
  deadline: string | null;
  cost: string | null;
  eligibility_tags: string;
  accessibility_tags: string;
  topic_tags: string;
  experience_level_tags: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  description: string;
  url: string;
  source: string;
  category: string;
  locationText: string | null;
  latitude: number | null;
  longitude: number | null;
  isRemote: boolean;
  deadline: string | null;
  cost: string | null;
  eligibilityTags: string[];
  accessibilityTags: string[];
  topicTags: string[];
  experienceLevelTags: string[];
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StackOpportunity extends Opportunity {
  fitScore: number;
  matchReasons: string[];
}

export interface IngestOpportunity {
  id?: string;
  title: string;
  organization: string;
  description: string;
  url: string;
  source: string;
  category: string;
  location_text?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  is_remote?: boolean;
  deadline?: string | null;
  cost?: string | null;
  eligibility_tags?: string[];
  accessibility_tags?: string[];
  topic_tags?: string[];
  experience_level_tags?: string[];
  image_url?: string | null;
}
