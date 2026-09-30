import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react'
import type {
  VenueType,
  Ticket,
  Counter,
  HeatmapZone,
  AIRecommendation,
  SystemStats,
  PriorityLevel,
  CounterStatus,
} from '@/types/queue'
import {
  VENUES,
  getInitialCounters,
  getInitialTickets,
  INITIAL_HEATMAP_ZONES,
  INITIAL_AI_RECOMMENDATIONS,
} from '@/data/mockData'
import { playQueueChime, playAlertChime, speakTicketAnnouncement } from '@/utils/sound'

interface ToastAlert {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'urgent'
  timestamp: number
}

interface QueueContextType {
  venue: VenueType
  venueConfig: typeof VENUES[VenueType]
  counters: Counter[]
  tickets: Ticket[]
  myTicket: Ticket | null
  ticketHistory: Ticket[]
  heatmapZones: HeatmapZone[]
  recommendations: AIRecommendation[]
  stats: SystemStats
  isSimulationActive: boolean
  soundEnabled: boolean
  speechEnabled: boolean
  toastAlert: ToastAlert | null

  // Actions
  switchVenue: (v: VenueType) => void
  joinQueue: (data: {
    departmentId: string
    serviceName: string
    customerName: string
    customerPhone: string
    priority: PriorityLevel
    notes?: string
  }) => Ticket
  cancelMyTicket: () => void
  snoozeMyTicket: () => void
  callNextTicket: (counterId: string) => Ticket | null
  recallTicket: (counterId: string) => void
  completeService: (counterId: string) => void
  holdTicket: (counterId: string) => void
  markNoShow: (counterId: string) => void
  transferTicket: (ticketId: string, targetDeptId: string) => void
  setCounterStatus: (counterId: string, status: CounterStatus) => void
  applyRecommendation: (recId: string) => void
  toggleSimulation: () => void
  toggleSound: () => void
  toggleSpeech: () => void
  triggerSurgeSimulation: () => void
  dismissToast: () => void
  clearMyTicket: () => void
  resetToDefault: () => void
}

const QueueContext = createContext<QueueContextType | undefined>(undefined)

