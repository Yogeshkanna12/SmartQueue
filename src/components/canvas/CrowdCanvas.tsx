import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface CrowdPerson {
  x: number
  y: number
  targetX: number
  targetY: number
  vx: number
  vy: number
  speed: number
  radius: number
  color: string
  accentColor: string
  gaitPhase: number
  gaitSpeed: number
  facingAngle: number
  state: 'walking' | 'queuing' | 'served' | 'wandering'
  laneIndex: number
  pathProgress: number
  waitTime: number
  hasTicket: boolean
  id: string
}

interface CrowdCanvasProps {
  density?: 'low' | 'medium' | 'high'
  flowSpeed?: number
  showFlowLines?: boolean
  interactive?: boolean
  className?: string
  height?: string | number
  queueStateActive?: boolean
}

// Sophisticated human-centered palette
const PERSON_PALETTES = [
  { body: '#059669', accent: '#34d399' }, // Emerald / Health
  { body: '#0284c7', accent: '#38bdf8' }, // Sky / Flow
  { body: '#4f46e5', accent: '#818cf8' }, // Indigo / Tech
  { body: '#d97706', accent: '#fbbf24' }, // Amber / Alert
  { body: '#0d9488', accent: '#2dd4bf' }, // Teal / Calm
  { body: '#64748b', accent: '#94a3b8' }, // Slate / Neutral
  { body: '#7c3aed', accent: '#a78bfa' }, // Violet / Focus
]

