<div align="center">

```
██╗  ██╗ █████╗ ██████╗ ████████╗██╗  ██╗██╗██╗  ██╗███████╗██╗   ██╗ █████╗ ███╗   ██╗
██║ ██╔╝██╔══██╗██╔══██╗╚══██╔══╝██║  ██║██║██║ ██╔╝██╔════╝╚██╗ ██╔╝██╔══██╗████╗  ██║
█████╔╝ ███████║██████╔╝   ██║   ███████║██║█████╔╝ █████╗   ╚████╔╝ ███████║██╔██╗ ██║
██╔═██╗ ██╔══██║██╔══██╗   ██║   ██╔══██║██║██╔═██╗ ██╔══╝    ╚██╔╝  ██╔══██║██║╚██╗██║
██║  ██╗██║  ██║██║  ██║   ██║   ██║  ██║██║██║  ██╗███████╗   ██║   ██║  ██║██║ ╚████║
╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝
```

**Full Stack Developer | Unity Game Developer | Android Developer**

*Chennai, India*

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat-square&logo=supabase)
![GitHub Pages](https://img.shields.io/badge/Hosted-GitHub%20Pages-181717?style=flat-square&logo=github)
![Java](https://img.shields.io/badge/Java-Android-orange?style=flat-square&logo=android)
![Unity](https://img.shields.io/badge/Unity-Game%20Dev-black?style=flat-square&logo=unity)

</div>

---

## What Is This

A retro CRT terminal-style personal portfolio for **Karthikeyan** — a full stack, Android, and Unity game developer from Chennai. Built with a hacker aesthetic featuring Tamil character matrix rain, a starfield with a black hole vortex, sci-fi reticle cursor, and a fully secure hidden admin panel — all powered by Supabase and deployed on GitHub Pages with zero server costs.

---

## Features

- **Retro terminal UI** — CRT scanlines, vignette, glitch name effect with Tamil characters
- **Dual backgrounds** — Tamil matrix rain or starfield with black hole vortex (right edge)
- **Sci-fi reticle cursor** — targeting circle with RGB chromatic aberration on glitch
- **Boot sequence** — animated terminal startup on first visit
- **Admin panel** at `/#/admin` — hidden route, secured with Supabase Auth
- **Project CRUD** — add, edit, delete projects with title, description, links, tech stack, thumbnail
- **Drag & drop reorder** — reorder projects with drag or ▲▼ buttons, saves to Supabase
- **Live site settings** — change font, background type, animation intensity from admin — no rebuild
- **Scroll reveal animations** — 4 presets (None / Subtle / Medium / Heavy) controlled from admin
- **User BG toggle** — visitors can turn background animation on/off, saved to `localStorage`
- **Fully responsive** — mobile hamburger menu, tablet, desktop
- **Security hardened** — URL sanitization, settings allowlist, login rate limiting (5 attempts / 2min lockout), RLS policies

---

## Project Structure

```
portfolio/
├── src/
│   ├── components/
│   │   ├── BootSequence.jsx        # Terminal boot animation (runs once per session)
│   │   ├── CursorReticle.jsx       # Sci-fi targeting cursor with RGB split on glitch
│   │   ├── MatrixRain.jsx          # Tamil character matrix rain (3-layer depth)
│   │   ├── ProjectCard.jsx         # Project display card with expand/collapse
│   │   ├── ProjectReorder.jsx      # Drag & drop + arrow button project ordering
│   │   ├── SiteSettings.jsx        # Admin settings panel (bg, font, animations)
│   │   ├── StarField.jsx           # Starfield + black hole vortex background
│   │   ├── TerminalWindow.jsx      # Reusable macOS-style terminal window widget
│   │   └── Toast.jsx               # Toast notification system
│   ├── lib/
│   │   ├── security.js             # URL sanitizer, login rate limiter, settings validator
│   │   ├── supabase.js             # Supabase client
│   │   └── useSettings.js          # Live settings hook (font, bg, animations)
│   ├── pages/
│   │   ├── Admin.jsx               # Admin dashboard — Projects, Reorder, Settings tabs
│   │   └── Portfolio.jsx           # Public portfolio — Hero, Projects, About, Contact
│   ├── styles/
│   │   └── terminal.css            # Global retro theme, CSS variables, responsive
│   ├── App.jsx                     # HashRouter — / and /admin routes
│   └── main.jsx                    # React entry point
├── .env.example                    # Environment variable template
├── .github/workflows/deploy.yml    # GitHub Actions — auto deploy to Pages on push
├── 404.html                        # SPA routing fix for GitHub Pages
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

**b.** Go to **SQL Editor** and run this full setup:

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
ALTER TABLE projects      ENABLE ROW LEVEL SECURITY;
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
INSERT INTO site_settings (key, value) VALUES ('anim_preset',   'medium');
```

**c.** Create your admin account → **Authentication → Users → Add User → Create New User**
- Email: anything (e.g. `admin@portfolio.com`) — doesn't need to be real
- Password: 12+ characters, mix of symbols and numbers
- Check ✅ **Auto Confirm User**

**d.** Disable public signups → **Authentication → Settings** → turn off **Enable new user signups**

### 4. Configure Environment

```bash
cp .env.example .env
```

Fill in your credentials from **Supabase → Settings → API**:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

> ⚠️ Never commit `.env` — it is already in `.gitignore`

### 5. Customize Your Info

Open `src/pages/Portfolio.jsx` and update the `ME` object and `SKILLS` array at the top:

```js
const ME = {
  name:      'KARTHIKEYAN',
  role:      'Full Stack Developer | Unity Game Developer | Android Developer',
  location:  'Chennai, India',
  bio:       'Your bio here...',
  email:     'your@email.com',
  github:    'https://github.com/Karthikjl',
  linkedin:  'https://www.linkedin.com/in/karthikeyan-jl',
  available: true,
}

const SKILLS = [
  { name: 'React / Next.js', level: 90, color: 'var(--cyan)'  },
  { name: 'Node.js',         level: 85, color: 'var(--green)' },
  { name: 'Java / Android',  level: 88, color: 'var(--amber)' },
  { name: 'Unity / C#',      level: 82, color: 'var(--green)' },
  // add or remove skills here
]
```

### 6. Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

Admin panel: [http://localhost:5173/#/admin](http://localhost:5173/#/admin)

---

## Deploy to GitHub Pages

**1.** Push to GitHub:
```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/Karthikjl/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

**2.** Add secrets → repo **Settings → Secrets and variables → Actions**:

| Secret Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |

**3.** Enable Pages → **Settings → Pages → Source → GitHub Actions**

Every push to `main` auto-builds and deploys via GitHub Actions.

**Live site:** `https://Karthikjl.github.io/YOUR_REPO_NAME/`  
**Admin panel:** `https://Karthikjl.github.io/YOUR_REPO_NAME/#/admin`

---

## Admin Panel Guide

Access via the hidden link in the footer, or directly at `/#/admin`.

### ⌘ Projects Tab
| Action | How |
|---|---|
| Add project | **+ INSERT NEW PROJECT** |
| Edit project | **EDIT** on any row |
| Delete project | **DELETE** → confirm |
| Fields | Title (required), description, live URL, GitHub URL, tech stack, thumbnail URL, status |
| Status | `COMPLETED` = done and live · `WIP` = still in progress |

### ⇅ Reorder Tab
- **Drag rows** to any position using the dot handle
- **▲ ▼ buttons** for one-step movement (works great on mobile)
- **SAVE ORDER** saves to Supabase — public portfolio updates instantly

### ⚙ Settings Tab
| Setting | Options |
|---|---|
| Background | Starfield (black hole vortex), Matrix Rain (Tamil chars), Off |
| Matrix intensity | Subtle · Default · Intense · Storm |
| Animations | None · Subtle · Medium · Heavy |
| Font | Share Tech Mono · JetBrains Mono · Fira Code · IBM Plex Mono · Courier Prime · Source Code Pro · Space Mono · Inconsolata |

All changes apply live to the public portfolio — no rebuild required.

---

## Customization Reference

| What | Where |
|---|---|
| Name, bio, links | `ME` object in `src/pages/Portfolio.jsx` |
| Skills + levels | `SKILLS` array in `src/pages/Portfolio.jsx` |
| Boot messages | `BOOT_LINES` in `src/components/BootSequence.jsx` |
| Colors | CSS variables in `src/styles/terminal.css` |
| Nav items | `NAV_ITEMS` array in `src/pages/Portfolio.jsx` |

**Color variables:**
```css
:root {
  --green:  #00ff41;   /* main accent */
  --cyan:   #00e5ff;   /* secondary */
  --amber:  #ffb000;   /* highlight */
  --red:    #ff2244;   /* danger */
}
```

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite 5 | Build tool & dev server |
| React Router 6 | Client-side routing (HashRouter for GitHub Pages) |
| Supabase | PostgreSQL database + Auth backend |
| Google Fonts | Dynamic font loading (8 monospace options) |
| GitHub Actions | CI/CD — auto build and deploy on push |
| GitHub Pages | Static hosting (free) |

---

## Security

- URLs from database sanitized — only `https://` and `http://` allowed, blocks `javascript:` injection
- Settings values validated against strict allowlist before applying to DOM
- Login rate limited — 5 attempts max, 2 minute client-side lockout + Supabase server-side limits
- Supabase RLS — public users can only `SELECT`, writes require authentication
- Public signups disabled — only manually created admin accounts can log in
- No secrets in source — all credentials via environment variables, never committed

---

## License

MIT - free to fork, customize, and use for your own portfolio.

---

<div align="center">

Built by **Karthikeyan**

<sub>Designed & developed with the assistance of <a href="https://claude.ai">Claude AI</a> by Anthropic</sub>

</div>