const STORAGE_KEY_TICKET = 'smartqueue_my_ticket_v1'
const STORAGE_KEY_HISTORY = 'smartqueue_history_v1'

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [venue, setVenue] = useState<VenueType>('hospital')
  const [counters, setCounters] = useState<Counter[]>(() => getInitialCounters('hospital'))
  const [tickets, setTickets] = useState<Ticket[]>(() => getInitialTickets('hospital'))
  const [heatmapZones, setHeatmapZones] = useState<HeatmapZone[]>(INITIAL_HEATMAP_ZONES)
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(INITIAL_AI_RECOMMENDATIONS)
  
  const [isSimulationActive, setIsSimulationActive] = useState<boolean>(true)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true)
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(true)
  const [toastAlert, setToastAlert] = useState<ToastAlert | null>(null)

  // My Ticket (persisted in localStorage)
  const [myTicket, setMyTicket] = useState<Ticket | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TICKET)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  // Ticket history
  const [ticketHistory, setTicketHistory] = useState<Ticket[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Save active ticket
  useEffect(() => {
    try {
      if (myTicket) {
        localStorage.setItem(STORAGE_KEY_TICKET, JSON.stringify(myTicket))
      } else {
        localStorage.removeItem(STORAGE_KEY_TICKET)
      }
    } catch {
      // storage quota or private browsing
    }
  }, [myTicket])

  // Save history
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(ticketHistory.slice(-20)))
    } catch {
      // ignore
    }
  }, [ticketHistory])

  // Active venue configuration
  const venueConfig = useMemo(() => VENUES[venue], [venue])

  // Dynamic system statistics
  const stats: SystemStats = useMemo(() => {
    const active = tickets.filter((t) => t.status === 'WAITING' || t.status === 'CALLING')
    const completed = tickets.filter((t) => t.status === 'COMPLETED')
    const avgWait =
      active.length === 0
        ? 3
        : Math.round(active.reduce((acc, t) => acc + (t.estimatedWaitMinutes || 4), 0) / active.length)

    // Compute dynamic congestion index based on queue length and active counters
    const busyCounters = counters.filter((c) => c.status === 'BUSY').length
    const openCounters = counters.filter((c) => c.status === 'OPEN').length
    const totalWorking = busyCounters + openCounters || 1
    const ratio = active.length / (totalWorking * 3)
    const congestion = Math.min(98, Math.max(12, Math.round(ratio * 55 + (active.length > 8 ? 25 : 0))))

    return {
      totalServedToday: 132 + completed.length,
      activeInQueue: active.length,
      avgWaitMinutes: avgWait,
      satisfactionScore: 4.8,
      throughputPerHour: 38 + busyCounters * 4,
      congestionIndex: congestion,
      bottleneckArea: active.length > 6 ? 'General Consultations' : 'Optimal Flow',
    }
  }, [tickets, counters])

  // Show Toast
  const showToast = (title: string, message: string, type: ToastAlert['type'] = 'info') => {
    setToastAlert({
      id: Math.random().toString(),
      title,
      message,
      type,
      timestamp: Date.now(),
    })
  }

  const dismissToast = () => setToastAlert(null)

  // Switch Venue
  const switchVenue = (newVenue: VenueType) => {
    setVenue(newVenue)
    setCounters(getInitialCounters(newVenue))
    setTickets(getInitialTickets(newVenue))
    showToast('Venue Switched', `Active facility set to ${VENUES[newVenue].name}`, 'info')
  }

  // Join Queue
  const joinQueue = (data: {
    departmentId: string
    serviceName: string
    customerName: string
    customerPhone: string
    priority: PriorityLevel
    notes?: string
  }): Ticket => {
    const dept = venueConfig.departments.find((d) => d.id === data.departmentId) || venueConfig.departments[0]
    
    // Find next ticket index for this department
    const existingDeptTickets = tickets.filter((t) => t.departmentId === dept.id)
    const seq = 100 + existingDeptTickets.length + 1
    const ticketCode = `${dept.code}-${seq}`

    // Calculate wait time
    const peopleAhead = tickets.filter((t) => t.departmentId === dept.id && t.status === 'WAITING').length
    const activeStaff = Math.max(1, counters.filter((c) => c.departmentId === dept.id && c.status !== 'CLOSED').length)
    const estWait = Math.max(2, Math.round((peopleAhead * dept.avgServiceMinutes) / activeStaff))

    const newTicket: Ticket = {
      id: ticketCode,
      dbId: `t-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      venueId: venue,
      departmentId: dept.id,
      departmentName: dept.name,
      serviceName: data.serviceName,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      priority: data.priority,
      status: 'WAITING',
      issuedAt: Date.now(),
      estimatedWaitMinutes: data.priority === 'EMERGENCY_TRIAGE' ? 1 : estWait,
      notificationsEnabled: true,
      notes: data.notes,
    }

    setTickets((prev) => [...prev, newTicket])
    setMyTicket(newTicket)

    // Audio cue
    if (soundEnabled) {
      if (data.priority === 'EMERGENCY_TRIAGE') {
        playAlertChime()
      } else {
        playQueueChime(0.2)
      }
    }

    showToast(
      'Ticket Issued',
      `You are in queue as ${ticketCode}. Estimated wait: ~${newTicket.estimatedWaitMinutes} mins`,
      data.priority === 'EMERGENCY_TRIAGE' ? 'urgent' : 'success'
    )

    return newTicket
  }

  // Cancel My Ticket
  const cancelMyTicket = () => {
    if (!myTicket) return
    const cancelledId = myTicket.id
    setTickets((prev) =>
      prev.map((t) => (t.id === cancelledId ? { ...t, status: 'CANCELLED' as const } : t))
    )
    setTicketHistory((prev) => [{ ...myTicket, status: 'CANCELLED' as const }, ...prev])
    setMyTicket(null)
    showToast('Ticket Cancelled', `Your ticket ${cancelledId} was removed from the queue.`, 'info')
  }

  // Snooze My Ticket by 5 minutes
  const snoozeMyTicket = () => {
    if (!myTicket) return
    setMyTicket((prev) =>
      prev ? { ...prev, estimatedWaitMinutes: (prev.estimatedWaitMinutes || 3) + 5 } : null
    )
    showToast('Queue Snoozed', 'Your turn was postponed by ~5 minutes.', 'info')
  }

  const clearMyTicket = () => {
    setMyTicket(null)
  }

  // Call Next Ticket (Operator action)
  const callNextTicket = (counterId: string): Ticket | null => {
    const counter = counters.find((c) => c.id === counterId)
    if (!counter) return null

    // Look for next eligible ticket
    // Priority order: EMERGENCY_TRIAGE -> SENIOR/ACCESSIBILITY -> STANDARD
    const waitingTickets = tickets
      .filter((t) => t.status === 'WAITING')
      .sort((a, b) => {
        const priorityScore: Record<PriorityLevel, number> = {
          EMERGENCY_TRIAGE: 100,
          SENIOR: 50,
          ACCESSIBILITY: 50,
          STANDARD: 10,
        }
        const scoreDiff = priorityScore[b.priority] - priorityScore[a.priority]
        if (scoreDiff !== 0) return scoreDiff
        return a.issuedAt - b.issuedAt
      })

    // Prefer department matches for specialized counters
    const nextTicket =
      waitingTickets.find((t) => t.departmentId === counter.departmentId) || waitingTickets[0]

    if (!nextTicket) {
      showToast('Queue Empty', `No waiting customers for Counter ${counter.number}.`, 'info')
      return null
    }

    // Mark previous ticket on this counter as completed
    if (counter.currentTicketId) {
      setTickets((prev) =>
        prev.map((t) =>
          t.id === counter.currentTicketId && (t.status === 'SERVING' || t.status === 'CALLING')
            ? { ...t, status: 'COMPLETED' as const, completedAt: Date.now() }
            : t
        )
      )
    }

    // Update called ticket
    const updatedTicket: Ticket = {
      ...nextTicket,
      status: 'SERVING',
      calledAt: Date.now(),
      counterId: counter.id,
      counterNumber: counter.number,
      counterStaff: counter.staffName,
      estimatedWaitMinutes: 0,
    }

    setTickets((prev) => prev.map((t) => (t.id === nextTicket.id ? updatedTicket : t)))

    // Update Counter
    setCounters((prev) =>
      prev.map((c) =>
        c.id === counter.id
          ? {
              ...c,
              status: 'BUSY',
              currentTicketId: nextTicket.id,
              currentTicketNumber: nextTicket.id,
              ticketsServedCount: c.ticketsServedCount + 1,
            }
          : c
      )
    )

    // If this is the active user's ticket, update myTicket state
    if (myTicket && myTicket.id === nextTicket.id) {
      setMyTicket(updatedTicket)
      showToast(
        "IT'S YOUR TURN!",
        `Please proceed immediately to Counter ${counter.number} (${counter.staffName})`,
        'urgent'
      )
    } else {
      showToast(
        `Ticket Called: ${nextTicket.id}`,
        `Now serving at Counter ${counter.number} (${counter.staffName})`,
        'success'
      )
    }

    // Audio & voice announcement
    if (soundEnabled) {
      playQueueChime(0.3)
      if (speechEnabled) {
        setTimeout(() => {
          speakTicketAnnouncement(nextTicket.id, counter.number)
        }, 350)
      }
    }

    return updatedTicket
  }

  // Recall Ticket
  const recallTicket = (counterId: string) => {
    const counter = counters.find((c) => c.id === counterId)
    if (!counter || !counter.currentTicketNumber) return

    if (soundEnabled) {
      playQueueChime(0.35)
      if (speechEnabled) {
        setTimeout(() => {
          speakTicketAnnouncement(counter.currentTicketNumber!, counter.number)
        }, 350)
      }
    }
    showToast('Ticket Recalled', `Announcing Ticket ${counter.currentTicketNumber} again.`, 'info')
  }

  // Complete Service
  const completeService = (counterId: string) => {
    const counter = counters.find((c) => c.id === counterId)
    if (!counter) return

    if (counter.currentTicketId) {
      setTickets((prev) =>
        prev.map((t) =>
          t.id === counter.currentTicketId
            ? { ...t, status: 'COMPLETED' as const, completedAt: Date.now() }
            : t
        )
      )
    }

    setCounters((prev) =>
      prev.map((c) =>
        c.id === counterId
          ? { ...c, status: 'OPEN', currentTicketId: undefined, currentTicketNumber: undefined }
          : c
      )
    )

    showToast('Service Finished', `Counter ${counter.number} is now ready for the next customer.`, 'success')
  }

  // Put on Hold
  const holdTicket = (counterId: string) => {
    const counter = counters.find((c) => c.id === counterId)
    if (!counter || !counter.currentTicketId) return

    setTickets((prev) =>
      prev.map((t) => (t.id === counter.currentTicketId ? { ...t, status: 'HELD' as const } : t))
    )

    setCounters((prev) =>
      prev.map((c) =>
        c.id === counterId
          ? { ...c, status: 'OPEN', currentTicketId: undefined, currentTicketNumber: undefined }
          : c
      )
    )

    showToast('Customer on Hold', `Ticket ${counter.currentTicketNumber} set to Hold status.`, 'warning')
  }

  // Mark No-Show
  const markNoShow = (counterId: string) => {
    const counter = counters.find((c) => c.id === counterId)
    if (!counter || !counter.currentTicketId) return

    setTickets((prev) =>
      prev.map((t) => (t.id === counter.currentTicketId ? { ...t, status: 'NO_SHOW' as const } : t))
    )

    setCounters((prev) =>
      prev.map((c) =>
        c.id === counterId
          ? { ...c, status: 'OPEN', currentTicketId: undefined, currentTicketNumber: undefined }
          : c
      )
    )

    showToast('Marked No-Show', `Customer did not present at Counter ${counter.number}.`, 'warning')
  }

  // Transfer Ticket
  const transferTicket = (ticketId: string, targetDeptId: string) => {
    const dept = venueConfig.departments.find((d) => d.id === targetDeptId)
    if (!dept) return

    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              departmentId: targetDeptId,
              departmentName: dept.name,
              status: 'WAITING',
              counterId: undefined,
              counterNumber: undefined,
            }
          : t
      )
    )
    showToast('Ticket Transferred', `Ticket ${ticketId} routed to ${dept.name}.`, 'info')
  }

  // Set Counter Status
  const setCounterStatus = (counterId: string, status: CounterStatus) => {
    setCounters((prev) => prev.map((c) => (c.id === counterId ? { ...c, status } : c)))
  }

  // Apply AI Recommendation
  const applyRecommendation = (recId: string) => {
    const rec = recommendations.find((r) => r.id === recId)
    if (!rec) return

    if (rec.actionType === 'OPEN_COUNTER') {
      // Find a closed or break counter and open it
      setCounters((prev) => {
        let changed = false
        return prev.map((c) => {
          if (!changed && (c.status === 'CLOSED' || c.status === 'ON_BREAK')) {
            changed = true
            return { ...c, status: 'OPEN' }
          }
          return c
        })
      })
    } else if (rec.actionType === 'TRIAGE_REVISE') {
      // Fast-track top priority ticket
      setTickets((prev) =>
        prev.map((t) =>
          t.priority === 'EMERGENCY_TRIAGE' ? { ...t, estimatedWaitMinutes: 1 } : t
        )
      )
    }

    setRecommendations((prev) =>
      prev.map((r) => (r.id === recId ? { ...r, applied: true } : r))
    )

    showToast('AI Action Applied', rec.impactText, 'success')
  }

  // Surge Simulation
  const triggerSurgeSimulation = () => {
    const surgeCount = 5
    const now = Date.now()
    const opdDept = venueConfig.departments[0]

    const newSurgeTickets: Ticket[] = Array.from({ length: surgeCount }).map((_, i) => ({
      id: `${opdDept.code}-${250 + i}`,
      dbId: `surge-${now}-${i}`,
      venueId: venue,
      departmentId: opdDept.id,
      departmentName: opdDept.name,
      serviceName: 'Surge Consultation',
      customerName: `Surge Visitor ${i + 1}`,
      customerPhone: `+1 (555) 000-09${i}2`,
      priority: i === 0 ? 'SENIOR' : 'STANDARD',
      status: 'WAITING',
      issuedAt: now,
      estimatedWaitMinutes: 8 + i * 3,
      notificationsEnabled: false,
    }))

    setTickets((prev) => [...prev, ...newSurgeTickets])

    // Update heatmap
    setHeatmapZones((prev) =>
      prev.map((z) =>
        z.id === 'zone-waiting-a'
          ? { ...z, currentCount: Math.min(z.maxCapacity, z.currentCount + surgeCount), status: 'CRITICAL' }
          : z
      )
    )

    playAlertChime()
    showToast('Simulated Surge Injected', `${surgeCount} new visitors entered the queue. AI alert generated.`, 'urgent')
  }

  const toggleSimulation = () => setIsSimulationActive((prev) => !prev)
  const toggleSound = () => setSoundEnabled((prev) => !prev)
  const toggleSpeech = () => setSpeechEnabled((prev) => !prev)

  const resetToDefault = () => {
    setCounters(getInitialCounters(venue))
    setTickets(getInitialTickets(venue))
    setHeatmapZones(INITIAL_HEATMAP_ZONES)
    setRecommendations(INITIAL_AI_RECOMMENDATIONS)
    setMyTicket(null)
    showToast('Reset Complete', 'Loaded clean initial state.', 'info')
  }

  // Background Simulation Loop
  const simRef = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    if (!isSimulationActive) return

    simRef.current = setInterval(() => {
      // 1. Randomly serve a busy counter after its service time
      setCounters((prevCounters) => {
        const busyCounters = prevCounters.filter((c) => c.status === 'BUSY')
        if (busyCounters.length === 0) return prevCounters

        // Pick one randomly to finish
        if (Math.random() < 0.25) {
          const chosen = busyCounters[Math.floor(Math.random() * busyCounters.length)]
          // complete ticket
          setTickets((prevTickets) =>
            prevTickets.map((t) =>
              t.id === chosen.currentTicketId
                ? { ...t, status: 'COMPLETED' as const, completedAt: Date.now() }
                : t
            )
          )
          return prevCounters.map((c) =>
            c.id === chosen.id
              ? { ...c, status: 'OPEN', currentTicketId: undefined, currentTicketNumber: undefined }
              : c
          )
        }
        return prevCounters
      })

      // 2. If any open counter has waiting tickets, automatically call next
      setCounters((prevCounters) => {
        const openCounter = prevCounters.find((c) => c.status === 'OPEN')
        if (openCounter && Math.random() < 0.35) {
          setTickets((prevTickets) => {
            const waiting = prevTickets.filter((t) => t.status === 'WAITING')
            if (waiting.length === 0) return prevTickets
            const target = waiting[0]

            const updated: Ticket = {
              ...target,
              status: 'SERVING',
              calledAt: Date.now(),
              counterId: openCounter.id,
              counterNumber: openCounter.number,
              counterStaff: openCounter.staffName,
              estimatedWaitMinutes: 0,
            }

            // Check if myTicket
            setMyTicket((current) => {
              if (current && current.id === target.id) {
                return updated
              }
              return current
            })

            return prevTickets.map((t) => (t.id === target.id ? updated : t))
          })

          return prevCounters.map((c) =>
            c.id === openCounter.id
              ? {
                  ...c,
                  status: 'BUSY',
                  currentTicketId: 'BUSY',
                  ticketsServedCount: c.ticketsServedCount + 1,
                }
              : c
          )
        }
        return prevCounters
      })

      // 3. Fluctuate heatmap zones slightly
      setHeatmapZones((prev) =>
        prev.map((z) => {
          const delta = Math.floor(Math.random() * 3) - 1
          const newCount = Math.max(2, Math.min(z.maxCapacity, z.currentCount + delta))
          const ratio = newCount / z.maxCapacity
          return {
            ...z,
            currentCount: newCount,
            status: ratio > 0.8 ? 'CRITICAL' : ratio > 0.5 ? 'ELEVATED' : 'OPTIMAL',
          }
        })
      )
    }, 7000)

    return () => {
      if (simRef.current) clearInterval(simRef.current)
    }
  }, [isSimulationActive])

  return (
    <QueueContext.Provider
      value={{
        venue,
        venueConfig,
        counters,
        tickets,
        myTicket,
        ticketHistory,
        heatmapZones,
        recommendations,
        stats,
        isSimulationActive,
        soundEnabled,
        speechEnabled,
        toastAlert,
        switchVenue,
        joinQueue,
        cancelMyTicket,
        snoozeMyTicket,
        callNextTicket,
        recallTicket,
        completeService,
        holdTicket,
        markNoShow,
        transferTicket,
        setCounterStatus,
        applyRecommendation,
        toggleSimulation,
        toggleSound,
        toggleSpeech,
        triggerSurgeSimulation,
        dismissToast,
        clearMyTicket,
        resetToDefault,
      }}
    >
      {children}
    </QueueContext.Provider>
  )
}

export const useQueue = (): QueueContextType => {
  const context = useContext(QueueContext)
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider')
  }
  return context
}
