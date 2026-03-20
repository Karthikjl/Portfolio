import React, { useEffect, useRef } from 'react'

export default function StarField({ opacity = 1, speed = 1, density = 1, glowIntensity = 1 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (opacity === 0) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    let frameCount = 0

    // Black hole is always at right edge, vertically centered
    // cx is OFF screen to the right — only left half is visible
    const getCenter = () => ({
      x: canvas.width + 80,   // sits beyond right edge — half visible
      y: canvas.height * 0.5,
    })

    const BH_RADIUS = 120  // big event horizon

    let stars = []
    let shootingStars = []

    function randomStar() {
      // Spawn stars spread across the whole canvas
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const { x: cx, y: cy } = getCenter()
      const dx = x - cx
      const dy = y - cy
      const dist  = Math.sqrt(dx * dx + dy * dy)
      const angle = Math.atan2(dy, dx)
      return {
        x, y,
        dist,
        angle,
        angularSpeed: (0.00015 + Math.random() * 0.0004) * speed,
        pullSpeed:    (0.08 + Math.random() * 0.18) * speed,
        size:    0.5 + Math.random() * 2,
        alpha:   0.4 + Math.random() * 0.6,
        color:   randomStarColor(),
        trail:   [],
        trailLen: Math.floor(4 + Math.random() * 10),
      }
    }

    function randomStarColor() {
      const colors = [
        [200, 220, 255],
        [255, 255, 255],
        [180, 255, 200],
        [255, 220, 180],
        [0,   255,  65],
        [100, 200, 255],
      ]
      return colors[Math.floor(Math.random() * colors.length)]
    }

    function initStars() {
      const count = Math.floor(260 * density)
      stars = Array.from({ length: count }, randomStar)
    }

    function spawnShootingStar() {
      const y = Math.random() * canvas.height
      const spd = (5 + Math.random() * 7) * speed
      shootingStars.push({
        x: -20,
        y,
        vx: spd * (0.8 + Math.random() * 0.4),
        vy: (Math.random() - 0.5) * spd * 0.3,
        trail: [],
        trailLen: 20 + Math.floor(Math.random() * 16),
        life: 1,
        size: 1.5 + Math.random() * 1.5,
      })
    }

    function resetStar(star) {
      const s = randomStar()
      Object.assign(star, s)
    }

    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
    initStars()

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      initStars()
    }
    window.addEventListener('resize', resize)

    const draw = () => {
      frameCount++
      const { x: cx, y: cy } = getCenter()

      // Deep space background fade
      ctx.fillStyle = 'rgba(3,4,12,0.22)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // ── BLACK HOLE (right edge, half visible) ──
      drawBlackHole(ctx, cx, cy, BH_RADIUS, glowIntensity)

      // ── STARS ──
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i]

        // Update position via polar coords
        star.angle += star.angularSpeed

        // Pull acceleration — stronger the closer to center
        const pullFactor = 1 + Math.max(0, (600 - star.dist) / 600) * 3
        star.dist -= star.pullSpeed * pullFactor

        // Recalculate cartesian
        star.x = cx + Math.cos(star.angle) * star.dist
        star.y = cy + Math.sin(star.angle) * star.dist

        // Save trail
        star.trail.unshift({ x: star.x, y: star.y })
        if (star.trail.length > star.trailLen) star.trail.pop()

        // Draw trail
        for (let t = 0; t < star.trail.length; t++) {
          const pt = star.trail[t]
          // Only draw if on screen
          if (pt.x < 0 || pt.x > canvas.width || pt.y < 0 || pt.y > canvas.height) continue
          const fade = 1 - t / star.trail.length
          const [r, g, b] = star.color
          ctx.beginPath()
          ctx.arc(pt.x, pt.y, star.size * fade * 0.6, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${r},${g},${b},${star.alpha * fade * opacity * 0.6})`
          ctx.fill()
        }

        // Draw star head (only if on screen)
        if (star.x >= -10 && star.x <= canvas.width + 10 && star.y >= -10 && star.y <= canvas.height + 10) {
          const proximity = Math.max(0, 1 - star.dist / 250)
          if (proximity > 0.1) {
            ctx.shadowColor = `rgba(${star.color.join(',')},0.9)`
            ctx.shadowBlur  = proximity * 10 * glowIntensity
          }
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * (1 + proximity * 0.8), 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${star.color.join(',')},${Math.min(1, star.alpha * opacity * (1 + proximity))})`
          ctx.fill()
          ctx.shadowBlur = 0
        }

        // Swallowed or drifted too far — respawn
        if (star.dist < BH_RADIUS - 10 || star.dist > 2000) {
          resetStar(star)
        }
      }

      // ── SHOOTING STARS ──
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i]
        ss.trail.unshift({ x: ss.x, y: ss.y })
        if (ss.trail.length > ss.trailLen) ss.trail.pop()

        for (let t = 0; t < ss.trail.length; t++) {
          const pt = ss.trail[t]
          const fade = 1 - t / ss.trail.length
          ctx.beginPath()
          ctx.arc(pt.x, pt.y, ss.size * fade, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(200,230,255,${fade * 0.85 * opacity})`
          ctx.fill()
        }

        ctx.shadowColor = 'rgba(200,230,255,0.95)'
        ctx.shadowBlur  = 8 * glowIntensity
        ctx.beginPath()
        ctx.arc(ss.x, ss.y, ss.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${opacity})`
        ctx.fill()
        ctx.shadowBlur = 0

        ss.x += ss.vx
        ss.y += ss.vy

        if (ss.x > canvas.width + 50 || ss.y < -50 || ss.y > canvas.height + 50) {
          shootingStars.splice(i, 1)
        }
      }

      // Spawn shooting stars
      if (frameCount % Math.floor(160 / speed) === 0 && Math.random() < 0.5) {
        spawnShootingStar()
      }

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [opacity, speed, density, glowIntensity])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  )
}

