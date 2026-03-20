import React, { useState, useEffect, useRef } from 'react'
import { FONT_OPTIONS, MATRIX_PRESETS, BG_TYPES } from '../lib/useSettings.js'

export default function SiteSettings({ settings, onSave, onSaveComplete }) {
  const [selectedFont,   setSelectedFont]   = useState(settings['font']          || 'share-tech-mono')
  const [selectedBg,     setSelectedBg]     = useState(settings['bg_type']       || 'starfield')
  const [selectedMatrix, setSelectedMatrix] = useState(settings['matrix_preset'] || 'default')
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  // Track last saved values separately — only update UI after a save completes
  const lastSaved = useRef({
    font:          settings['font']          || 'share-tech-mono',
    bg_type:       settings['bg_type']       || 'starfield',
    matrix_preset: settings['matrix_preset'] || 'default',
  })

  // hasChanges compares against lastSaved, not live settings prop
  const hasChanges =
    selectedFont   !== lastSaved.current.font          ||
    selectedBg     !== lastSaved.current.bg_type       ||
    selectedMatrix !== lastSaved.current.matrix_preset

  async function handleSave() {
    setSaving(true)
    await onSave('font',          selectedFont)
    await onSave('bg_type',       selectedBg)
    await onSave('matrix_preset', selectedMatrix)
    // Update lastSaved so hasChanges resets correctly
    lastSaved.current = {
      font:          selectedFont,
      bg_type:       selectedBg,
      matrix_preset: selectedMatrix,
    }
    setSaving(false)
    setSaved(true)
    if (onSaveComplete) onSaveComplete()
    setTimeout(() => setSaved(false), 2500)
  }


  const currentFont   = FONT_OPTIONS.find(f  => f.id === selectedFont)   || FONT_OPTIONS[0]
  const currentMatrix = MATRIX_PRESETS.find(p => p.id === selectedMatrix) || MATRIX_PRESETS[1]
  const currentBg     = BG_TYPES.find(b => b.id === selectedBg)           || BG_TYPES[0]

  return (
    <div style={{ animation: 'scanIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Title */}
      <div>
        <div style={{ fontFamily: 'var(--font-vt)', fontSize: '2.5rem', color: 'var(--cyan)', textShadow: '0 0 15px var(--cyan)' }}>
          SITE SETTINGS
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '0.2rem' }}>
          Changes apply live — no rebuild needed
        </div>
      </div>

      {/* ── BG TYPE ── */}
      <div style={{ border: '1px solid var(--border)', background: 'var(--panel)', padding: '1.5rem' }}>
        <SectionLabel color="var(--amber)" label="BACKGROUND :: TYPE SELECTOR" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(180px, 100%), 1fr))', gap: '0.8rem', marginBottom: '1rem' }}>
          {BG_TYPES.map(bg => (
            <PickerCard
              key={bg.id}
              selected={selectedBg === bg.id}
              onClick={() => setSelectedBg(bg.id)}
              accentColor="var(--amber)"
            >
              <div style={{ fontFamily: 'var(--font-vt)', fontSize: '2.5rem', color: selectedBg === bg.id ? 'var(--amber)' : 'var(--muted)', textShadow: selectedBg === bg.id ? '0 0 10px var(--amber)' : 'none', marginBottom: '0.3rem' }}>
                {bg.icon}
              </div>
              <div style={{ fontFamily: 'var(--font-orb)', fontSize: '0.72rem', color: selectedBg === bg.id ? 'var(--amber)' : 'var(--white)', marginBottom: '0.25rem', letterSpacing: '0.08em' }}>
                {bg.label}
              </div>
              <div style={{ fontSize: '0.6rem', color: 'var(--muted)' }}>{bg.description}</div>
            </PickerCard>
          ))}
        </div>

        {/* Show matrix intensity only when matrix is selected */}
        {selectedBg === 'matrix' && (
          <div style={{ marginTop: '1.2rem', borderTop: '1px solid var(--border)', paddingTop: '1.2rem' }}>
            <div style={{ fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.15em', marginBottom: '1rem' }}>
              MATRIX INTENSITY
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.6rem' }}>
              {MATRIX_PRESETS.map(preset => (
                <PickerCard
                  key={preset.id}
                  selected={selectedMatrix === preset.id}
                  onClick={() => setSelectedMatrix(preset.id)}
                  accentColor="var(--green)"
                >
                  <div style={{ fontFamily: 'var(--font-vt)', fontSize: '1.2rem', color: selectedMatrix === preset.id ? 'var(--green)' : 'var(--white)', marginBottom: '0.2rem', textShadow: selectedMatrix === preset.id ? '0 0 8px var(--green)' : 'none' }}>
                    {preset.label.toUpperCase()}
                  </div>
                  <div style={{ fontSize: '0.58rem', color: 'var(--muted)' }}>{preset.description}</div>
                  <div style={{ display: 'flex', gap: '3px', marginTop: '0.5rem' }}>
                    {[0.025, 0.05, 0.075, 0.1].map((t, i) => (
                      <div key={i} style={{
                        width: '12px', height: '3px',
                        background: preset.opacity >= t
                          ? (selectedMatrix === preset.id ? 'var(--green)' : 'var(--muted)')
                          : 'var(--border)',
                      }} />
                    ))}
                  </div>
                </PickerCard>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── FONT ── */}
      <div style={{ border: '1px solid var(--border)', background: 'var(--panel)', padding: '1.5rem' }}>
        <SectionLabel color="var(--cyan)" label="FONT_FAMILY :: MONOSPACE SELECTOR" />
        {/* Live preview */}
        <div style={{ border: '1px solid var(--border)', background: 'var(--black)', padding: '1.2rem', marginBottom: '1.5rem', fontFamily: `'${currentFont.family}', monospace` }}>
          <div style={{ fontSize: '0.55rem', color: 'var(--muted)', marginBottom: '0.6rem', letterSpacing: '0.12em' }}>PREVIEW — {currentFont.label}</div>
          <div style={{ color: 'var(--green)',     fontSize: '0.95rem', marginBottom: '0.25rem' }}>root@karthikeyan:~$ whoami</div>
          <div style={{ color: 'var(--green-dim)', fontSize: '0.82rem', marginBottom: '0.25rem' }}>KARTHIKEYAN // FULL STACK DEVELOPER</div>
          <div style={{ color: 'var(--amber)',     fontSize: '0.75rem' }}>{'{'} code: true {'}'} → 0123456789 → deploy()</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '0.6rem' }}>
          {FONT_OPTIONS.map(font => (
            <PickerCard key={font.id} selected={selectedFont === font.id} onClick={() => setSelectedFont(font.id)} accentColor="var(--cyan)">
              <div style={{ fontFamily: `'${font.family}', monospace`, fontSize: '0.88rem', color: selectedFont === font.id ? 'var(--cyan)' : 'var(--white)', marginBottom: '0.25rem' }}>
                {font.label}
              </div>
              <div style={{ fontSize: '0.58rem', color: 'var(--muted)' }}>{font.description}</div>
            </PickerCard>
          ))}
        </div>
      </div>

      {/* ── SAVE ── */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button
          className="btn btn-cyan"
          onClick={handleSave}
          disabled={saving || !hasChanges}
          style={{ padding: '0.7rem 2.5rem', fontSize: '0.8rem', opacity: !hasChanges ? 0.5 : 1 }}
        >
          <span>{saving ? '[ SAVING... ]' : saved ? '[ SAVED ✓ ]' : '[ APPLY SETTINGS ]'}</span>
        </button>
        {hasChanges && !saved && (
          <span style={{ fontSize: '0.65rem', color: 'var(--amber)', letterSpacing: '0.1em' }}>⚠ UNSAVED CHANGES</span>
        )}
        {saved && (
          <span style={{ fontSize: '0.65rem', color: 'var(--green)', letterSpacing: '0.1em' }}>■ LIVE ON PUBLIC SITE</span>
        )}
      </div>

    </div>
  )
}

function SectionLabel({ color, label }) {
  return (
    <div style={{
      fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.18em',
      marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
      borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem',
    }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}`, display: 'inline-block' }} />
      {label}
    </div>
  )
}

function PickerCard({ selected, onClick, accentColor, children }) {
  const rgb = accentColor === 'var(--cyan)' ? '0,229,255' : accentColor === 'var(--amber)' ? '255,176,0' : '0,255,65'
  return (
    <button onClick={onClick} style={{
      background: selected ? `rgba(${rgb},0.07)` : 'transparent',
      border: `1px solid ${selected ? accentColor : 'var(--border)'}`,
      padding: '0.9rem 1rem', cursor: 'pointer', textAlign: 'left',
      transition: 'all 0.15s', width: '100%',
      boxShadow: selected ? `0 0 14px rgba(${rgb},0.15)` : 'none',
    }}>
      {children}
      {selected && <div style={{ fontSize: '0.52rem', color: accentColor, marginTop: '0.4rem', letterSpacing: '0.15em' }}>■ SELECTED</div>}
    </button>
  )
}