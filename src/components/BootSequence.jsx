import React, { useState, useEffect } from 'react'

const BOOT_LINES = [
  { text: 'BIOS v2.4.1 — Initializing hardware...', delay: 0 },
  { text: 'RAM: 16384MB OK', delay: 120 },
  { text: 'Loading kernel modules...', delay: 240 },
  { text: 'Mounting filesystem: /portfolio', delay: 380 },
  { text: 'Establishing secure connection...', delay: 520 },
  { text: 'Decrypting identity matrix...', delay: 680 },
  { text: 'Loading profile: KARTHIKEYAN', delay: 820, color: 'var(--amber)' },
  { text: 'Status: ONLINE ■ ALL SYSTEMS NOMINAL', delay: 1000, color: 'var(--green)' },
  { text: '──────────────────────────────────────', delay: 1100 },
]

export default function BootSequence({ onComplete }) {
  const [lines, setLines] = useState([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Check sessionStorage — only boot once per session
    if (sessionStorage.getItem('booted')) {
      onComplete()
      return
    }

    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => {
        setLines(prev => [...prev, line])
        if (i === BOOT_LINES.length - 1) {
          setTimeout(() => {
            setDone(true)
            setTimeout(() => {
              sessionStorage.setItem('booted', '1')
              onComplete()
            }, 600)
          }, 400)
        }
      }, line.delay)
    })
  }, [])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--black)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      opacity: done ? 0 : 1,
      transition: 'opacity 0.6s ease',
    }}>
      <div style={{ width: '100%', maxWidth: 640, padding: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
        <div style={{ color: 'var(--green)', marginBottom: '1.5rem', fontFamily: 'var(--font-orb)', fontSize: '1.2rem', letterSpacing: '0.2em' }}
          className="glow">
          [ SYSTEM BOOT ]
        </div>
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              color: line.color || 'var(--green-dim)',
              marginBottom: '0.3rem',
              animation: 'scanIn 0.2s ease forwards',
              lineHeight: 1.6,
            }}
          >
            <span style={{ color: 'var(--muted)', marginRight: '0.5rem' }}>&gt;</span>
            {line.text}
          </div>
        ))}
        {lines.length > 0 && !done && (
          <div style={{ color: 'var(--green)', marginTop: '0.3rem' }}>
            <span style={{ color: 'var(--muted)', marginRight: '0.5rem' }}>&gt;</span>
            <span className="cursor" />
          </div>
        )}
      </div>
    </div>
  )
}
