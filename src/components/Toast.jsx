import React, { useState, useEffect, useCallback } from 'react'

// ── TOAST CONTEXT ──────────────────────────────────────
let _addToast = null

export function useToast() {
  const add = useCallback((msg, type = 'success') => {
    if (_addToast) _addToast(msg, type)
  }, [])
  return { toast: add }
}

// ── TOAST CONTAINER ────────────────────────────────────
export default function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    _addToast = (msg, type) => {
      const id = Date.now()
      setToasts(prev => [...prev, { id, msg, type }])
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, 3500)
    }
    return () => { _addToast = null }
  }, [])

  if (toasts.length === 0) return null

  return (
    <div style={{
      position: 'fixed', bottom: '1.5rem', right: '1.5rem',
      zIndex: 99999, display: 'flex', flexDirection: 'column', gap: '0.6rem',
    }}>
      {toasts.map(toast => (
        <div
          key={toast.id}
          style={{
            background: 'var(--panel)',
            border: `1px solid ${toast.type === 'error' ? 'var(--red)' : toast.type === 'warn' ? 'var(--amber)' : 'var(--green)'}`,
            color: toast.type === 'error' ? 'var(--red)' : toast.type === 'warn' ? 'var(--amber)' : 'var(--green)',
            padding: '0.75rem 1.2rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            letterSpacing: '0.05em',
            minWidth: '280px',
            maxWidth: '400px',
            boxShadow: `0 0 20px ${toast.type === 'error' ? 'rgba(255,34,68,0.2)' : toast.type === 'warn' ? 'rgba(255,176,0,0.2)' : 'var(--green-glow)'}`,
            animation: 'scanIn 0.25s ease forwards',
            display: 'flex', alignItems: 'center', gap: '0.75rem',
          }}
        >
          <span style={{ fontSize: '1rem' }}>
            {toast.type === 'error' ? '✗' : toast.type === 'warn' ? '⚠' : '✓'}
          </span>
          <span>{toast.msg}</span>
          <button
            onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'inherit', marginLeft: 'auto', opacity: 0.5, fontSize: '1rem',
              fontFamily: 'var(--font-mono)',
            }}
          >×</button>
        </div>
      ))}
    </div>
  )
}
