import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase.js'
import { useSettings } from '../lib/useSettings.js'
import ProjectCard from '../components/ProjectCard.jsx'
import MatrixRain from '../components/MatrixRain.jsx'
import StarField from '../components/StarField.jsx'
import BootSequence from '../components/BootSequence.jsx'
import TerminalWindow from '../components/TerminalWindow.jsx'
import CursorReticle from '../components/CursorReticle.jsx'


// ── CONFIG — update these ─────────────────────────────
const ME = {
  name: 'KARTHIKEYAN',
  role: 'Full Stack Developer | Unity Game Developer | Android Developer',
  location: 'Chennai, India',
  bio: 'I am a passionate developer focused on building real-world applications and interactive games. With experience in Java, Android, Unity, and backend systems, I enjoy turning ideas into functional and efficient solutions.Currently exploring advanced system design, game mechanics, and scalable applications.',
  email: 'kar333thic@gmail.com',
  github: 'https://github.com/Karthikjl',
  linkedin: 'https://www.linkedin.com/in/karthikeyan-jl',
  available: true,
}

const SKILLS = [
  { name: 'React / Next.js', level: 90, color: 'var(--cyan)' },
  { name: 'Node.js', level: 85, color: 'var(--green)' },
  { name: 'JavaScript / TS', level: 88, color: 'var(--green)' },
  { name: 'Python', level: 75, color: 'var(--amber)' },
  { name: 'PostgreSQL', level: 80, color: 'var(--cyan)' },
  { name: 'Supabase', level: 85, color: 'var(--green)' },
  { name: 'Docker / Linux', level: 70, color: 'var(--amber)' },
  { name: 'CSS / Tailwind', level: 82, color: 'var(--cyan)' },
]

const NAV_ITEMS = ['PROJECTS', 'ABOUT', 'CONTACT']
const GLITCH_CHARS = 'அஆஇஈஉஊஎஏஐஒஓஔகசஜஞடணதநபமயரலவழளறன0123456789█▓▒░'

// ── GLITCH TEXT ───────────────────────────────────────
function GlitchText({ text, style }) {
  const [display, setDisplay] = useState(text)
  const [glitching, setGlitching] = useState(false)

  useEffect(() => {
    const schedule = () => {
      const delay = 4000 + Math.random() * 5000
      setTimeout(() => {
        setGlitching(true)
        let frame = 0
        const id = setInterval(() => {
          setDisplay(text.split('').map(c =>
            c === ' ' ? ' ' : Math.random() < 0.3
              ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)] : c
          ).join(''))
          if (++frame >= 12) {
            clearInterval(id)
            setDisplay(text)
            setGlitching(false)
          }
        }, 55)
        schedule()
      }, delay)
    }
    schedule()
  }, [text])

  return (
    <div style={{ ...style, position: 'relative', filter: glitching ? 'hue-rotate(80deg)' : 'none', transition: 'filter 0.05s' }}>
      {/* Original text always in layout — invisible when glitching, keeps size stable */}
      <span style={{ visibility: glitching ? 'hidden' : 'visible' }}>{text}</span>

      {/* Glitch overlay — position absolute so it NEVER affects layout */}
      {glitching && (
        <span aria-hidden="true" style={{
          position: 'absolute', top: 0, left: 0,
          whiteSpace: 'nowrap', overflow: 'hidden',
          width: '100%',
          color: 'inherit',
        }}>
          {display}
        </span>
      )}

      {/* RGB split layers */}
      {glitching && (
        <>
          <div style={{ position: 'absolute', inset: 0, color: 'var(--cyan)', clipPath: 'inset(30% 0 50% 0)', transform: 'translateX(-5px)', opacity: 0.6, pointerEvents: 'none', overflow: 'hidden' }}>{text}</div>
          <div style={{ position: 'absolute', inset: 0, color: 'var(--red)', clipPath: 'inset(55% 0 15% 0)', transform: 'translateX(4px)', opacity: 0.5, pointerEvents: 'none', overflow: 'hidden' }}>{text}</div>
        </>
      )}
    </div>
  )
}

