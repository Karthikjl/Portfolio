import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import { sanitizeSetting } from '../lib/security.js'

export const FONT_OPTIONS = [
  { id: 'share-tech-mono', label: 'Share Tech Mono', description: 'Default — clean hacker feel',     family: 'Share Tech Mono', googleUrl: 'family=Share+Tech+Mono' },
  { id: 'jetbrains-mono',  label: 'JetBrains Mono',  description: 'Modern IDE terminal',             family: 'JetBrains Mono',  googleUrl: 'family=JetBrains+Mono:wght@400;700' },
  { id: 'fira-code',       label: 'Fira Code',        description: 'Classic dev font with ligatures', family: 'Fira Code',        googleUrl: 'family=Fira+Code:wght@400;700' },
  { id: 'ibm-plex-mono',   label: 'IBM Plex Mono',    description: 'Mainframe IBM feel',              family: 'IBM Plex Mono',    googleUrl: 'family=IBM+Plex+Mono:wght@400;700' },
  { id: 'courier-prime',   label: 'Courier Prime',    description: 'Typewriter meets terminal',       family: 'Courier Prime',    googleUrl: 'family=Courier+Prime:wght@400;700' },
  { id: 'source-code-pro', label: 'Source Code Pro',  description: 'Adobe — crisp and readable',     family: 'Source Code Pro',  googleUrl: 'family=Source+Code+Pro:wght@400;700' },
  { id: 'space-mono',      label: 'Space Mono',       description: 'Chunky retro terminal',           family: 'Space Mono',       googleUrl: 'family=Space+Mono:wght@400;700' },
  { id: 'inconsolata',     label: 'Inconsolata',      description: 'Narrow, dense, hacker-ish',       family: 'Inconsolata',      googleUrl: 'family=Inconsolata:wght@400;700' },
]

export const MATRIX_PRESETS = [
  { id: 'subtle',  label: 'Subtle',  description: 'Barely visible — content first', opacity: 0.022, speed: 0.7, density: 0.7, glowIntensity: 0.5 },
  { id: 'default', label: 'Default', description: 'Balanced — original feel',       opacity: 0.035, speed: 1.0, density: 1.0, glowIntensity: 1.0 },
  { id: 'intense', label: 'Intense', description: 'Heavy rain, strong glow',        opacity: 0.06,  speed: 1.3, density: 1.3, glowIntensity: 1.8 },
  { id: 'storm',   label: 'Storm',   description: 'Maximum chaos — full hacker',    opacity: 0.09,  speed: 1.8, density: 1.6, glowIntensity: 2.5 },
]

export const BG_TYPES = [
  { id: 'starfield', label: 'Starfield',   description: 'Stars + blackhole vortex', icon: '✦' },
  { id: 'matrix',    label: 'Matrix Rain', description: 'Tamil character rain',     icon: 'அ' },
  { id: 'off',       label: 'Off',         description: 'No background',            icon: '○' },
]

export const ANIM_PRESETS = [
  { id: 'none',   label: 'None',   description: 'No animations — instant load',    icon: '○' },
  { id: 'subtle', label: 'Subtle', description: 'Soft fades, minimal movement',    icon: '◎' },
  { id: 'medium', label: 'Medium', description: 'Smooth reveals — default feel',   icon: '◉' },
  { id: 'heavy',  label: 'Heavy',  description: 'Cinematic entrances, big slides', icon: '●' },
]

export const DEFAULT_SETTINGS = {
  font:          'share-tech-mono',
  matrix_preset: 'default',
  bg_type:       'starfield',
  anim_preset:   'medium',
}

function injectFont(googleUrl) {
  const existing = document.getElementById('dynamic-font')
  if (existing) existing.remove()
  const link = document.createElement('link')
  link.id = 'dynamic-font'
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?${googleUrl}&display=swap`
  document.head.appendChild(link)
}

function applyFont(family) {
  document.documentElement.style.setProperty('--font-mono', `'${family}', monospace`)
}

export function useSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchSettings() }, [])

  async function fetchSettings() {
    const { data } = await supabase.from('site_settings').select('key, value')
    const map = { ...DEFAULT_SETTINGS }
    if (data) data.forEach(row => {
      const safe = sanitizeSetting(row.key, row.value)
      if (safe !== null) map[row.key] = safe
    })
    setSettings(map)
    applyAllSettings(map)
    setLoading(false)
  }

  function applyAllSettings(map) {
    const font = FONT_OPTIONS.find(f => f.id === map.font) || FONT_OPTIONS[0]
    injectFont(font.googleUrl)
    applyFont(font.family)
  }

  async function saveSetting(key, value) {
    const safe = sanitizeSetting(key, value)
    if (safe === null) return
    await supabase.from('site_settings').upsert({ key, value: safe }, { onConflict: 'key' })
    const next = { ...settings, [key]: safe }
    setSettings(next)
    applyAllSettings(next)
  }

  const matrixConfig = MATRIX_PRESETS.find(p => p.id === settings.matrix_preset) || MATRIX_PRESETS[1]

  return { settings, loading, saveSetting, matrixConfig }
}