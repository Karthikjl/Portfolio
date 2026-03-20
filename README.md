<div align="center">


**Retro Terminal Portfolio — React + Supabase + Vite**

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat-square&logo=supabase)
![GitHub Pages](https://img.shields.io/badge/Hosted-GitHub%20Pages-181717?style=flat-square&logo=github)

</div>

---

## What Is This

A hacker-aesthetic developer portfolio with a CRT terminal look, Tamil matrix rain / starfield background, sci-fi cursor, and a secure hidden admin panel to manage projects — all powered by Supabase as the backend, deployed on GitHub Pages with zero server costs.

---

## Features

- **Retro terminal UI** — scanlines, CRT vignette, glitch effects, Tamil character rain
- **Starfield + black hole** background — stars spiral into a vortex on the right edge
- **Admin panel** at `/#/admin` — hidden, secured with Supabase Auth
- **Project CRUD** — add, edit, delete, and reorder projects from the admin panel
- **Site settings** — change font and background type live from admin (no rebuild needed)
- **User BG toggle** — visitors can turn the background animation on/off (saved to localStorage)
- **Fully responsive** — works on mobile, tablet, and desktop
- **Security hardened** — URL sanitization, settings allowlist, login rate limiting, RLS policies

---

## Project Structure

```
portfolio/
├── public/
├── src/
│   ├── components/
│   │   ├── BootSequence.jsx      # Animated terminal boot screen
│   │   ├── CursorReticle.jsx     # Sci-fi targeting cursor
│   │   ├── MatrixRain.jsx        # Tamil matrix rain background
│   │   ├── ProjectCard.jsx       # Project display card
│   │   ├── ProjectReorder.jsx    # Drag & drop project ordering
│   │   ├── SiteSettings.jsx      # Admin font + bg settings UI
│   │   ├── StarField.jsx         # Starfield + blackhole background
│   │   ├── TerminalWindow.jsx    # Reusable terminal window widget
│   │   └── Toast.jsx             # Toast notification system
│   ├── lib/
│   │   ├── security.js           # URL sanitizer, rate limiter, settings validator
│   │   ├── supabase.js           # Supabase client
│   │   └── useSettings.js        # Site settings hook (font, background)
│   ├── pages/
│   │   ├── Admin.jsx             # Admin dashboard (auth protected)
│   │   └── Portfolio.jsx         # Public portfolio page
│   ├── styles/
│   │   └── terminal.css          # Global retro theme + responsive CSS
│   ├── App.jsx                   # Router setup
│   └── main.jsx                  # React entry point
├── .env.example                  # Environment variable template
├── .github/
│   └── workflows/
│       └── deploy.yml            # Auto-deploy to GitHub Pages on push
├── 404.html                      # SPA routing fix for GitHub Pages
├── index.html
├── package.json
└── vite.config.js
```

---

## Setup Guide

### 1. Prerequisites

```bash
node --version   # v18 or higher required
npm --version
git --version
```

### 2. Clone & Install

```bash
git clone https://github.com/Karthikjl/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
npm install
```

### 3. Set Up Supabase

**a.** Create a free project at [supabase.com](https://supabase.com)

**b.** Go to **SQL Editor** and run this to create the database:

```sql
-- Projects table
CREATE TABLE projects (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title         TEXT        NOT NULL,
  description   TEXT,
  live_url      TEXT,
  github_url    TEXT,
  tech_stack    TEXT[],
  thumbnail_url TEXT,
  status        TEXT        DEFAULT 'completed' CHECK (status IN ('completed', 'wip')),
  display_order INTEGER     DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings table
CREATE TABLE site_settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Enable Row Level Security
ALTER TABLE projects     ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public can read everything
CREATE POLICY "Public read projects"  ON projects      FOR SELECT USING (true);
CREATE POLICY "Public read settings"  ON site_settings FOR SELECT USING (true);

-- Only authenticated admin can write
CREATE POLICY "Auth insert projects"  ON projects      FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update projects"  ON projects      FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete projects"  ON projects      FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write settings"   ON site_settings FOR ALL   USING (auth.role() = 'authenticated');

-- Default settings
INSERT INTO site_settings (key, value) VALUES ('font',          'share-tech-mono');
INSERT INTO site_settings (key, value) VALUES ('matrix_preset', 'default');
INSERT INTO site_settings (key, value) VALUES ('bg_type',       'starfield');
```

**c.** Create your admin account — go to **Authentication → Users → Add User → Create New User**
- Use any email (e.g. `admin@portfolio.com`)
- Use a strong password (12+ characters)
- Check **Auto Confirm User**

**d.** Disable public signups — go to **Authentication → Settings** → turn off **Enable new user signups**

### 4. Configure Environment

```bash
cp .env.example .env
```

Open `.env` and fill in your credentials from **Supabase → Settings → API**:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

> ⚠️ Never commit `.env` — it is in `.gitignore`

### 5. Update Your Personal Info

Open `src/pages/Portfolio.jsx` and update the `ME` object at the top:

```js
const ME = {
  name:      'YOUR NAME',
  role:      'YOUR ROLE',
  location:  'Your City, Country',
  bio:       'Your bio here...',
  email:     'your@email.com',
  github:    'https://github.com/yourusername',
  linkedin:  'https://www.linkedin.com/in/yourprofile',
  available: true,
}
```

### 6. Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

Admin panel: [http://localhost:5173/#/admin](http://localhost:5173/#/admin)

---

## Deploy to GitHub Pages

### One-Time Setup

**1.** Push your code to GitHub:

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/Karthikjl/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

**2.** Add Supabase secrets to GitHub — go to repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |

**3.** Enable GitHub Pages — go to repo → **Settings → Pages → Source → GitHub Actions**

**4.** Every push to `main` automatically builds and deploys. Check progress under the **Actions** tab.

Your live site: `https://Karthikjl.github.io/YOUR_REPO_NAME/`

Admin panel: `https://Karthikjl.github.io/YOUR_REPO_NAME/#/admin`

---

## Admin Panel Guide

Access the hidden admin panel via the footer or directly at `/#/admin`.

### Projects Tab (`⌘ PROJECTS`)
| Action | How |
|---|---|
| Add project | Click **+ INSERT NEW PROJECT** |
| Edit project | Click **EDIT** on any project row |
| Delete project | Click **DELETE** → confirm |
| Required fields | Title only — everything else is optional |

### Reorder Tab (`⇅ REORDER`)
- **Drag and drop** rows to reorder
- **▲ ▼ buttons** for precise one-step movement (great on mobile)
- Click **SAVE ORDER** — public portfolio updates immediately

### Settings Tab (`⚙ SETTINGS`)
| Setting | Options |
|---|---|
| Background type | Starfield, Matrix Rain, Off |
| Matrix intensity | Subtle, Default, Intense, Storm |
| Font | 8 terminal fonts (Share Tech Mono, JetBrains Mono, Fira Code, etc.) |

Changes apply live to the public portfolio — no rebuild required.

---

## Customization

### Change Skills
Edit the `SKILLS` array in `src/pages/Portfolio.jsx`:
```js
const SKILLS = [
  { name: 'React',   level: 90, color: 'var(--cyan)'  },
  { name: 'Node.js', level: 85, color: 'var(--green)' },
  // add more...
]
```

### Change Boot Messages
Edit `BOOT_LINES` in `src/components/BootSequence.jsx`

### Change Colors
Edit CSS variables in `src/styles/terminal.css`:
```css
:root {
  --green:  #00ff41;   /* main accent */
  --cyan:   #00e5ff;   /* secondary */
  --amber:  #ffb000;   /* warning/highlight */
}
```

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite 5 | Build tool & dev server |
| React Router 6 | Client-side routing (HashRouter for GitHub Pages) |
| Supabase | Database + Auth backend |
| Google Fonts | Dynamic font loading |
| GitHub Actions | CI/CD pipeline |
| GitHub Pages | Static hosting |

---

## Security

- All URLs from database are sanitized — only `https://` and `http://` allowed
- Settings values validated against strict allowlist before applying to DOM
- Login rate limited — 5 attempts max, 2 minute lockout
- Supabase RLS — public users can only read, writes require authentication
- Public signups disabled — only manually created admin accounts work
- No secrets in source code — all credentials via environment variables

---

## License

MIT — feel free to fork and customize for your own portfolio.

---

<div align="center">
Built by <strong>Karthikeyan</strong> 
</div>