// ── SKILL BAR ─────────────────────────────────────────
function SkillBar({ name, level, color, index }) {
  const [animated, setAnimated] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setAnimated(true) }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} style={{ marginBottom: '1rem', animation: `scanIn 0.4s ease ${index * 0.06}s both` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--green-dim)', letterSpacing: '0.08em' }}>{name}</span>
        <span style={{ fontFamily: 'var(--font-vt)', fontSize: '1rem', color: 'var(--muted)' }}>{level}%</span>
      </div>
      <div style={{ height: '3px', background: 'var(--border)', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, height: '100%',
          background: color, boxShadow: `0 0 8px ${color}`,
          width: animated ? `${level}%` : '0%',
          transition: `width 1.3s cubic-bezier(0.4,0,0.2,1) ${index * 0.09}s`,
        }} />
      </div>
    </div>
  )
}

// ── SECTION HEADER ────────────────────────────────────
function SectionHeader({ label, sub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
      <div style={{ fontFamily: 'var(--font-orb)', fontSize: '0.75rem', color: 'var(--green)', letterSpacing: '0.3em', textShadow: '0 0 8px var(--green)', whiteSpace: 'nowrap' }}>
        &gt;_ {label}
      </div>
      <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, var(--border), transparent)' }} />
      {sub && <div style={{ fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.15em', whiteSpace: 'nowrap' }}>[{sub}]</div>}
    </div>
  )
}

// ── TYPEWRITER ────────────────────────────────────────
function useTypewriter(text, speed = 28, delay = 0) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => {
      let i = 0
      const id = setInterval(() => {
        setDisplayed(text.slice(0, ++i))
        if (i >= text.length) { clearInterval(id); setDone(true) }
      }, speed)
      return () => clearInterval(id)
    }, delay)
    return () => clearTimeout(t)
  }, [text])
  return { displayed, done }
}

