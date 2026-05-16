# Fora Spec

## Concept

Fora is a TikTok-style opportunity discovery app for tech-access programs, scholarships, mentorship, hackathons, internships, fellowships, coding workshops, and communities.

Instead of making users search with the right keywords or already know the right networks, Fora gives them a limited daily stack of high-fit opportunities based on private opportunity preferences, access needs, goals, interests, and location range.

One-line pitch:

> Fora gives underrepresented tech learners 5 minutes a day to discover opportunities they would have missed.

Brand promise:

> A focused daily stack by default, with optional exploration when the user has more time.

Fora is not a generic directory or infinite feed. It is a lightweight daily ritual for finding tech education, career, and community opportunities without needing insider knowledge.

## Track Fit

Primary submission track:

> Improving Access to the Tech Field

The product should be pitched as a way to break down structural barriers in tech by helping underrepresented and nontraditional learners discover education, career, and community opportunities they would otherwise miss.

### Improving Access to the Tech Field

Fora helps underrepresented and nontraditional people discover tech opportunities they may not already know how to find:

- women-in-tech programs
- beginner-friendly hackathons
- scholarships and grants
- internship/job prep
- mentorship events
- resume/interview workshops
- local meetups and student org events

This is the strongest fit because the app expands access to tech education, careers, and communities.

### Accessible, Equitable, & Inclusive Tech

This is a secondary framing and design principle, not the main submission track.

The recommendation system prioritizes access and belonging, not just keywords:

- remote availability
- distance/mileage range
- cost/free status
- beginner friendliness
- childcare support
- transportation support
- disability accommodations
- language accessibility
- code of conduct / safer-space signals
- identity-focused eligibility
- first-gen, low-income, rural, LGBTQ+, disabled, caregiver, parent, and nontraditional learner support

The app uses inclusive technology to solve an access-to-tech problem. It should only be submitted under this track if the team pivots the project toward auditing or redesigning biased technology systems themselves.

### Heart Health at Warp Speed

This is a secondary fit unless the product is scoped toward women/postpartum health resources. If included, VenusFeed can recommend:

- local heart-health screenings
- pregnancy/postpartum care resources
- maternal health events
- support groups
- blood pressure education programs
- free or low-cost clinics

For the hackathon, the product should target Improving Access to the Tech Field unless the team intentionally builds a health-specific version.

## Core User Flow

1. User signs in.
2. User creates a private opportunity preference and access-needs profile.
3. User sets interests, goals, and location/mileage preferences.
4. App shows a limited daily stack of 5-10 matched opportunities.
5. Each opportunity explains why it matched.
6. User can save, dismiss, share, or apply.
7. User can open Explore More to browse beyond the daily stack, including out-of-range or lower-match opportunities.
8. Saved opportunities can be organized into playlists.

## Product Features

### Platform

Fora should be built as a mobile-first web app/PWA, not a native iOS app.

Reasoning:

- The team is developing on Windows.
- Judges can open a URL immediately.
- Cloudflare Pages deployment is simple.
- The product can still feel app-like through a phone-sized responsive interface.
- Native iOS would add simulator, signing, device, and deployment complexity that does not help the MVP.

The prototype should be designed primarily for a mobile viewport, while still working acceptably on desktop.

Recommended demo setup:

- deploy to Cloudflare Pages
- open the URL in a desktop browser
- present it in a phone-sized responsive layout or browser mobile mode
- optionally let judges open the same URL on their phones

### First-Time User Experience

The first-time experience should be:

```txt
Landing page
  -> Clerk login/sign-up
  -> onboarding
  -> daily stack
  -> done for today
  -> explore more / saved
```

#### Landing Page

The landing page should be short and product-focused, not a long marketing site.

Primary copy:

> Fora
>
> 5 minutes a day to find tech opportunities you would have missed.

Primary actions:

- Get started
- View demo, optional

The first viewport should show a small preview of the daily stack so users immediately understand the product.

#### Auth

Use Clerk for login/sign-up.

Recommended options:

- Google sign-in
- email sign-in

After sign-up, redirect users to onboarding if they do not already have a profile.

#### Onboarding

