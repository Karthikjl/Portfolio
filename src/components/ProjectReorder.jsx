import React, { useState } from 'react'
import { sanitizeUrl } from '../lib/security.js'
import { supabase } from '../lib/supabase.js'

export default function ProjectReorder({ projects, onDone, toast }) {
  const [items, setItems] = useState(
    [...projects].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
  )
  const [saving, setSaving] = useState(false)
  const [dragIdx, setDragIdx] = useState(null)
  const [dragOverIdx, setDragOverIdx] = useState(null)

  // ── MOVE UP / DOWN ──
  function move(idx, dir) {
    const next = [...items]
    const swapIdx = idx + dir
    if (swapIdx < 0 || swapIdx >= next.length) return
    ;[next[idx], next[swapIdx]] = [next[swapIdx], next[idx]]
    setItems(next)
  }

  // ── DRAG ──
  function onDragStart(e, idx) {
    setDragIdx(idx)
    e.dataTransfer.effectAllowed = 'move'
  }

  function onDragOver(e, idx) {
    e.preventDefault()
    setDragOverIdx(idx)
  }

  function onDrop(e, idx) {
    e.preventDefault()
    if (dragIdx === null || dragIdx === idx) return
    const next = [...items]
    const [moved] = next.splice(dragIdx, 1)
    next.splice(idx, 0, moved)
    setItems(next)
    setDragIdx(null)
    setDragOverIdx(null)
  }

  function onDragEnd() {
    setDragIdx(null)
    setDragOverIdx(null)
  }

  // ── SAVE ORDER ──
  async function saveOrder() {
    setSaving(true)
    const updates = items.map((p, i) =>
      supabase.from('projects').update({ display_order: i + 1 }).eq('id', p.id)
    )
    await Promise.all(updates)
    setSaving(false)
    toast('ORDER SAVED ✓', 'success')
    onDone()
  }

  return (
    <div style={{ animation: 'scanIn 0.3s ease' }}>

      {/* Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-vt)', fontSize: '2rem', color: 'var(--cyan)', textShadow: '0 0 15px var(--cyan)' }}>
            REORDER PROJECTS
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--muted)', marginTop: '0.3rem', letterSpacing: '0.1em' }}>
            DRAG TO REORDER — OR USE ↑↓ ARROWS
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-cyan" onClick={saveOrder} disabled={saving} style={{ padding: '0.6rem 1.5rem', fontSize: '0.75rem' }}>
            <span>{saving ? '[ SAVING... ]' : '[ SAVE ORDER ]'}</span>
          </button>
          <button className="btn" onClick={onDone} style={{ padding: '0.6rem 1.2rem', fontSize: '0.75rem' }}>
            <span>[ CANCEL ]</span>
          </button>
        </div>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {items.map((project, i) => {
          const isDragging  = dragIdx === i
          const isDragOver  = dragOverIdx === i && dragIdx !== i
          return (
            <div
              key={project.id}
              draggable
              onDragStart={e => onDragStart(e, i)}
              onDragOver={e => onDragOver(e, i)}
              onDrop={e => onDrop(e, i)}
              onDragEnd={onDragEnd}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.8rem',
                padding: '0.9rem 1rem',
                border: `1px solid ${isDragOver ? 'var(--cyan)' : isDragging ? 'var(--green)' : 'var(--border)'}`,
                background: isDragging ? 'rgba(0,255,65,0.06)' : isDragOver ? 'rgba(0,229,255,0.06)' : 'var(--panel)',
                opacity: isDragging ? 0.5 : 1,
                cursor: 'grab',
                transition: 'all 0.15s',
                boxShadow: isDragOver ? '0 0 12px rgba(0,229,255,0.2)' : 'none',
                userSelect: 'none',
                animation: `scanIn 0.3s ease ${i * 0.04}s both`,
              }}
            >
              {/* Drag handle */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', opacity: 0.4, flexShrink: 0 }}>
                {[0,1,2].map(d => (
                  <div key={d} style={{ display: 'flex', gap: '3px' }}>
                    <div style={{ width: 3, height: 3, background: 'var(--green)', borderRadius: '50%' }} />
                    <div style={{ width: 3, height: 3, background: 'var(--green)', borderRadius: '50%' }} />
                  </div>
                ))}
              </div>

              {/* Order number */}
              <div style={{
                fontFamily: 'var(--font-vt)', fontSize: '1.4rem',
                color: 'var(--green)', textShadow: '0 0 8px var(--green)',
                minWidth: '2rem', textAlign: 'center', flexShrink: 0,
              }}>
                {String(i + 1).padStart(2, '0')}
              </div>

              {/* Thumbnail */}
              {project.thumbnail_url && (
                <div style={{ width: 48, height: 36, flexShrink: 0, overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <img src={sanitizeUrl(project.thumbnail_url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(50%) brightness(0.7)' }}
                    onError={e => e.target.parentElement.style.display = 'none'} />
                </div>
              )}

              {/* Title + status */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-orb)', fontSize: '0.82rem', color: 'var(--white)', letterSpacing: '0.06em', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {project.title}
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '0.55rem', letterSpacing: '0.1em',
                    color: project.status === 'completed' ? 'var(--green)' : 'var(--amber)',
                    border: `1px solid ${project.status === 'completed' ? 'var(--green)' : 'var(--amber)'}44`,
                    padding: '0.1rem 0.4rem',
                  }}>
                    {project.status === 'completed' ? 'COMPLETED' : 'IN PROGRESS'}
                  </span>
                  {project.tech_stack?.slice(0, 2).map(t => (
                    <span key={t} style={{ fontSize: '0.55rem', color: 'var(--muted)', border: '1px solid var(--border)', padding: '0.1rem 0.4rem', letterSpacing: '0.06em' }}>{t}</span>
                  ))}
                </div>
              </div>

              {/* Up / Down buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flexShrink: 0 }}>
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  style={{
                    background: 'none', border: '1px solid var(--border)',
                    color: i === 0 ? 'var(--border)' : 'var(--green)',
                    fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                    padding: '0.2rem 0.5rem', cursor: i === 0 ? 'default' : 'pointer',
                    transition: 'all 0.15s', lineHeight: 1,
                  }}
                  onMouseEnter={e => { if (i > 0) e.target.style.background = 'var(--green)'; e.target.style.color = 'var(--black)' }}
                  onMouseLeave={e => { e.target.style.background = 'none'; e.target.style.color = i === 0 ? 'var(--border)' : 'var(--green)' }}
                >▲</button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === items.length - 1}
                  style={{
                    background: 'none', border: '1px solid var(--border)',
                    color: i === items.length - 1 ? 'var(--border)' : 'var(--green)',
                    fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                    padding: '0.2rem 0.5rem', cursor: i === items.length - 1 ? 'default' : 'pointer',
                    transition: 'all 0.15s', lineHeight: 1,
                  }}
                  onMouseEnter={e => { if (i < items.length - 1) e.target.style.background = 'var(--green)'; e.target.style.color = 'var(--black)' }}
                  onMouseLeave={e => { e.target.style.background = 'none'; e.target.style.color = i === items.length - 1 ? 'var(--border)' : 'var(--green)' }}
                >▼</button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom save */}
      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
        <button className="btn btn-cyan" onClick={saveOrder} disabled={saving} style={{ padding: '0.6rem 1.5rem', fontSize: '0.75rem' }}>
          <span>{saving ? '[ SAVING... ]' : '[ SAVE ORDER ]'}</span>
        </button>
        <button className="btn" onClick={onDone} style={{ padding: '0.6rem 1.2rem', fontSize: '0.75rem' }}>
          <span>[ CANCEL ]</span>
        </button>
      </div>
    </div>
  )
}