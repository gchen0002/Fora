<div align="center">
  <img src="public/fora-logo.png" alt="Fora Logo" width="450" />
  
  <h3>Find your place in tech.</h3>
  <p>A daily stack of hackathons, scholarships, and communities matched to your goals.</p>

  ---

  <h2>🚀 <a href="https://fora-app.pages.dev/" target="_blank"><strong>Access the Fora App Here</strong></a> 🚀</h2>

  ---
</div>

## 👋 Welcome to Fora

Fora is a platform designed to break down barriers in tech. We help early-career individuals and learners discover the right opportunities—from hackathons to mentorship programs—by delivering a curated, TikTok-style feed directly to you. 

Whether you're exploring the codebase as a developer or just checking out the app, we're glad you're here!

---

## 💻 For Developers: Running Locally

If you're a GitHub user wanting to build or test the code, follow these quick steps:

### Prerequisites
- **Node.js** (v18+)
- **npm** (comes with Node)

### Installation & Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   *(Make sure to fill in your Clerk API keys and other secrets in `.env.local`!)*

3. **Run the local server**
   ```bash
   npm run dev
   ```
   The app will typically start at `http://localhost:5173`.

### Backend & Database (Cloudflare Workers + D1)
Fora uses Cloudflare Workers for its API. To run the backend locally:
```bash
npm run worker:dev
```
To run local database migrations:
```bash
npm run db:migrate:local
```

---

## 🛠️ Tech Stack
- **Frontend:** React 19, React Router, Vite, Tailwind CSS, Framer Motion
- **Backend:** Cloudflare Workers, Hono
- **Database:** Cloudflare D1 (SQLite)
- **Auth:** Clerk