Do not send new users directly to the feed. The daily stack needs preferences to feel personalized.

Step 1:

> What are you looking for?

Options:

- hackathons
- scholarships/grants
- internships/fellowships
- mentorship
- coding workshops
- tech communities
- resume/interview prep

Step 2:

> Show me opportunities designed for...

Options:

- women in tech
- nonbinary people in tech
- beginner coders
- first-gen students
- low-income students
- LGBTQ+ technologists
- disabled technologists
- Black, Latine, Indigenous technologists
- career switchers
- student founders
- caregivers/parents in tech

Step 3:

> What support matters to you?

Options:

- free
- remote
- beginner-friendly
- no experience required
- mentorship included
- travel support
- evening/weekend friendly
- childcare support
- application fee waived

Step 4:

> Where should we look?

Fields:

- location
- mileage range
- include remote opportunities toggle

Final action:

- Build my stack

#### Daily Stack Entry

After onboarding, users should land on their daily stack, not a generic dashboard.

The first stack should make personalization obvious by showing hardcoded tag-based reasons on each card.

#### Done For Today

After the user reaches the end of the daily stack, show a simple completion state:

> You're done for today.
>
> Want to keep looking?

Actions:

- Explore more
- View saved

### Daily Stack

The daily stack should feel like short-form discovery rather than a search directory.

The main experience should be limited to 5-10 high-fit opportunities per day. This supports the product promise: 5 minutes a day to discover tech opportunities the user would have missed.

Each card/post includes:

- title
- organization
- short description
- location or remote badge
- deadline countdown
- cost/free badge
- eligibility tags
- accessibility/access tags
- topic tags
- fit score
- "Why this matches you"
- save button
- share button
- apply/open link button

### Explore More

Explore More is a secondary mode for users who want to keep browsing after the daily stack.

It can include:

- out-of-range opportunities
- remote opportunities outside the user's mileage range
- lower match score opportunities
- stretch opportunities
- different focus areas
- later-deadline opportunities

Explore More should use gentle labels rather than rejection language:

- Outside your mileage range
- Lower match
- Stretch opportunity
- Different focus area
- Advanced experience level

### Profile

The profile should be private by default. Avoid making the app feel like it is reducing users to demographics.

Onboarding should ask:

> Show me opportunities designed for...

Examples:

- women in tech
- nonbinary people in tech
- beginner coders
- first-gen students
- low-income students
- LGBTQ+ technologists
- disabled technologists
- Black, Latine, Indigenous technologists
- career switchers
- student founders
- caregivers/parents in tech

Then separately ask:

> What support matters to you?

Examples:

- free
- remote
- beginner-friendly
- mentorship included
- no experience required
- travel support
- childcare support
- evening/weekend friendly
- application fee waived

Recommended profile fields:

- opportunity preference tags, optional and private
- access need tags, optional and private
- interests, such as AI, design, cybersecurity, health tech, startups
- goals, such as internship, mentorship, scholarship, hackathon, community, beginner learning
- experience level
- remote preference
- mileage range
- location
- deadline urgency preference
- cost sensitivity
- accessibility needs

### Matching

Use simple weighted scoring for the prototype. No ML is required.

Priority order:

1. Eligibility/community fit
2. Access needs
3. Interests/goals
4. Location/mileage
5. Deadline urgency

Deadline urgency should boost relevant opportunities, not override poor fit.

Example factors:

- tag match: +3
- explicit access need supported: +4
- topic interest match: +2
- beginner-friendly match: +2
- within mileage range: +3
- remote and user prefers remote: +3
- free/low-cost and user marked cost-sensitive: +2
- deadline soon: +1 to +3 depending on urgency
- already dismissed: hide or strongly down-rank

The product should expose recommendation transparency:

> Shown because: beginner-friendly, women-focused, remote, free, deadline in 5 days.

For the MVP, "why this?" reasons should be generated from hardcoded structured tags, not freeform AI text. This keeps the product safer, faster, more consistent, and easier to debug.

Example reason labels:

