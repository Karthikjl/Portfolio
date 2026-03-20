import React, { useState, useRef } from 'react'

export default function TerminalWindow({ title = 'terminal', children, defaultOpen = true, style = {} }) {
  const [open, setOpen] = useState(defaultOpen)
  const [minimized, setMinimized] = useState(false)

  return (
    <div style={{
      border: '1px solid var(--border)',
      background: 'var(--panel)',
      fontFamily: 'var(--font-mono)',
      ...style,
    }}>
      {/* Title bar */}
      <div style={{
        borderBottom: open && !minimized ? '1px solid var(--border)' : 'none',
        padding: '0.4rem 0.8rem',
        display: 'flex', alignItems: 'center', gap: '0.6rem',
        background: 'rgba(255,255,255,0.02)',
        userSelect: 'none',
      }}>
        {/* Traffic lights */}
        <button onClick={() => setOpen(false)} style={dotBtn('#ff2244')} title="Close" />
        <button onClick={() => setMinimized(m => !m)} style={dotBtn('#ffb000')} title="Minimize" />
        <button style={dotBtn('#00ff41')} title="Maximize" />
        <span style={{ fontSize: '0.65rem', color: 'var(--muted)', marginLeft: '0.5rem', letterSpacing: '0.12em' }}>
          {title}
        </span>
      </div>

      {/* Body */}
      {!minimized && open && (
        <div style={{ padding: '1rem' }}>
          {children}
        </div>
      )}
    </div>
  )
}

const dotBtn = (color) => ({
  width: 12, height: 12, borderRadius: '50%',
  background: color, border: 'none', cursor: 'pointer',
  boxShadow: `0 0 4px ${color}`,
  padding: 0, flexShrink: 0,
})