export const CrowdCanvas: React.FC<CrowdCanvasProps> = ({
  density = 'medium',
  flowSpeed = 1,
  showFlowLines = true,
  interactive = true,
  className = '',
  height = '100%',
  queueStateActive = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const peopleRef = useRef<CrowdPerson[]>([])
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false })
  const animFrameRef = useRef<number | null>(null)
  const wavePulseRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let heightPx = 0
    let dpr = 1

    const resize = () => {
      if (!canvas || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      width = rect.width
      heightPx = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = width * dpr
      canvas.height = heightPx * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${heightPx}px`
      ctx.scale(dpr, dpr)

      initCrowd()
    }

    // Determine count based on density and viewport width
    const getCount = () => {
      const base = width < 640 ? 25 : width < 1024 ? 45 : 70
      if (density === 'low') return Math.floor(base * 0.6)
      if (density === 'high') return Math.floor(base * 1.4)
      return base
    }

    // Waypoints for queue flow paths
    const getFlowLanes = () => {
      const centerY = heightPx * 0.52
      return [
        // Lane 1: Entrance -> Queue snake -> Counter A -> Exit
        [
          { x: width * 0.05, y: centerY + 60 },
          { x: width * 0.25, y: centerY + 40 },
          { x: width * 0.45, y: centerY + 10 },
          { x: width * 0.65, y: centerY - 20 },
          { x: width * 0.85, y: centerY - 60 },
          { x: width * 1.05, y: centerY - 80 },
        ],
        // Lane 2: Priority Fast-Track Flow
        [
          { x: width * 0.05, y: centerY - 30 },
          { x: width * 0.3, y: centerY - 40 },
          { x: width * 0.55, y: centerY - 50 },
          { x: width * 0.75, y: centerY - 40 },
          { x: width * 0.95, y: centerY - 20 },
          { x: width * 1.05, y: centerY },
        ],
        // Lane 3: Ambient Service Desk Return
        [
          { x: width * 0.1, y: centerY + 120 },
          { x: width * 0.35, y: centerY + 100 },
          { x: width * 0.6, y: centerY + 80 },
          { x: width * 0.8, y: centerY + 40 },
          { x: width * 1.05, y: centerY + 20 },
        ],
      ]
    }

    const initCrowd = () => {
      const count = getCount()
      const people: CrowdPerson[] = []
      const lanes = getFlowLanes()

      for (let i = 0; i < count; i++) {
        const palette = PERSON_PALETTES[i % PERSON_PALETTES.length]
        const laneIndex = i % lanes.length
        const progress = Math.random()

        // Place along one of the flow lanes with natural dispersion
        const lane = lanes[laneIndex]
        const seg = Math.floor(progress * (lane.length - 1))
        const p1 = lane[seg]
        const p2 = lane[Math.min(seg + 1, lane.length - 1)]
        const localT = (progress * (lane.length - 1)) - seg

        const spreadX = (Math.random() - 0.5) * 35
        const spreadY = (Math.random() - 0.5) * 28

        const startX = p1.x + (p2.x - p1.x) * localT + spreadX
        const startY = p1.y + (p2.y - p1.y) * localT + spreadY

        people.push({
          id: `person-${i}`,
          x: startX,
          y: startY,
          targetX: startX,
          targetY: startY,
          vx: 0,
          vy: 0,
          speed: (0.7 + Math.random() * 0.7) * flowSpeed,
          radius: 6 + Math.random() * 2.5,
          color: palette.body,
          accentColor: palette.accent,
          gaitPhase: Math.random() * Math.PI * 2,
          gaitSpeed: 0.12 + Math.random() * 0.08,
          facingAngle: 0,
          state: i % 4 === 0 ? 'queuing' : 'walking',
          laneIndex,
          pathProgress: progress,
          waitTime: Math.floor(Math.random() * 15),
          hasTicket: Math.random() > 0.3,
        })
      }
      peopleRef.current = people
    }

    // GSAP wave pulse simulation
    const waveTween = gsap.to(wavePulseRef, {
      current: 1,
      duration: 3.5,
      repeat: -1,
      ease: 'none',
    })

    // Animation Loop
    let lastTime = performance.now()
    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1)
      lastTime = time

      ctx.clearRect(0, 0, width, heightPx)

      const lanes = getFlowLanes()

      // 1. Draw subtle ambient queue flow lines (The "Flow" visual language)
      if (showFlowLines) {
        ctx.save()
        lanes.forEach((lane, lIdx) => {
          ctx.beginPath()
          ctx.moveTo(lane[0].x, lane[0].y)
          for (let i = 1; i < lane.length; i++) {
            const xc = (lane[i - 1].x + lane[i].x) / 2
            const yc = (lane[i - 1].y + lane[i].y) / 2
            ctx.quadraticCurveTo(lane[i - 1].x, lane[i - 1].y, xc, yc)
          }
          ctx.lineTo(lane[lane.length - 1].x, lane[lane.length - 1].y)

          ctx.strokeStyle = lIdx === 1 ? 'rgba(56, 189, 248, 0.12)' : 'rgba(16, 185, 129, 0.1)'
          ctx.lineWidth = 2
          ctx.setLineDash([8, 12])
          ctx.stroke()

          // Animated pulse particles moving along queue lane
          const pulseOffset = ((wavePulseRef.current + lIdx * 0.33) % 1)
          const ptIndex = Math.floor(pulseOffset * (lane.length - 1))
          const nextPt = lane[Math.min(ptIndex + 1, lane.length - 1)]
          const currPt = lane[ptIndex]
          const subT = (pulseOffset * (lane.length - 1)) - ptIndex
          const pulseX = currPt.x + (nextPt.x - currPt.x) * subT
          const pulseY = currPt.y + (nextPt.y - currPt.y) * subT

          const glowGrad = ctx.createRadialGradient(pulseX, pulseY, 0, pulseX, pulseY, 18)
          glowGrad.addColorStop(0, 'rgba(16, 185, 129, 0.4)')
          glowGrad.addColorStop(1, 'rgba(16, 185, 129, 0)')
          ctx.fillStyle = glowGrad
          ctx.beginPath()
          ctx.arc(pulseX, pulseY, 18, 0, Math.PI * 2)
          ctx.fill()

          ctx.fillStyle = '#34d399'
          ctx.beginPath()
          ctx.arc(pulseX, pulseY, 2.5, 0, Math.PI * 2)
          ctx.fill()
        })
        ctx.restore()
      }

      // 2. Update and draw each person
      const people = peopleRef.current
      const mouse = mouseRef.current

      for (let i = 0; i < people.length; i++) {
        const p = people[i]
        const lane = lanes[p.laneIndex]

        // Advance along flow path
        p.pathProgress += (p.speed * 0.05 * dt)
        if (p.pathProgress > 1.05) {
          p.pathProgress = -0.05
          p.y = lane[0].y + (Math.random() - 0.5) * 30
        }

        // Target on lane
        const seg = Math.max(0, Math.min(lane.length - 2, Math.floor(p.pathProgress * (lane.length - 1))))
        const pA = lane[seg]
        const pB = lane[seg + 1]
        const segProgress = (p.pathProgress * (lane.length - 1)) - seg

        let targetX = pA.x + (pB.x - pA.x) * segProgress
        let targetY = pA.y + (pB.y - pA.y) * segProgress

        // Queue waiting simulation: gentle slowing or pause in middle counter zone
        if (p.pathProgress > 0.45 && p.pathProgress < 0.65 && p.state === 'queuing') {
          targetX += Math.sin(time * 0.002 + i) * 3
          targetY += Math.cos(time * 0.002 + i) * 2
        }

        // Mouse avoidance (organic, polite crowd deflection)
        if (interactive && mouse.active) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const dist = Math.hypot(dx, dy)
          if (dist < 90 && dist > 0) {
            const force = (90 - dist) / 90
            targetX += (dx / dist) * force * 45
            targetY += (dy / dist) * force * 45
          }
        }

        // Smooth physics towards target
        p.vx += (targetX - p.x) * 2.5 * dt
        p.vy += (targetY - p.y) * 2.5 * dt
        p.vx *= 0.88
        p.vy *= 0.88

        p.x += p.vx
        p.y += p.vy

        // Compute angle of motion for human facing direction
        const moveDist = Math.hypot(p.vx, p.vy)
        if (moveDist > 0.1) {
          p.facingAngle = Math.atan2(p.vy, p.vx)
          p.gaitPhase += p.gaitSpeed * (moveDist + 1)
        }

        // Draw human character (Stylized top-down human sprite with moving gait)
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.facingAngle)

        // Subtle soft shadow underneath
        ctx.fillStyle = 'rgba(0, 0, 0, 0.28)'
        ctx.beginPath()
        ctx.ellipse(0, 2, p.radius * 1.1, p.radius * 0.7, 0, 0, Math.PI * 2)
        ctx.fill()

        // Natural walking stride (arms / feet swing)
        const stride = Math.sin(p.gaitPhase) * (p.radius * 0.5)

        // Hands / Shoulders
        ctx.fillStyle = p.accentColor
        // Left hand/shoulder
        ctx.beginPath()
        ctx.arc(stride * 0.6, -p.radius * 0.85, p.radius * 0.35, 0, Math.PI * 2)
        ctx.fill()
        // Right hand/shoulder
        ctx.beginPath()
        ctx.arc(-stride * 0.6, p.radius * 0.85, p.radius * 0.35, 0, Math.PI * 2)
        ctx.fill()

        // Torso / Jacket
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.ellipse(0, 0, p.radius * 0.85, p.radius * 0.6, 0, 0, Math.PI * 2)
        ctx.fill()

        // Head (top circle)
        ctx.fillStyle = '#f8fafc'
        ctx.beginPath()
        ctx.arc(0, 0, p.radius * 0.52, 0, Math.PI * 2)
        ctx.fill()

        // Subtle directional visor / gaze indicator
        ctx.fillStyle = p.accentColor
        ctx.beginPath()
        ctx.arc(p.radius * 0.35, 0, p.radius * 0.22, 0, Math.PI * 2)
        ctx.fill()

        // Digital queue status halo if served or approaching turn
        if (queueStateActive || (p.hasTicket && p.pathProgress > 0.5 && p.pathProgress < 0.7)) {
          ctx.strokeStyle = '#10b981'
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.arc(0, 0, p.radius + 3.5, 0, Math.PI * 2)
          ctx.stroke()
        }

        ctx.restore()
      }

      animFrameRef.current = requestAnimationFrame(render)
    }

    const ro = new ResizeObserver(() => {
      resize()
    })
    if (containerRef.current) {
      ro.observe(containerRef.current)
    }
    resize()
    animFrameRef.current = requestAnimationFrame(render)

    // Mouse handlers
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current.active = false
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      ro.disconnect()
      waveTween.kill()
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [density, flowSpeed, showFlowLines, interactive, queueStateActive])

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none pointer-events-auto ${className}`}
      style={{ height }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  )
}
export default CrowdCanvas