```ts
const WHY_LABELS = {
  "beginner-friendly": "beginner-friendly",
  "free": "free",
  "remote": "remote",
  "mentorship-included": "includes mentorship",
  "women-focused": "designed for women in tech",
  "first-gen-friendly": "first-gen friendly",
  "no-experience-required": "no experience required",
  "travel-support": "offers travel support",
  "scholarship-eligible": "has funding available",
  "nearby": "near you",
};
```

Daily Stack should show only why something was included. Exclusion or lower-fit labels should be reserved for Explore More.

### Playlists

Users can save opportunities into lists:

- Apply this week
- Bring friends
- Beginner-friendly
- Funding
- Near me
- Health resources

### Friend Mode

Users can share opportunities with friends using a "this is so you" interaction.

Potential hackathon version:

- copy/share link
- send to another demo user
- team playlist

## Auth Recommendation: Clerk

Clerk is a strong choice for a hackathon because it gives polished auth quickly:

- hosted sign-in/sign-up UI
- social login
- session management
- user profile metadata
- good React/Next.js integration
- less time spent building auth plumbing

Recommended use:

- Store basic auth identity in Clerk.
- Store app-specific profile data in the app database.
- Use Clerk user ID as the foreign key in `profiles`, `saves`, and `dismissals`.

Do not store sensitive inclusion/access profile data only in Clerk metadata if the app needs richer querying, matching, or privacy controls. Keep those fields in the database.

### Clerk + Cloudflare Note

Clerk can work with Cloudflare-hosted frontends, but the exact integration depends on the framework:

- Next.js on Cloudflare may need adapter/runtime care.
- Vite/React on Cloudflare Pages is usually simpler.
- Cloudflare Workers APIs should verify Clerk sessions/JWTs before returning user-specific data.

For a fast build, use:

- React/Vite + Clerk React SDK on Cloudflare Pages
- Cloudflare Worker API with Clerk JWT verification
- D1 or Supabase for data

## Data Model

### users

Usually represented by Clerk, not duplicated heavily.

Important field:

- `clerk_user_id`

### profiles

- `id`
- `clerk_user_id`
- `display_name`
- `location_text`
- `latitude`
- `longitude`
- `mileage_range`
- `experience_level`
- `remote_preference`
- `cost_sensitivity`
- `identity_tags`
- `access_need_tags`
- `interest_tags`
- `goal_tags`
- `created_at`
- `updated_at`

### opportunities

- `id`
- `title`
- `organization`
- `description`
- `url`
- `source`
- `category`
- `location_text`
- `latitude`
- `longitude`
- `is_remote`
- `deadline`
- `cost`
- `eligibility_tags`
- `accessibility_tags`
- `topic_tags`
- `experience_level_tags`
- `image_url`
- `created_at`
- `updated_at`

### user_opportunity_actions

- `id`
- `clerk_user_id`
- `opportunity_id`
- `action`
- `playlist_name`
- `created_at`

Actions:

- `save`
- `dismiss`
- `share`
- `applied`

## Backend Options

### Recommended Hackathon Stack

- Frontend: React + Vite on Cloudflare Pages
- API: Cloudflare Workers with Hono
- Auth: Clerk
- Database: Cloudflare D1
- ORM/query layer: Drizzle ORM or hand-written SQL
- Optional storage/cache: Cloudflare KV for lightweight cached feed snapshots
- Scraper/Ingestion: Crawlee/Playwright run outside the main request-time Worker

This is the recommended Cloudflare-first stack. It keeps the app deployable on one primary platform, avoids Supabase, and is realistic for a hackathon if the schema stays small.

Use Cloudflare Workers for:

- authenticated API routes that should not run directly in the browser
- admin ingestion endpoints
- matching logic if the team wants to hide scoring details from the client
- proxying external APIs

Do not run heavy scraping inside the normal request-time Worker. Keep scraping as a local script, GitHub Action, or separate hosted job.

### Stack Decision Matrix

