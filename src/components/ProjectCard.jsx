import React, { useState } from 'react'
import { sanitizeUrl } from '../lib/security.js'

export default function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const isComplete = project.status === 'completed'
  const statusColor = isComplete ? 'var(--green)' : 'var(--amber)'
  const safeThumb   = sanitizeUrl(project.thumbnail_url)
  const safeLive    = sanitizeUrl(project.live_url)
  const safeGithub  = sanitizeUrl(project.github_url)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: hovered ? 'rgba(0,255,65,0.03)' : 'var(--black)',
        border: `1px solid ${hovered ? 'var(--green)' : 'var(--border)'}`,
        transition: 'all 0.2s ease',
        boxShadow: hovered ? '0 0 30px var(--green-glow), inset 0 0 30px rgba(0,255,65,0.02)' : 'none',
        animation: `scanIn 0.4s ease ${index * 0.07}s both`,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Top accent line */}
      <div style={{
        height: '2px',
        background: hovered
          ? `linear-gradient(90deg, ${statusColor}, var(--cyan), ${statusColor})`
          : `linear-gradient(90deg, ${statusColor}44, transparent)`,
        transition: 'all 0.3s ease',
      }} />

      {/* Thumbnail */}
      {safeThumb && (
        <div style={{
          position: 'relative',
          height: '180px',
          overflow: 'hidden',
          borderBottom: '1px solid var(--border)',
        }}>
          <img
            src={safeThumb}
            alt={project.title}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              display: 'block',
              filter: hovered ? 'grayscale(0%) brightness(0.9)' : 'grayscale(40%) brightness(0.6)',
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
              transition: 'all 0.4s ease',
            }}
            onError={e => e.target.parentElement.style.display = 'none'}
          />
          {/* Overlay scanlines on image */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
            pointerEvents: 'none',
          }} />
          {/* Index badge */}
          <div style={{
            position: 'absolute', top: '0.6rem', right: '0.6rem',
            background: 'rgba(10,10,10,0.85)',
            border: '1px solid var(--border)',
            padding: '0.15rem 0.5rem',
            fontSize: '0.6rem', color: 'var(--muted)',
            fontFamily: 'var(--font-mono)', letterSpacing: '0.1em',
          }}>
            [{String(index + 1).padStart(2, '0')}]
          </div>
        </div>
      )}

      {/* Body */}
      <div style={{ padding: '1.2rem 1.4rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>

        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.8rem' }}>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: 'var(--font-orb)',
              fontSize: '1rem',
              color: hovered ? 'var(--green)' : 'var(--white)',
              letterSpacing: '0.06em',
              lineHeight: 1.2,
              textShadow: hovered ? '0 0 12px var(--green)' : 'none',
              transition: 'all 0.2s',
              marginBottom: '0.5rem',
            }}>
              {project.title}
            </div>

            {/* Status badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              border: `1px solid ${statusColor}44`,
              background: `${statusColor}11`,
              padding: '0.15rem 0.6rem',
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: statusColor, boxShadow: `0 0 5px ${statusColor}`,
                display: 'inline-block',
                animation: isComplete ? 'none' : 'pulseBorder 1.5s ease infinite',
              }} />
              <span style={{ fontSize: '0.6rem', color: statusColor, letterSpacing: '0.12em' }}>
                {isComplete ? 'COMPLETED' : 'IN PROGRESS'}
              </span>
            </div>
          </div>

          {/* No thumbnail = show index here */}
          {!safeThumb && (
            <div style={{ fontSize: '0.65rem', color: 'var(--border)', fontFamily: 'var(--font-mono)' }}>
              [{String(index + 1).padStart(2, '0')}]
            </div>
          )}
        </div>

        {/* Description */}
        <div style={{
          fontSize: '0.78rem',
          color: 'var(--green-dim)',
          lineHeight: 1.75,
          maxHeight: expanded ? '300px' : '3.5em',
          overflow: 'hidden',
          transition: 'max-height 0.35s ease',
          borderLeft: '2px solid var(--border)',
          paddingLeft: '0.8rem',
        }}>
          {project.description || 'No description provided.'}
        </div>

        {/* Tech stack */}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {project.tech_stack.map((tech, i) => (
              <span key={i} style={{
                fontSize: '0.6rem',
                color: i % 3 === 0 ? 'var(--green-dim)' : i % 3 === 1 ? 'var(--cyan)' : 'var(--amber)',
                border: `1px solid ${i % 3 === 0 ? 'var(--green-dim)' : i % 3 === 1 ? 'var(--cyan)' : 'var(--amber)'}44`,
                padding: '0.18rem 0.55rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Footer — links + expand */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          marginTop: 'auto', paddingTop: '0.8rem',
          borderTop: '1px solid var(--border)',
          flexWrap: 'wrap',
        }}>
          {safeLive && (
            <a
              href={safeLive}
              target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                background: 'var(--cyan)', color: 'var(--black)',
                fontSize: '0.65rem', fontFamily: 'var(--font-mono)',
                padding: '0.4rem 0.9rem', textDecoration: 'none',
                letterSpacing: '0.1em', fontWeight: 'bold',
                transition: 'box-shadow 0.2s',
                boxShadow: hovered ? '0 0 12px var(--cyan)' : 'none',
              }}
            >
              ⚡ LIVE
            </a>
          )}
          {safeGithub && (
            <a
              href={safeGithub}
              target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                background: 'transparent',
                border: '1px solid var(--green)',
                color: 'var(--green)',
                fontSize: '0.65rem', fontFamily: 'var(--font-mono)',
                padding: '0.4rem 0.9rem', textDecoration: 'none',
                letterSpacing: '0.1em',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--green)'; e.currentTarget.style.color = 'var(--black)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--green)' }}
            >
              ⌥ SOURCE
            </a>
          )}
          <button
            onClick={() => setExpanded(x => !x)}
            style={{
              marginLeft: 'auto',
              background: 'none', border: 'none',
              color: 'var(--muted)', fontSize: '0.62rem',
              cursor: 'pointer', fontFamily: 'var(--font-mono)',
              letterSpacing: '0.08em', padding: '0.4rem 0.6rem',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = 'var(--green)'}
            onMouseLeave={e => e.target.style.color = 'var(--muted)'}
          >
            {expanded ? '[ − LESS ]' : '[ + MORE ]'}
          </button>
        </div>
      </div>
    </div>
  )
}