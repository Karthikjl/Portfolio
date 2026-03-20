import React, { useEffect, useRef } from 'react'

const CHARS = 'அஆஇஈஉஊஎஏஐஒஓஔகசஜஞடணதநபமயரலவழளறனஷஸஹ0123456789<>{}[]|/\\'

export default function MatrixRain({ opacity = 0.035, speed = 1, density = 1, glowIntensity = 1 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    let frameCount = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initLayers()
    }

    // ── 3 LAYERS: far (small/slow), mid, near (large/fast) ──
    const LAYERS = [
      { size: 11, speed: 0.4, spacing: 18, alpha: 0.4, blur: 0 },
      { size: 14, speed: 0.8, spacing: 22, alpha: 0.7, blur: 0 },
      { size: 18, speed: 1.4, spacing: 30, alpha: 1.0, blur: 0 },
    ]

    let layers = []

    function initLayers() {
      layers = LAYERS.map(layer => {
        const cols = Math.floor(canvas.width / layer.spacing)
        return {
          ...layer,
          drops: Array.from({ length: cols }, () => ({
            y: Math.random() * -canvas.height,
            speed: layer.speed * speed * (0.7 + Math.random() * 0.6),
            length: 8 + Math.floor(Math.random() * 20),
            chars: Array.from({ length: 30 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]),
            mutateTimer: 0,
            glowing: Math.random() < 0.08, // 8% of columns glow
          })),
        }
      })
    }

    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      frameCount++

      // Fade background — slower fade = longer trails
      ctx.fillStyle = 'rgba(10,10,10,0.06)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      layers.forEach((layer, li) => {
        layer.drops.forEach((drop, di) => {
          const x = di * layer.spacing

          // Mutate characters randomly
          drop.mutateTimer++
          if (drop.mutateTimer > 3 + Math.floor(Math.random() * 8)) {
            drop.mutateTimer = 0
            const mutIdx = Math.floor(Math.random() * drop.chars.length)
            drop.chars[mutIdx] = CHARS[Math.floor(Math.random() * CHARS.length)]
          }

          // Draw trail
          for (let t = 0; t < drop.length; t++) {
            const charY = drop.y - t * layer.size
            if (charY < 0 || charY > canvas.height) continue

            const isHead = t === 0
            const trailFade = 1 - (t / drop.length)
            const charAlpha = layer.alpha * opacity * trailFade * density

            ctx.font = `${layer.size}px "Share Tech Mono", monospace`

            if (isHead) {
              // Bright white/green head character
              if (drop.glowing) {
                ctx.shadowColor = '#00ff41'
                ctx.shadowBlur = 18 * glowIntensity
              }
              ctx.fillStyle = `rgba(220, 255, 220, ${layer.alpha * opacity * 2.5})`
            } else if (t === 1) {
              ctx.shadowColor = '#00ff41'
              ctx.shadowBlur = drop.glowing ? 12 * glowIntensity : 4 * glowIntensity
              ctx.fillStyle = `rgba(0, 255, 65, ${layer.alpha * opacity * 1.8})`
            } else if (drop.glowing && t < 5) {
              ctx.shadowColor = '#00ff41'
              ctx.shadowBlur = 8 * glowIntensity * trailFade
              ctx.fillStyle = `rgba(0, 255, 65, ${charAlpha * 1.4})`
            } else {
              ctx.shadowBlur = 0
              // Slight color variation — occasional cyan tint
              if (Math.random() < 0.02) {
                ctx.fillStyle = `rgba(0, 229, 255, ${charAlpha * 0.6})`
              } else {
                ctx.fillStyle = `rgba(0, 204, 51, ${charAlpha})`
              }
            }

            ctx.fillText(drop.chars[t % drop.chars.length], x, charY)
            ctx.shadowBlur = 0
          }

          // Advance drop
          drop.y += drop.speed * speed

          // Reset when off screen
          if (drop.y - drop.length * layer.size > canvas.height) {
            drop.y = -layer.size * 2
            drop.speed = layer.speed * speed * (0.7 + Math.random() * 0.6)
            drop.length = 8 + Math.floor(Math.random() * 20)
            drop.glowing = Math.random() < 0.08
          }
        })
      })

      // Random column glow burst every ~3 seconds
      if (frameCount % 180 === 0) {
        const li = Math.floor(Math.random() * layers.length)
        const di = Math.floor(Math.random() * layers[li].drops.length)
        if (layers[li]?.drops[di]) {
          layers[li].drops[di].glowing = true
          setTimeout(() => {
            if (layers[li]?.drops[di]) layers[li].drops[di].glowing = false
          }, 800)
        }
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
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}