| Stack | Ease | Best for | Tradeoff |
| --- | --- | --- | --- |
| React + Vite + Clerk + Workers/Hono + D1 | Medium | Cloudflare-first hackathon build | More backend/database wiring than Supabase |
| React + Vite + Clerk + Workers/Hono + Neon | Medium | Postgres with Cloudflare frontend/API | Adds a separate database provider |
| React + Vite + Clerk + Convex | Easy-medium | Fast reactive app logic | Not Cloudflare-first backend |
| React + Vite + Clerk + Supabase + Cloudflare Pages | Easy | Fast DB/dashboard experience | Uses Supabase, which the team does not prefer |
| Next.js + Clerk + Supabase on Vercel | Easy | Fastest Clerk/Next integration | Not Cloudflare-first |
| Firebase + Firebase Auth + Firestore | Easy | Simple realtime/no-SQL app | Drops Clerk and SQL-style querying |
| Full custom backend on Render/Railway + Postgres | Medium-hard | More control and scraper flexibility | More deployment and ops surface |

### Recommended Path

Use this unless there is a strong reason not to:

1. React + Vite frontend.
2. Deploy frontend to Cloudflare Pages.
3. Use Clerk for sign-in/session management.
4. Use a Cloudflare Worker with Hono for API routes.
5. Use D1 for `profiles`, `opportunities`, and `user_opportunity_actions`.
6. Verify Clerk JWTs in the Worker before returning user-specific data.
7. Run matching in the Worker so the frontend stays simple.
8. Local or GitHub Actions scraper writes into D1 through an admin-only Worker endpoint.

This gives the team a coherent Cloudflare-first architecture while keeping the app small enough to finish.

### Cloudflare Limits Plan

The Cloudflare-first stack is realistic for this project, but the app should be designed to stay within free-tier limits during the hackathon.

Important current limits to plan around:

- Workers Free: 100,000 requests/day.
- Workers Free: 10 ms CPU time per HTTP request.
- Workers Free: 50 external subrequests per invocation.
- Workers Free: 1,000 subrequests to Cloudflare internal services per invocation.
- D1 Free: 5 million rows read/day.
- D1 Free: 100,000 rows written/day.
- D1 Free: 5 GB total storage.
- Cloudflare Browser Rendering Free: 10 minutes/day.

These limits are enough for the user-facing MVP if queries are small and indexed. They are not enough for broad browser-based scraping.

Design rules:

- Keep matching queries bounded with `LIMIT`.
- Do not run `SELECT *` over the full opportunities table.
- Add indexes for common filters: category, deadline, remote status, location fields, and updated time.
- Store tags as JSON/text for MVP, but keep the candidate set small before scoring in TypeScript.
- Fetch a candidate pool, score it in the Worker, then return only the daily stack.
- Cache anonymous/public opportunity reads where possible.
- Do not call external URLs from `/api/daily-stack`.
- Do not run Playwright/Crawlee inside request-time Workers.

Suggested `/api/daily-stack` shape:

1. Verify Clerk JWT.
2. Read user profile.
3. Query a bounded candidate pool from D1, for example 50-100 opportunities.
4. Score candidates in Worker memory.
5. Return 5-10 cards.

Suggested `/api/explore-more` shape:

1. Verify Clerk JWT.
2. Accept cursor/filter parameters.
3. Query a bounded candidate pool with lower match constraints.
4. Return paginated results.

### Limits-Safe Scraper Plan

The scraper should be treated as an ingestion pipeline, not a live request path.

Recommended approach:

1. Seed 30-100 opportunities manually first.
2. Add a local `npm run ingest` script that uses Crawlee/Playwright or simple fetch parsing.
3. The script writes normalized records to D1 through an admin-only Worker endpoint or Wrangler/D1 command.
4. If time allows, move the same script to GitHub Actions for manual or scheduled runs.

Avoid:

- broad crawling
- browser rendering for every source
- scraping during user feed requests
- relying on Cloudflare Browser Rendering as the main scraper runtime

Cloudflare Browser Rendering can still be used for a small live demo scrape, but the free browser rendering limit is too tight to be the main ingestion strategy.

Scraper source priority:

1. Manual seed data.
2. RSS, ICS, public APIs, public Google Sheets, or GitHub lists.
3. Static HTML fetch + Cheerio.
4. Crawlee/Playwright for one or two targeted JavaScript-heavy sources.
5. Cloudflare Browser Rendering only for a tiny optional demo path.