// ── BLACK HOLE ────────────────────────────────────────
function drawBlackHole(ctx, cx, cy, bhr, glowIntensity) {
  // Accretion disk glow rings — large
  const rings = [
    { r: bhr + 110, alpha: 0.018, width: 50, color: '0,140,80'    },
    { r: bhr + 70,  alpha: 0.04,  width: 35, color: '0,190,100'   },
    { r: bhr + 40,  alpha: 0.08,  width: 22, color: '0,230,110'   },
    { r: bhr + 20,  alpha: 0.15,  width: 14, color: '0,255,120'   },
    { r: bhr + 8,   alpha: 0.28,  width: 8,  color: '80,255,160'  },
    { r: bhr + 2,   alpha: 0.45,  width: 4,  color: '200,255,220' },
  ]

  rings.forEach(ring => {
    const grad = ctx.createRadialGradient(cx, cy, ring.r - ring.width, cx, cy, ring.r + ring.width)
    grad.addColorStop(0,   `rgba(${ring.color},0)`)
    grad.addColorStop(0.5, `rgba(${ring.color},${ring.alpha * glowIntensity})`)
    grad.addColorStop(1,   `rgba(${ring.color},0)`)
    ctx.beginPath()
    ctx.arc(cx, cy, ring.r + ring.width, 0, Math.PI * 2)
    ctx.fillStyle = grad
    ctx.fill()
  })

  // Event horizon — pure black
  ctx.beginPath()
  ctx.arc(cx, cy, bhr, 0, Math.PI * 2)
  ctx.fillStyle = '#000000'
  ctx.fill()

  // Bright inner ring
  ctx.shadowColor = `rgba(0,255,120,${glowIntensity})`
  ctx.shadowBlur  = 25 * glowIntensity
  ctx.beginPath()
  ctx.arc(cx, cy, bhr, 0, Math.PI * 2)
  ctx.strokeStyle = `rgba(0,255,140,${0.7 * glowIntensity})`
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.shadowBlur = 0
}