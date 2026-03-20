import React, { useState, useEffect } from 'react'
import { checkLoginAllowed, recordLoginAttempt, getRemainingAttempts } from '../lib/security.js'
import { supabase } from '../lib/supabase.js'
import ToastContainer, { useToast } from '../components/Toast.jsx'
import SiteSettings from '../components/SiteSettings.jsx'
import ProjectReorder from '../components/ProjectReorder.jsx'
import { useSettings } from '../lib/useSettings.js'

const EMPTY_FORM = {
  title: '',
  description: '',
  live_url: '',
  github_url: '',
  tech_stack: '',
  thumbnail_url: '',
  status: 'completed',
}

// ── LOGIN SCREEN ─────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [typed, setTyped] = useState('')
  const [lockout, setLockout] = useState(() => checkLoginAllowed())
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    const msg = 'RESTRICTED ACCESS — CREDENTIALS REQUIRED'
    let i = 0
    const id = setInterval(() => {
      setTyped(msg.slice(0, i))
      i++
      if (i > msg.length) clearInterval(id)
    }, 40)
    return () => clearInterval(id)
  }, [])

  // Countdown timer during lockout
  useEffect(() => {
    if (!lockout.allowed) {
      setCountdown(lockout.remaining)
      const id = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(id)
            setLockout(checkLoginAllowed())
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(id)
    }
  }, [lockout.allowed])

  async function handleLogin(e) {
    e.preventDefault()
    const check = checkLoginAllowed()
    if (!check.allowed) {
      setLockout(check)
      return
    }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      recordLoginAttempt(false)
      const remaining = getRemainingAttempts()
      setError(`${error.message}${remaining > 0 ? ` — ${remaining} attempt${remaining === 1 ? '' : 's'} remaining` : ''}`)
      const newCheck = checkLoginAllowed()
      if (!newCheck.allowed) setLockout(newCheck)
    } else {
      recordLoginAttempt(true)
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--black)', fontFamily: 'var(--font-mono)', padding: '1rem',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-vt)', fontSize: '3.5rem',
            color: 'var(--red)', textShadow: '0 0 20px var(--red)',
            letterSpacing: '0.1em', marginBottom: '0.5rem',
          }}>
            ⚠ ACCESS DENIED
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--muted)', letterSpacing: '0.12em', minHeight: '1.2em' }}>
            {typed}<span className="cursor" style={{ fontSize: '0.72rem' }} />
          </div>
        </div>

        {/* Panel */}
        <div style={{
          border: '1px solid var(--border)',
          background: 'var(--panel)',
          padding: '2rem',
          animation: 'pulseBorder 3s ease infinite',
        }}>
          <div className="panel-header">
            <span className="dot dot-red" />
            <span>AUTHENTICATE :: ADMIN TERMINAL</span>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.15em', marginBottom: '0.4rem' }}>
                USER_ID
              </label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value.trim())}
                placeholder="admin@yourdomain.com"
                required
                autoComplete="username"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck="false"
                inputMode="email"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.15em', marginBottom: '0.4rem' }}>
                PASSKEY
              </label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div style={{
                border: '1px solid var(--red)', padding: '0.6rem 0.8rem',
                color: 'var(--red)', fontSize: '0.75rem', background: 'rgba(255,34,68,0.05)',
              }}>
                &gt; ERROR: {error}
              </div>
            )}

            {!lockout.allowed && (
              <div style={{
                border: '1px solid var(--red)', padding: '0.8rem',
                color: 'var(--red)', fontSize: '0.75rem', background: 'rgba(255,34,68,0.08)',
                textAlign: 'center', letterSpacing: '0.1em',
              }}>
                ⚠ LOCKED OUT — RETRY IN {countdown}s
              </div>
            )}

            <button
              type="submit"
              className="btn btn-amber"
              disabled={loading || !lockout.allowed}
              style={{ marginTop: '0.5rem', padding: '0.75rem', width: '100%', opacity: !lockout.allowed ? 0.5 : 1 }}
            >
              <span>
                {!lockout.allowed ? `[ LOCKED — ${countdown}s ]` : loading ? '[ AUTHENTICATING... ]' : '[ AUTHENTICATE → ]'}
              </span>
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <a href="#/" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '0.7rem', letterSpacing: '0.12em' }}>
            ← RETURN TO PORTFOLIO
          </a>
        </div>
      </div>
    </div>
  )
}