### When To Choose Neon Instead

Choose Neon if the team wants Postgres instead of D1 while keeping the frontend and API on Cloudflare.

Use:

- Cloudflare Pages
- Cloudflare Workers with Hono
- Clerk
- Neon Postgres
- Drizzle ORM
- Neon serverless driver or Cloudflare Hyperdrive

Pros:

- real Postgres
- strong SQL ecosystem
- easier migration path if the app grows
- works with Workers through documented integrations

Cons:

- another provider to configure
- more connection/runtime details than D1
- less "single-platform" than D1

### When To Choose Convex Instead

Choose Convex if the team wants the fastest app-development loop and is willing to move backend state out of Cloudflare.

Use:

- React + Vite
- Clerk
- Convex for database, backend functions, and reactive data
- Cloudflare Pages or Vercel for frontend hosting

Pros:

- very fast product iteration
- nice reactive data model
- less manual API wiring
- good for prototypes

Cons:

- not fully Cloudflare
- different mental model from SQL
- more platform lock-in than D1/Neon
- scraper ingestion still needs a separate path

### When To Choose Next.js Instead

Choose Next.js only if the team already knows it well or wants Clerk's most common integration path.

Recommended Next.js stack:

- Next.js
- Clerk
- Supabase
- Vercel

This is probably the fastest full-stack web app path, but it moves away from the original Cloudflare hosting goal. Cloudflare can run Next.js with extra adapter/runtime care, but that is not the easiest hackathon route.

### Cloudflare D1

Pros:

- native Cloudflare integration
- simple SQL
- good fit for Workers
- nice for hackathon-scale structured data

Cons:

- less batteries-included than Supabase
- auth/profile policies need to be implemented manually
- geospatial querying may require simple manual distance calculations

### Supabase

Pros:

- fast Postgres setup
- nice dashboard
- easy tables and API
- good for relational data
- can work well with Clerk user IDs

Cons:

- another service to configure
- free projects may pause after inactivity
- auth should be handled carefully if using Clerk instead of Supabase Auth

## Scraper / Ingestion Strategy

The product should not try to scrape the entire internet during a hackathon. The realistic goal is:

1. Start with a manually seeded database of 30-100 opportunities.
2. Add one live ingestion pipeline.
3. Normalize scraped or pasted content into opportunity records.
4. Demonstrate that the feed updates from ingested data.

### Option A: Manual Seed Data

Difficulty: 2/10

Use JSON, CSV, D1 seed SQL, or Supabase table inserts.

Pros:

- fastest
- reliable demo
- enough to prove the product
- avoids spending the hackathon fighting websites

Cons:

- less technically impressive unless paired with ingestion

Best use:

- Always do this first.

### Option B: Admin URL Ingestion

Difficulty: 4/10

Build an admin-only page where a team member pastes a URL. The backend fetches the page, extracts text, and uses rules or AI to normalize it.

Pros:

- feels real
- avoids crawling the whole web
- easy to demo live
- keeps the dataset curated

Cons:

- some pages block fetches
- JavaScript-heavy pages may need Playwright

Best use:

- Best hackathon balance.

### Option C: Crawlee + Playwright

Difficulty: 5-7/10

Crawlee is an open-source crawling framework that can use Playwright under the hood. It handles queues, retries, datasets, and crawler structure better than raw Playwright.

Pros:

- strong open-source option
- good for multiple pages/sources
- supports JS-heavy websites through Playwright
- more production-like

Cons:

- more setup
- not ideal to run inside standard Cloudflare Workers
- crawler scope can balloon quickly

Best use:

- Run as a separate ingestion job, not as the request-time API.

### Option D: Raw Playwright

Difficulty: 5-7/10

Use Playwright directly for a few known sources.

Pros:

- great for dynamic sites
- can click, wait, render, and screenshot
- widely used

Cons:

- more fragile than API/RSS ingestion
- heavier runtime
- not a good fit for normal Cloudflare Worker request limits

Best use:

- One or two targeted sources.

### Option E: Scrapy

Difficulty: 5/10

Python-based scraper framework, best for static or mostly static pages.

Pros:

