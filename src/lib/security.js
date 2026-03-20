// ── URL SANITIZER ─────────────────────────────────────
// Only allow http:// and https:// URLs — blocks javascript:, data:, etc.
export function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return ''
  const trimmed = url.trim()
  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return trimmed
    }
  } catch {
    // invalid URL
  }
  return ''
}

// ── EMAIL SANITIZER ───────────────────────────────────
export function sanitizeEmail(email) {
  if (!email || typeof email !== 'string') return ''
  return email.trim().toLowerCase().replace(/[^a-z0-9@._+-]/g, '')
}

// ── SETTINGS VALUE SANITIZER ─────────────────────────
// Only allow known safe font IDs and setting values
const ALLOWED_FONT_IDS = [
  'share-tech-mono', 'jetbrains-mono', 'fira-code',
  'ibm-plex-mono', 'courier-prime', 'source-code-pro',
  'space-mono', 'inconsolata',
]
const ALLOWED_MATRIX_PRESETS = ['subtle', 'default', 'intense', 'storm']
const ALLOWED_BG_TYPES = ['starfield', 'matrix', 'off']
const ALLOWED_ANIM_PRESETS = ['none', 'subtle', 'medium', 'heavy']
const ALLOWED_SETTING_KEYS = ['font', 'matrix_preset', 'bg_type', 'anim_preset']

export function sanitizeSetting(key, value) {
  if (!ALLOWED_SETTING_KEYS.includes(key)) return null
  if (typeof value !== 'string') return null
  if (key === 'font'          && !ALLOWED_FONT_IDS.includes(value))        return null
  if (key === 'matrix_preset' && !ALLOWED_MATRIX_PRESETS.includes(value))  return null
  if (key === 'bg_type'       && !ALLOWED_BG_TYPES.includes(value))        return null
  if (key === 'anim_preset'   && !ALLOWED_ANIM_PRESETS.includes(value))     return null
  return value
}

// ── LOGIN RATE LIMITER ────────────────────────────────
// Client-side lockout — max 5 attempts, 2 min lockout
const LOGIN_KEY     = 'login_attempts'
const LOCKOUT_KEY   = 'login_lockout'
const MAX_ATTEMPTS  = 5
const LOCKOUT_MS    = 2 * 60 * 1000 // 2 minutes

export function checkLoginAllowed() {
  const lockout = localStorage.getItem(LOCKOUT_KEY)
  if (lockout) {
    const remaining = parseInt(lockout) - Date.now()
    if (remaining > 0) {
      return { allowed: false, remaining: Math.ceil(remaining / 1000) }
    } else {
      localStorage.removeItem(LOCKOUT_KEY)
      localStorage.removeItem(LOGIN_KEY)
    }
  }
  return { allowed: true, remaining: 0 }
}

export function recordLoginAttempt(success) {
  if (success) {
    localStorage.removeItem(LOGIN_KEY)
    localStorage.removeItem(LOCKOUT_KEY)
    return
  }
  const attempts = parseInt(localStorage.getItem(LOGIN_KEY) || '0') + 1
  localStorage.setItem(LOGIN_KEY, String(attempts))
  if (attempts >= MAX_ATTEMPTS) {
    localStorage.setItem(LOCKOUT_KEY, String(Date.now() + LOCKOUT_MS))
  }
}

export function getRemainingAttempts() {
  const attempts = parseInt(localStorage.getItem(LOGIN_KEY) || '0')
  return Math.max(0, MAX_ATTEMPTS - attempts)
}