// ── PROJECT FORM ──────────────────────────────────────
function ProjectForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const payload = {
      ...form,
      tech_stack: form.tech_stack
        ? form.tech_stack.split(',').map(t => t.trim()).filter(Boolean)
        : [],
    }

    let result
    if (initial?.id) {
      result = await supabase.from('projects').update(payload).eq('id', initial.id)
    } else {
      result = await supabase.from('projects').insert([payload])
    }

    if (result.error) {
      setError(result.error.message)
    } else {
      onSave()
    }
    setLoading(false)
  }

  const fields = [
    { key: 'title', label: 'PROJECT TITLE', type: 'text', placeholder: 'My Awesome Project', required: true },
    { key: 'live_url', label: 'LIVE URL', type: 'url', placeholder: 'https://myproject.com' },
    { key: 'github_url', label: 'GITHUB URL', type: 'url', placeholder: 'https://github.com/username/repo' },
    { key: 'thumbnail_url', label: 'THUMBNAIL URL', type: 'url', placeholder: 'https://img.url/thumbnail.png' },
    { key: 'tech_stack', label: 'TECH STACK (comma separated)', type: 'text', placeholder: 'React, Node.js, Supabase' },
  ]

  return (
    <div style={{
      border: '1px solid var(--border)',
      background: 'var(--panel)',
      padding: '1.5rem',
      animation: 'scanIn 0.3s ease',
    }}>
      <div className="panel-header">
        <span className="dot dot-amber" />
        <span>{initial?.id ? 'EDIT PROJECT' : 'NEW PROJECT'}</span>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {fields.map(f => (
          <div key={f.key}>
            <label style={{ display: 'block', fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.15em', marginBottom: '0.3rem' }}>
              {f.label}
            </label>
            <input
              className="input"
              type={f.type}
              value={form[f.key]}
              onChange={e => set(f.key, e.target.value)}
              placeholder={f.placeholder}
              required={f.required}
            />
          </div>
        ))}

        <div>
          <label style={{ display: 'block', fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.15em', marginBottom: '0.3rem' }}>
            DESCRIPTION
          </label>
          <textarea
            className="input"
            value={form.description}
            onChange={e => set('description', e.target.value)}
            placeholder="Describe the project, what it does, why you built it..."
            rows={4}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>
            STATUS
          </label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {['completed', 'wip'].map(s => (
              <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem' }}>
                <input
                  type="radio"
                  name="status"
                  value={s}
                  checked={form.status === s}
                  onChange={() => set('status', s)}
                  style={{ accentColor: 'var(--green)' }}
                />
                <span style={{ color: s === 'completed' ? 'var(--green)' : 'var(--amber)', letterSpacing: '0.1em', fontSize: '0.75rem' }}>
                  {s === 'completed' ? '■ COMPLETED' : '◌ IN PROGRESS'}
                </span>
              </label>
            ))}
          </div>
        </div>

        {error && (
          <div style={{ border: '1px solid var(--red)', padding: '0.6rem', color: 'var(--red)', fontSize: '0.75rem' }}>
            &gt; ERROR: {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
          <button type="submit" className="btn btn-cyan" disabled={loading} style={{ padding: '0.6rem 1.5rem' }}>
            <span>{loading ? '[ SAVING... ]' : initial?.id ? '[ UPDATE ]' : '[ INSERT ]'}</span>
          </button>
          <button type="button" onClick={onCancel} className="btn" style={{ padding: '0.6rem 1.5rem' }}>
            <span>[ CANCEL ]</span>
          </button>
        </div>
      </form>
    </div>
  )
}

// ── ADMIN DASHBOARD ───────────────────────────────────
function AdminDashboard() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editProject, setEditProject] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [userEmail, setUserEmail] = useState('')
  const [activeTab, setActiveTab] = useState('projects')
  const [reordering, setReordering] = useState(false)
  const { settings, saveSetting } = useSettings()
  const { toast } = useToast()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserEmail(data?.user?.email || ''))
    fetchProjects()
  }, [])

  async function fetchProjects() {
    setLoading(true)
    const { data } = await supabase.from('projects').select('*').order('display_order', { ascending: true }).order('created_at', { ascending: false })
    setProjects(data || [])
    setLoading(false)
  }

  async function handleDelete(id) {
    await supabase.from('projects').delete().eq('id', id)
    setDeleteConfirm(null)
    toast('PROJECT DELETED', 'warn')
    fetchProjects()
  }

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', fontFamily: 'var(--font-mono)', padding: '0' }}>
      <ToastContainer />

      {/* Top bar */}
      <div style={{
        borderBottom: '1px solid var(--border)',
        background: 'rgba(10,10,10,0.98)',
        padding: '0 1.5rem',
        height: '50px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className="dot dot-amber" style={{ animation: 'pulseBorder 2s infinite' }} />
          <span style={{ fontFamily: 'var(--font-orb)', fontSize: '0.7rem', color: 'var(--amber)', letterSpacing: '0.2em' }}>
            ADMIN TERMINAL
          </span>
          <span style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>
            — {userEmail}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <a href="#/" style={{ color: 'var(--muted)', fontSize: '0.65rem', textDecoration: 'none', letterSpacing: '0.12em' }}>
            ← PUBLIC SITE
          </a>
          <button onClick={handleLogout} className="btn btn-red" style={{ padding: '0.3rem 0.8rem', fontSize: '0.65rem' }}>
            <span>LOGOUT</span>
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '1.5rem 1rem' }}>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: '0', marginBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
          {[
            { id: 'projects', label: '⌘ PROJECTS', color: 'var(--amber)' },
            { id: 'reorder',  label: '⇅ REORDER',  color: 'var(--green)' },
            { id: 'settings', label: '⚙ SETTINGS', color: 'var(--cyan)' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              background: 'none', border: 'none',
              borderBottom: activeTab === tab.id ? `2px solid ${tab.color}` : '2px solid transparent',
              color: activeTab === tab.id ? tab.color : 'var(--muted)',
              fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
              padding: '0.75rem 1.5rem', cursor: 'pointer',
              letterSpacing: '0.15em', transition: 'all 0.15s',
              textShadow: activeTab === tab.id ? `0 0 8px ${tab.color}` : 'none',
              marginBottom: '-1px',
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (<>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-vt)', fontSize: '2.5rem', color: 'var(--amber)', textShadow: '0 0 15px var(--amber)' }}>
              PROJECT MANAGER
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '0.2rem' }}>
              {projects.length} total / {projects.filter(p => p.status === 'completed').length} completed / {projects.filter(p => p.status === 'wip').length} WIP
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button className="btn btn-amber" onClick={() => { setEditProject(null); setShowForm(true) }} style={{ padding: '0.65rem 1.5rem' }}>
              <span>+ INSERT NEW PROJECT</span>
            </button>
            <button className="btn btn-green" onClick={() => setActiveTab('reorder')} style={{ padding: '0.65rem 1.2rem', borderColor: 'var(--green)', color: 'var(--green)', fontSize: '0.72rem' }}>
              <span>⇅ REORDER</span>
            </button>
          </div>
        </div>

        {/* Form */}
        {(showForm || editProject) && (
          <div style={{ marginBottom: '2rem' }}>
            <ProjectForm
              initial={editProject}
              onSave={() => { setShowForm(false); setEditProject(null); toast(editProject ? 'PROJECT UPDATED ✓' : 'PROJECT INSERTED ✓', 'success'); fetchProjects() }}
              onCancel={() => { setShowForm(false); setEditProject(null) }}
            />
          </div>
        )}

        {/* Projects table */}
        {loading ? (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', color: 'var(--green-dim)', padding: '2rem 0' }}>
            <div className="loader" />
            <span>LOADING DATABASE...</span>
          </div>
        ) : projects.length === 0 ? (
          <div style={{ color: 'var(--muted)', fontSize: '0.85rem', padding: '3rem 0', textAlign: 'center' }}>
            &gt; NO RECORDS FOUND. INSERT FIRST PROJECT.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {projects.map((project, i) => (
              <div
                key={project.id}
                className="admin-table-row"
                style={{
                  border: '1px solid var(--border)',
                  background: 'var(--panel)',
                  padding: '1.2rem 1rem',
                  display: 'flex', alignItems: 'center',
                  gap: '1rem', flexWrap: 'wrap',
                  animation: `scanIn 0.3s ease ${i * 0.05}s both`,
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--muted)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                {/* Index */}
                <span style={{ color: 'var(--muted)', fontSize: '0.7rem', minWidth: '30px' }}>
                  [{String(i + 1).padStart(2, '0')}]
                </span>

                {/* Status dot */}
                <span
                  className={project.status === 'completed' ? 'dot' : 'dot dot-amber'}
                  title={project.status}
                />

                {/* Title */}
                <div style={{ flex: 1, minWidth: 150 }}>
                  <div style={{ color: 'var(--white)', fontSize: '0.85rem', fontFamily: 'var(--font-orb)', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
                    {project.title}
                  </div>
                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                      {project.tech_stack.slice(0, 4).map(t => (
                        <span key={t} className="tag" style={{ fontSize: '0.58rem' }}>{t}</span>
                      ))}
                      {project.tech_stack.length > 4 && (
                        <span style={{ fontSize: '0.6rem', color: 'var(--muted)' }}>+{project.tech_stack.length - 4}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Created date */}
                <div style={{ fontSize: '0.65rem', color: 'var(--muted)', minWidth: 100 }}>
                  {new Date(project.created_at).toLocaleDateString()}
                </div>

                {/* Links */}
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                      className="btn btn-cyan" style={{ fontSize: '0.6rem', padding: '0.3rem 0.6rem', textDecoration: 'none' }}>
                      <span>LIVE</span>
                    </a>
                  )}
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                      className="btn" style={{ fontSize: '0.6rem', padding: '0.3rem 0.6rem', textDecoration: 'none' }}>
                      <span>SRC</span>
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn btn-amber"
                    style={{ fontSize: '0.65rem', padding: '0.35rem 0.8rem' }}
                    onClick={() => { setEditProject({ ...project, tech_stack: (project.tech_stack || []).join(', ') }); setShowForm(false) }}
                  >
                    <span>EDIT</span>
                  </button>

                  {deleteConfirm === project.id ? (
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className="btn btn-red" style={{ fontSize: '0.65rem', padding: '0.35rem 0.7rem' }}
                        onClick={() => handleDelete(project.id)}>
                        <span>CONFIRM</span>
                      </button>
                      <button className="btn" style={{ fontSize: '0.65rem', padding: '0.35rem 0.7rem' }}
                        onClick={() => setDeleteConfirm(null)}>
                        <span>CANCEL</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-red"
                      style={{ fontSize: '0.65rem', padding: '0.35rem 0.8rem' }}
                      onClick={() => setDeleteConfirm(project.id)}
                    >
                      <span>DELETE</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        </>)}

        {/* REORDER TAB */}
        {activeTab === 'reorder' && (
          <ProjectReorder
            projects={projects}
            toast={toast}
            onDone={() => { setActiveTab('projects'); fetchProjects() }}
          />
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <SiteSettings
            settings={settings}
            onSave={async (key, value) => {
              await saveSetting(key, value)
            }}
            onSaveComplete={() => toast('SETTINGS SAVED ✓', 'success')}
          />
        )}

      </div>
    </div>
  )
}

// ── ADMIN PAGE (auth gate) ────────────────────────────
export default function Admin() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setSession(session))
    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '1rem', color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>
        <div className="loader" />
        <span>INITIALIZING...</span>
      </div>
    )
  }

  if (!session) return <LoginScreen />
  return <AdminDashboard />
}