- mature
- fast
- great for structured HTML

Cons:

- less convenient for JavaScript-heavy pages
- separate Python deployment if the rest of the stack is JS/TS

Best use:

- If the team is more comfortable in Python.

### Option F: RSS / ICS / Public APIs

Difficulty: 3-5/10

Use sources that already expose structured data:

- event calendars
- RSS feeds
- ICS calendars
- public APIs
- public Google Sheets
- GitHub lists

Pros:

- much more reliable than scraping
- lower compute cost
- easier normalization

Cons:

- fewer sources
- source discovery takes time

Best use:

- Use as the "live source" if available.

## Scraper Hosting Options

### Local Script

Best for the hackathon.

Run `npm run ingest` locally, insert into D1/Supabase, and demo that new opportunities appear.

Pros:

- simplest
- no hosting surprises
- easy debugging

Cons:

- not fully automated

### GitHub Actions

Good free/cheap scheduled ingestion option.

Pros:

- can run Playwright/Crawlee
- can run on a schedule or manually
- avoids deploying a crawler server

Cons:

- schedule granularity and runtime limits
- secrets setup required
- not instant unless manually triggered

### Cloudflare Browser Run / Browser Rendering

Possible if the team wants to stay in Cloudflare.

Pros:

- Cloudflare-native browser automation
- compatible with Cloudflare's Playwright package
- good for small demos

Cons:

- free browser time is limited
- not suitable for broad crawling
- adds Cloudflare-specific implementation details

Best use:

- Small live demo scrape, not the main ingestion strategy.

### Railway / Render / Fly.io

Good for running Node crawler jobs if free/trial limits work for the team.

Pros:

- easier for normal Playwright/Crawlee than Workers
- can run scheduled jobs or small services

Cons:

- free tiers and trial credits change
- may sleep or require payment details
- extra deployment surface

Best use:

- If the team wants hosted scraping without GitHub Actions.

## AI Normalization

If using an LLM, the scraper can extract raw page text and convert it to structured JSON:

```json
{
  "title": "",
  "organization": "",
  "description": "",
  "deadline": "",
  "location": "",
  "remote": true,
  "eligibility_tags": [],
  "accessibility_tags": [],
  "topic_tags": [],
  "cost": "",
  "url": ""
}
```

This makes messy program pages easier to handle, but the app should still validate fields before inserting records.

## MVP Scope

Build these first:

- sign-in with Clerk
- private profile setup
- opportunity database with seed data
- daily stack UI
- Explore More mode
- save/dismiss actions
- matching score with "why this matches"
- one ingestion path, either admin URL ingestion or local Crawlee script

Cut if time is tight:

- video upload
- comments
- complex social graph
- broad web crawling
- real-time chat
- advanced ML recommendations

## Demo Script

1. Sign in as a beginner woman/nonbinary student interested in AI and design.
2. Set location and 25-mile range.
3. Select "Show me opportunities designed for..." preferences and access needs: beginner-friendly, free, remote/hybrid, mentorship.
4. Open the daily stack.
5. Show opportunity cards with hardcoded tag-based match explanations.
6. Change one onboarding/profile answer and show the stack update.
7. Save one opportunity to "Apply this week."
8. Open Explore More and show out-of-range or lower-match opportunities with gentle labels.
9. Share one opportunity with a friend.
10. If time allows, paste a new program URL into the admin ingestion flow and show it appearing in the matched stack.

## Risk Notes

- Avoid treating identity as a public label or ranking people by worthiness.
- Make profile fields optional.
- Explain recommendations transparently.
- Do not promise perfect scraping coverage.
- Do not claim medical advice if heart-health resources are included.
- Keep the ingestion pipeline curated enough that bad or irrelevant opportunities do not pollute the feed.
- Avoid infinite-feed dynamics in the main experience; the core promise is a limited daily stack.

## Recommended Build Order

1. Create seed data.
2. Build database schema.
3. Add Clerk auth.
4. Build profile setup.
5. Build daily stack UI.
6. Implement matching score.
7. Add save/dismiss.
8. Add Explore More.
9. Add admin ingestion.
10. Polish demo data and pitch.