// ── PORTFOLIO ─────────────────────────────────────────
export default function Portfolio() {
  const [booted, setBooted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [activeSection, setActiveSection] = useState('PROJECTS')
  const [time, setTime] = useState('')
  const [uptime, setUptime] = useState(0)
  const startTime = useRef(Date.now())
  const { displayed: bioTyped, done: bioDone } = useTypewriter(ME.bio, 22, 600)
  const { matrixConfig, settings } = useSettings()
  const bgType = settings['bg_type'] || 'starfield'

  // User-side local preference — overrides admin global setting
  const [matrixOn, setMatrixOn] = useState(() => {
    const stored = localStorage.getItem('matrix_bg')
    return stored === null ? true : stored === 'true'
  })
  const toggleMatrix = () => {
    const next = !matrixOn
    setMatrixOn(next)
    localStorage.setItem('matrix_bg', String(next))
  }

  useEffect(() => {
    const tick = () => {
      setTime(new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC')
      setUptime(Math.floor((Date.now() - startTime.current) / 1000))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => { if (booted) fetchProjects() }, [booted])

  async function fetchProjects() {
    setLoading(true)
    const { data, error } = await supabase.from('projects').select('*').order('display_order', { ascending: true }).order('created_at', { ascending: false })
    if (!error) setProjects(data || [])
    setLoading(false)
  }

  const filtered = filter === 'ALL' ? projects : projects.filter(p => p.status === filter.toLowerCase())

  const scrollTo = (id) => {
    setActiveSection(id)
    setMenuOpen(false)
    document.body.classList.remove('mobile-nav-open')
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const toggleMenu = () => {
    const next = !menuOpen
    setMenuOpen(next)
    document.body.classList.toggle('mobile-nav-open', next)
  }

  const fmt = (s) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  if (!booted) return <BootSequence onComplete={() => setBooted(true)} />

  return (
    <div className="no-cursor" style={{ position: 'relative', minHeight: '100vh' }}>
      <CursorReticle />

      {matrixOn && bgType === 'starfield' && <StarField opacity={matrixConfig.opacity} speed={matrixConfig.speed} density={matrixConfig.density} glowIntensity={matrixConfig.glowIntensity} />}
      {matrixOn && bgType === 'matrix' && <MatrixRain opacity={matrixConfig.opacity} speed={matrixConfig.speed} density={matrixConfig.density} glowIntensity={matrixConfig.glowIntensity} />}

      {/* MATRIX USER TOGGLE */}
      <button
        onClick={toggleMatrix}
        title={matrixOn ? 'Turn off starfield' : 'Turn on starfield'}
        style={{
          position: 'fixed', bottom: '1.5rem', left: '1.5rem',
          zIndex: 200,
          background: matrixOn ? 'rgba(0,255,65,0.1)' : 'rgba(10,10,10,0.9)',
          border: `1px solid ${matrixOn ? 'var(--green)' : 'var(--border)'}`,
          color: matrixOn ? 'var(--green)' : 'var(--muted)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.62rem',
          letterSpacing: '0.12em',
          padding: '0.45rem 0.9rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: matrixOn ? '0 0 12px var(--green-glow)' : 'none',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}
      >
        <span style={{
          display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
          background: matrixOn ? 'var(--green)' : 'var(--muted)',
          boxShadow: matrixOn ? '0 0 6px var(--green)' : 'none',
          transition: 'all 0.2s',
        }} />
        {matrixOn ? 'BG ON' : 'BG OFF'}
      </button>

      {/* TOPBAR */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(10,10,10,0.97)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(12px)',
        height: '56px',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, var(--green), var(--cyan), var(--green), transparent)', opacity: 0.7 }} />
        <div style={{ maxWidth: 1400, margin: '0 auto', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.2rem' }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '28px', height: '28px', border: '1px solid var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: 'var(--green)', boxShadow: '0 0 8px var(--green-glow)', flexShrink: 0 }}>{'>'}_</div>
            <div>
              <div style={{ fontFamily: 'var(--font-orb)', fontSize: '0.75rem', color: 'var(--green)', letterSpacing: '0.2em', textShadow: '0 0 10px var(--green)', lineHeight: 1 }}>KARTHIKEYAN</div>
              <div style={{ fontSize: '0.48rem', color: 'var(--muted)', letterSpacing: '0.15em', marginTop: '0.15rem' }}>Software Engineer</div>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="desktop-nav" style={{ display: 'flex', gap: '0', border: '1px solid var(--border)' }}>
            {NAV_ITEMS.map((item, i) => (
              <button key={item} onClick={() => scrollTo(item)} style={{
                background: activeSection === item ? 'rgba(0,255,65,0.08)' : 'transparent',
                border: 'none', borderRight: i < NAV_ITEMS.length - 1 ? '1px solid var(--border)' : 'none',
                fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
                color: activeSection === item ? 'var(--green)' : 'var(--muted)',
                cursor: 'pointer', letterSpacing: '0.18em',
                textShadow: activeSection === item ? '0 0 8px var(--green)' : 'none',
                transition: 'all 0.15s', padding: '0.5rem 1.4rem',
                display: 'flex', alignItems: 'center', gap: '0.4rem',
              }}>
                {activeSection === item && <span style={{ color: 'var(--green)', fontSize: '0.5rem' }}>■</span>}
                {item}
              </button>
            ))}
          </nav>

          {/* Desktop status */}
          <div className="desktop-status" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.1em' }}>SESSION</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--green-dim)', fontFamily: 'var(--font-mono)' }}>{fmt(uptime)}</div>
            </div>
            <div style={{ width: '1px', height: '24px', background: 'var(--border)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="dot" style={{ background: ME.available ? 'var(--green)' : 'var(--red)', boxShadow: `0 0 8px ${ME.available ? 'var(--green)' : 'var(--red)'}`, animation: 'pulseBorder 2s ease infinite' }} />
              <div>
                <div style={{ fontSize: '0.55rem', color: ME.available ? 'var(--green)' : 'var(--red)', letterSpacing: '0.12em', lineHeight: 1 }}>{ME.available ? 'ACTIVE' : 'INACTIVE'}</div>
                {/* <div style={{ fontSize: '0.45rem', color: 'var(--muted)', letterSpacing: '0.1em', marginTop: '0.1rem' }}>FOR WORK</div> */}
              </div>
            </div>
          </div>

          {/* Mobile right — status dot + hamburger — hidden on desktop via CSS */}
          <div className="hamburger-wrap" style={{ alignItems: 'center', gap: '0.8rem' }}>
            <span className="dot" style={{ background: ME.available ? 'var(--green)' : 'var(--red)', boxShadow: `0 0 6px ${ME.available ? 'var(--green)' : 'var(--red)'}` }} />
            <button className={`hamburger${menuOpen ? ' active' : ''}`} onClick={toggleMenu} aria-label="Menu">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav overlay */}
      <div className={`mobile-nav${menuOpen ? ' open' : ''}`}>
        {NAV_ITEMS.map(item => (
          <button key={item} onClick={() => scrollTo(item)} style={{
            background: 'none', border: 'none',
            fontFamily: 'var(--font-orb)', fontSize: '1.8rem',
            color: activeSection === item ? 'var(--green)' : 'var(--muted)',
            cursor: 'pointer', letterSpacing: '0.2em',
            textShadow: activeSection === item ? '0 0 15px var(--green)' : 'none',
            transition: 'all 0.2s', padding: '0.5rem 2rem',
          }}>
            {activeSection === item && <span style={{ color: 'var(--green)', fontSize: '1rem', marginRight: '0.5rem' }}>›</span>}
            {item}
          </button>
        ))}
        <div style={{ fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.12em', marginTop: '1rem' }}>
          UP {fmt(uptime)}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '88px 2rem 5rem' }}>

        {/* HERO */}
        <section style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: '2rem' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--muted)', letterSpacing: '0.15em', marginBottom: '1.2rem' }}>
            <span style={{ color: 'var(--green-dim)' }}>root</span>
            <span style={{ color: 'var(--muted)' }}>@</span>
            <span style={{ color: 'var(--cyan)' }}>karthikeyan</span>
            <span style={{ color: 'var(--muted)' }}>:~$ </span>
            <span style={{ color: 'var(--white)' }}>whoami</span>
          </div>

          <GlitchText text={ME.name} style={{
            fontFamily: 'var(--font-vt)',
            fontSize: 'clamp(4rem, 12vw, 9rem)',
            lineHeight: 0.9,
            color: 'var(--green)',
            textShadow: '0 0 20px var(--green), 0 0 60px var(--green-dim)',
            letterSpacing: '0.04em',
            marginBottom: '0.7rem',
          }} />

          <div style={{
            fontFamily: 'var(--font-orb)', fontSize: 'clamp(0.65rem, 2vw, 0.95rem)',
            color: 'var(--amber)', letterSpacing: '0.35em',
            textShadow: '0 0 12px var(--amber)', marginBottom: '2.5rem',
          }}>
            // {ME.role}
          </div>

          <div style={{
            maxWidth: 580, fontSize: '0.83rem', color: 'var(--green-dim)',
            lineHeight: 1.95, borderLeft: '2px solid var(--green-dim)',
            paddingLeft: '1.2rem', marginBottom: '3rem', minHeight: '5rem',
          }}>
            <span style={{ color: 'var(--muted)' }}>&gt; </span>
            {bioTyped}
            {!bioDone && <span className="cursor" />}
          </div>

          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '4rem' }}>
            <button className="btn" onClick={() => scrollTo('PROJECTS')} style={{ padding: '0.75rem 2rem', fontSize: '0.8rem' }}>
              <span>⌘ Explore Work</span>
            </button>
            <button className="btn btn-amber" onClick={() => scrollTo('CONTACT')} style={{ padding: '0.75rem 2rem', fontSize: '0.8rem' }}>
              <span>⚡ Contact Me</span>
            </button>
            <a href={ME.github} target="_blank" rel="noopener noreferrer" className="btn btn-cyan"
              style={{ padding: '0.75rem 2rem', fontSize: '0.8rem', textDecoration: 'none' }}>
              <span>⌥ GITHUB</span>
            </a>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', flexWrap: 'wrap', border: '1px solid var(--border)' }}>
            {[
              { label: 'TOTAL PROJECTS', value: String(projects.length).padStart(2, '0'), color: 'var(--green)' },
              { label: 'COMPLETED', value: String(projects.filter(p => p.status === 'completed').length).padStart(2, '0'), color: 'var(--cyan)' },
              { label: 'IN PROGRESS', value: String(projects.filter(p => p.status === 'wip').length).padStart(2, '0'), color: 'var(--amber)' },
              { label: 'SESSION UPTIME', value: fmt(uptime), color: 'var(--green-dim)', small: true },
            ].map((s, i) => (
              <div key={s.label} style={{
                borderRight: i < 3 ? '1px solid var(--border)' : 'none',
                padding: '1.2rem 2rem', flex: '1 0 120px',
              }}>
                <div style={{
                  fontFamily: s.small ? 'var(--font-mono)' : 'var(--font-vt)',
                  fontSize: s.small ? '1.1rem' : '2.8rem',
                  color: s.color, lineHeight: 1,
                  textShadow: `0 0 10px ${s.color}`, marginBottom: '0.5rem',
                }}>{s.value}</div>
                <div style={{ fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.18em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <section id="PROJECTS" style={{ paddingBottom: '6rem', scrollMarginTop: '60px' }}>
          <SectionHeader label="PROJECTS" sub={`${filtered.length} RECORDS`} />
          <div style={{ display: 'flex', gap: '0', marginBottom: '2rem', border: '1px solid var(--border)', width: 'fit-content' }}>
            {['ALL', 'COMPLETED', 'WIP'].map((f, i) => (
              <button key={f} onClick={() => setFilter(f)} style={{
                background: filter === f ? 'var(--green)' : 'transparent',
                border: 'none', borderRight: i < 2 ? '1px solid var(--border)' : 'none',
                color: filter === f ? 'var(--black)' : 'var(--muted)',
                fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
                padding: '0.45rem 1.2rem', cursor: 'pointer',
                letterSpacing: '0.12em', transition: 'all 0.15s',
              }}>{f}</button>
            ))}
          </div>

          {loading ? (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', color: 'var(--green-dim)', padding: '4rem 0' }}>
              <div className="loader" />
              <span style={{ fontSize: '0.82rem', letterSpacing: '0.12em' }}>QUERYING DATABASE...</span>
            </div>
          ) : filtered.length === 0 ? (
            <TerminalWindow title="null_result.log" style={{ maxWidth: 420 }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 2 }}>
                <div><span style={{ color: 'var(--green-dim)' }}>&gt;</span> SELECT * FROM projects WHERE status = '{filter.toLowerCase()}';</div>
                <div style={{ color: 'var(--red)', marginTop: '0.5rem' }}>ERROR: 0 rows returned.</div>
              </div>
            </TerminalWindow>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(360px, 100%), 1fr))',
              gap: '1rem',
            }}>
              {filtered.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          )}
        </section>

        {/* ABOUT */}
        <section id="ABOUT" style={{ paddingBottom: '6rem', scrollMarginTop: '60px' }}>
          <SectionHeader label="ABOUT" sub="SYSTEM INFO" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)' }}>
            <TerminalWindow title="identity.json" style={{ border: 'none', background: 'var(--panel)' }}>
              <div style={{ fontSize: '0.8rem', lineHeight: 2.2 }}>
                <div style={{ color: 'var(--muted)', marginBottom: '0.5rem' }}>{'{'}</div>
                {[
                  ['name', `"${ME.name}"`, 'var(--amber)'],
                  ['location', `"${ME.location}"`, 'var(--white)'],
                  ['role', `"${ME.role}"`, 'var(--cyan)'],
                  ['available', ME.available ? 'true' : 'false', ME.available ? 'var(--green)' : 'var(--red)'],
                ].map(([k, v, c]) => (
                  <div key={k} style={{ paddingLeft: '1.2rem', display: 'flex', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span style={{ color: 'var(--cyan)' }}>"{k}"</span>
                    <span style={{ color: 'var(--muted)' }}>:</span>
                    <span style={{ color: c }}>{v}</span>
                    <span style={{ color: 'var(--muted)' }}>,</span>
                  </div>
                ))}
                <div style={{ color: 'var(--muted)', marginTop: '0.3rem' }}>{'}'}</div>
              </div>
            </TerminalWindow>
            <div style={{ padding: '1.2rem', background: 'var(--panel)' }}>
              <div style={{ fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.15em', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="dot dot-amber" /> SKILLS.SYS — CAPABILITY MATRIX
              </div>
              {SKILLS.map((s, i) => <SkillBar key={s.name} {...s} index={i} />)}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="CONTACT" style={{ paddingBottom: '5rem', scrollMarginTop: '60px' }}>
          <SectionHeader label="CONTACT" sub="OPEN CHANNEL" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)' }}>
            <TerminalWindow title="connect.sh" style={{ border: 'none', background: 'var(--panel)' }}>
              <div style={{ fontSize: '0.8rem', lineHeight: 2.6 }}>
                {[
                  { label: 'EMAIL', href: `mailto:${ME.email}`, display: ME.email, color: 'var(--green)' },
                  { label: 'GITHUB', href: ME.github, display: 'github.com/Karthikjl', color: 'var(--cyan)' },
                  { label: 'LINKEDIN', href: ME.linkedin, display: 'in/karthikeyan-jl', color: 'var(--amber)' },
                ].map(({ label, href, display, color }) => (
                  <div key={label} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--muted)', minWidth: '80px', fontSize: '0.65rem', letterSpacing: '0.1em' }}>{label}</span>
                    <a href={href} target="_blank" rel="noopener noreferrer"
                      style={{ color, textDecoration: 'none', fontSize: '0.78rem' }}
                      onMouseEnter={e => e.target.style.textShadow = `0 0 10px ${color}`}
                      onMouseLeave={e => e.target.style.textShadow = 'none'}
                    >{display}</a>
                  </div>
                ))}
              </div>
            </TerminalWindow>
            <div style={{ padding: '1.5rem', background: 'var(--panel)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--green-dim)', lineHeight: 1.9, marginBottom: '1.5rem' }}>
                <span style={{ color: 'var(--muted)' }}>&gt; </span>
                Ready to collaborate on apps, systems, and games.
                Let’s build something impactful.
                Response time: 24 hours.
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <a href={`mailto:${ME.email}`} className="btn btn-cyan" style={{ textDecoration: 'none', padding: '0.6rem 1.4rem', fontSize: '0.75rem' }}>
                  <span>⚡ SEND MESSAGE</span>
                </a>
                <a href={ME.github} target="_blank" rel="noopener noreferrer" className="btn" style={{ textDecoration: 'none', padding: '0.6rem 1.4rem', fontSize: '0.75rem' }}>
                  <span>⌥ GITHUB</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer style={{
        position: 'relative', zIndex: 1,
        borderTop: '1px solid var(--border)',
        background: 'rgba(10,10,10,0.97)',
        fontFamily: 'var(--font-mono)',
      }}>
        <div style={{
          maxWidth: 1400, margin: '0 auto',
          padding: '1.2rem 2.5rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '1rem',
        }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.12em' }}>
            © {new Date().getFullYear()} KARTHIKEYAN — ALL RIGHTS RESERVED
          </span>
          {/* Hidden admin link */}
          <a href="#/admin" style={{ color: 'transparent', textDecoration: 'none', userSelect: 'none', fontSize: '0.5rem' }} title="">⠀⠀</a>
        </div>
      </footer>
    </div>
  )
}