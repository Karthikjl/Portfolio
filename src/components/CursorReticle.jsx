import React, { useEffect, useRef, useState } from 'react'

export default function CursorReticle() {
  const reticleRef  = useRef(null)
  const dotRef      = useRef(null)
  const trailRef    = useRef([])
  const posRef      = useRef({ x: -100, y: -100 })
  const smoothRef   = useRef({ x: -100, y: -100 })
  const rafRef      = useRef(null)
  const [clicking, setClicking]   = useState(false)
  const [hovering, setHovering]   = useState(false)

  useEffect(() => {
    // Hide default cursor — handled by .no-cursor CSS class on portfolio root

    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY }

      // Instant dot follows exactly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`
      }

      // Detect hoverable elements
      const el = document.elementFromPoint(e.clientX, e.clientY)
      const isHover = el && (
        el.closest('a') ||
        el.closest('button') ||
        el.tagName === 'A' ||
        el.tagName === 'BUTTON'
      )
      setHovering(!!isHover)
    }

    const onDown = () => setClicking(true)
    const onUp   = () => setClicking(false)

    // Smooth reticle animation loop
    const animate = () => {
      const lerp = clicking ? 0.25 : hovering ? 0.18 : 0.12
      smoothRef.current.x += (posRef.current.x - smoothRef.current.x) * lerp
      smoothRef.current.y += (posRef.current.y - smoothRef.current.y) * lerp

      if (reticleRef.current) {
        const size = clicking ? 20 : hovering ? 36 : 28
        reticleRef.current.style.transform =
          `translate(${smoothRef.current.x - size / 2}px, ${smoothRef.current.y - size / 2}px)`
        reticleRef.current.style.width  = `${size}px`
        reticleRef.current.style.height = `${size}px`
      }

      rafRef.current = requestAnimationFrame(animate)
    }
    animate()

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup',   onUp)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup',   onUp)
      cancelAnimationFrame(rafRef.current)
    }
  }, [clicking, hovering])

  const color     = hovering ? 'var(--cyan)' : 'var(--green)'
  const glowColor = hovering ? 'rgba(0,229,255,0.5)' : 'rgba(0,255,65,0.5)'
  const size      = clicking ? 20 : hovering ? 36 : 28
  const lineLen   = size * 0.38
  const gap       = size * 0.22

  return (
    <>
      {/* ── RETICLE — lagged, smooth ── */}
      <div
        ref={reticleRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: `${size}px`,
          height: `${size}px`,
          pointerEvents: 'none',
          zIndex: 99999,
          transition: 'width 0.15s ease, height 0.15s ease',
        }}
      >
        <svg
          width="100%" height="100%"
          viewBox="0 0 100 100"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <filter id="reticle-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer circle */}
          <circle
            cx="50" cy="50" r="42"
            fill="none"
            stroke={color}
            strokeWidth={clicking ? '3' : '1.5'}
            strokeDasharray={clicking ? 'none' : '6 4'}
            filter="url(#reticle-glow)"
            style={{ transition: 'stroke 0.15s, stroke-width 0.15s' }}
          />

          {/* Inner circle */}
          <circle
            cx="50" cy="50" r={clicking ? '10' : '6'}
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            filter="url(#reticle-glow)"
            style={{ transition: 'r 0.15s, stroke 0.15s' }}
          />

          {/* Cross lines — top */}
          <line x1="50" y1="2"  x2="50" y2="28" stroke={color} strokeWidth="1.5" filter="url(#reticle-glow)" style={{ transition: 'stroke 0.15s' }} />
          {/* bottom */}
          <line x1="50" y1="72" x2="50" y2="98" stroke={color} strokeWidth="1.5" filter="url(#reticle-glow)" style={{ transition: 'stroke 0.15s' }} />
          {/* left */}
          <line x1="2"  y1="50" x2="28" y2="50" stroke={color} strokeWidth="1.5" filter="url(#reticle-glow)" style={{ transition: 'stroke 0.15s' }} />
          {/* right */}
          <line x1="72" y1="50" x2="98" y2="50" stroke={color} strokeWidth="1.5" filter="url(#reticle-glow)" style={{ transition: 'stroke 0.15s' }} />

          {/* Corner brackets */}
          {!clicking && [
            // top-left
            [8, 8, 8, 20, 20, 8],
            // top-right
            [92, 8, 92, 20, 80, 8],
            // bottom-left
            [8, 92, 8, 80, 20, 92],
            // bottom-right
            [92, 92, 92, 80, 80, 92],
          ].map(([x1, y1, x2, y2, x3, y3], i) => (
            <polyline
              key={i}
              points={`${x1},${y1} ${x2},${y2}`}
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              filter="url(#reticle-glow)"
              style={{ transition: 'stroke 0.15s' }}
            />
          ))}

          {/* Click burst rings */}
          {clicking && (
            <>
              <circle cx="50" cy="50" r="30" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
              <circle cx="50" cy="50" r="20" fill={color} opacity="0.08" />
            </>
          )}
        </svg>
      </div>

      {/* ── DOT — instant, always at exact position ── */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '6px', height: '6px',
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 6px ${glowColor}, 0 0 12px ${glowColor}`,
          pointerEvents: 'none',
          zIndex: 100000,
          transition: 'background 0.15s, box-shadow 0.15s',
        }}
      />
    </>
  )
}