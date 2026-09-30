import React, { useEffect, useRef, useState } from 'react'
import type { HeatmapZone } from '@/types/queue'

interface FloorPlanProps {
  zones: HeatmapZone[]
  onSelectZone?: (zone: HeatmapZone) => void
  selectedZoneId?: string
  showHeatmap?: boolean
  showParticles?: boolean
  className?: string
}

export const FloorPlanCanvas: React.FC<FloorPlanProps> = ({
  zones,
  onSelectZone,
  selectedZoneId,
  showHeatmap = true,
  showParticles = true,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [hoveredZone, setHoveredZone] = useState<HeatmapZone | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let animId: number

    // Particles simulating crowd circulation
    const particles = Array.from({ length: 42 }).map((_, i) => ({
      x: 0.1 + Math.random() * 0.8,
      y: 0.15 + Math.random() * 0.7,
      vx: (Math.random() - 0.5) * 0.0015,
      vy: (Math.random() - 0.5) * 0.0015,
      targetZone: zones[i % zones.length]?.id || 'waiting-hall',
      size: 2.5 + Math.random() * 2,
      color: i % 5 === 0 ? '#f59e0b' : i % 8 === 0 ? '#ef4444' : '#10b981',
    }))

    const resize = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.scale(dpr, dpr)
    }

    resize()
    const ro = new ResizeObserver(resize)
    if (containerRef.current) ro.observe(containerRef.current)

    let tick = 0
    const render = () => {
      tick++
      ctx.clearRect(0, 0, width, height)

      // 1. Grid lines / Blueprint subtle background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'
      ctx.lineWidth = 1
      const gridSize = 30
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // 2. Heatmap Density Glows (if enabled)
      if (showHeatmap) {
        zones.forEach((z) => {
          const zx = z.x * width + (z.width * width) / 2
          const zy = z.y * height + (z.height * height) / 2
          const radius = Math.max(z.width * width, z.height * height) * 0.8
          const ratio = Math.min(z.currentCount / z.maxCapacity, 1)

          const grad = ctx.createRadialGradient(zx, zy, 0, zx, zy, radius)
          if (ratio > 0.8) {
            grad.addColorStop(0, 'rgba(239, 68, 68, 0.35)')
            grad.addColorStop(0.6, 'rgba(245, 158, 11, 0.15)')
            grad.addColorStop(1, 'rgba(239, 68, 68, 0)')
          } else if (ratio > 0.5) {
            grad.addColorStop(0, 'rgba(245, 158, 11, 0.3)')
            grad.addColorStop(0.6, 'rgba(16, 185, 129, 0.1)')
            grad.addColorStop(1, 'rgba(245, 158, 11, 0)')
          } else {
            grad.addColorStop(0, 'rgba(16, 185, 129, 0.22)')
            grad.addColorStop(0.7, 'rgba(6, 182, 212, 0.08)')
            grad.addColorStop(1, 'rgba(16, 185, 129, 0)')
          }
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(zx, zy, radius, 0, Math.PI * 2)
          ctx.fill()
        })
      }

      // 3. Render Zone Architectural Blocks
      zones.forEach((z) => {
        const x = z.x * width
        const y = z.y * height
        const w = z.width * width
        const h = z.height * height
        const isSelected = z.id === selectedZoneId
        const isHovered = hoveredZone?.id === z.id

        // Floor fill
        ctx.fillStyle = isSelected
          ? 'rgba(16, 185, 129, 0.16)'
          : isHovered
          ? 'rgba(30, 41, 59, 0.8)'
          : 'rgba(15, 23, 42, 0.65)'
        ctx.beginPath()
        ctx.roundRect(x, y, w, h, 8)
        ctx.fill()

        // Border outline
        ctx.lineWidth = isSelected ? 2 : isHovered ? 1.5 : 1
        ctx.strokeStyle = isSelected
          ? '#10b981'
          : z.status === 'CRITICAL'
          ? 'rgba(239, 68, 68, 0.7)'
          : z.status === 'ELEVATED'
          ? 'rgba(245, 158, 11, 0.6)'
          : 'rgba(51, 65, 85, 0.8)'
        ctx.beginPath()
        ctx.roundRect(x, y, w, h, 8)
        ctx.stroke()

        // Zone title
        ctx.fillStyle = '#f8fafc'
        ctx.font = '600 11px system-ui, sans-serif'
        ctx.fillText(z.name, x + 10, y + 18)

        // Density badge
        const occupancyPct = Math.round((z.currentCount / z.maxCapacity) * 100)
        ctx.font = '500 10px monospace'
        ctx.fillStyle =
          occupancyPct > 80 ? '#f87171' : occupancyPct > 50 ? '#fbbf24' : '#34d399'
        ctx.fillText(`${z.currentCount}/${z.maxCapacity} (${occupancyPct}%)`, x + 10, y + 33)

        // Mini occupancy meter bar
        const barW = Math.max(10, w - 20)
        const barH = 4
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
        ctx.fillRect(x + 10, y + h - 12, barW, barH)
        ctx.fillStyle =
          occupancyPct > 80 ? '#ef4444' : occupancyPct > 50 ? '#f59e0b' : '#10b981'
        ctx.fillRect(x + 10, y + h - 12, barW * (occupancyPct / 100), barH)
      })

      // 4. Moving crowd particles
      if (showParticles) {
        particles.forEach((p) => {
          p.x += p.vx
          p.y += p.vy

          // Boundary bounce
          if (p.x < 0.05 || p.x > 0.95) p.vx *= -1
          if (p.y < 0.08 || p.y > 0.92) p.vy *= -1

          const px = p.x * width
          const py = p.y * height

          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(px, py, p.size, 0, Math.PI * 2)
          ctx.fill()

          // Subtle pulse ring
          if (tick % 40 < 20) {
            ctx.strokeStyle = p.color
            ctx.lineWidth = 0.75
            ctx.beginPath()
            ctx.arc(px, py, p.size + 2, 0, Math.PI * 2)
            ctx.stroke()
          }
        })
      }

      animId = requestAnimationFrame(render)
    }

    render()

    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mx = (e.clientX - rect.left) / width
      const my = (e.clientY - rect.top) / height

      const clicked = zones.find(
        (z) => mx >= z.x && mx <= z.x + z.width && my >= z.y && my <= z.y + z.height
      )
      if (clicked && onSelectZone) {
        onSelectZone(clicked)
      }
    }

    const handleCanvasMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mx = (e.clientX - rect.left) / width
      const my = (e.clientY - rect.top) / height

      const hovered = zones.find(
        (z) => mx >= z.x && mx <= z.x + z.width && my >= z.y && my <= z.y + z.height
      )
      setHoveredZone(hovered || null)
      canvas.style.cursor = hovered ? 'pointer' : 'default'
    }

    canvas.addEventListener('click', handleCanvasClick)
    canvas.addEventListener('mousemove', handleCanvasMove)

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
      canvas.removeEventListener('click', handleCanvasClick)
      canvas.removeEventListener('mousemove', handleCanvasMove)
    }
  }, [zones, selectedZoneId, hoveredZone, showHeatmap, showParticles, onSelectZone])

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[400px] md:h-[480px] rounded-2xl overflow-hidden border border-slate-800 bg-[#070b12] ${className}`}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
      {/* Legend Badge */}
      <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 flex items-center space-x-3 pointer-events-none">
        <span className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Optimal (&lt;50%)</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <span>Elevated (50-80%)</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          <span>Surge (&gt;80%)</span>
        </span>
      </div>
    </div>
  )
}
export default FloorPlanCanvas
