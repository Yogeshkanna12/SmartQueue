import React, { useState, useEffect } from 'react'
import {
  Tv,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Clock,
  Sparkles,
  Radio,
  Users,
  AlertTriangle,
} from 'lucide-react'
import { useQueue } from '@/context/QueueContext'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { playQueueChime, speakTicketAnnouncement } from '@/utils/sound'

export const LiveKioskDisplay: React.FC = () => {
  const {
    venueConfig,
    counters,
    tickets,
    soundEnabled,
    speechEnabled,
    toggleSound,
    toggleSpeech,
    callNextTicket,
  } = useQueue()

  const [currentTime, setCurrentTime] = useState(new Date())
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true))
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false))
    }
  }

  // Find the most recently called or currently active ticket
  const servingTickets = tickets.filter(
    (t) => t.status === 'SERVING' || t.status === 'CALLING'
  )
  const mostRecentTicket = servingTickets.sort(
    (a, b) => (b.calledAt || 0) - (a.calledAt || 0)
  )[0]

  // Next tickets in line
  const waitingTickets = tickets
    .filter((t) => t.status === 'WAITING')
    .slice(0, 6)

  return (
    <div
      className={`w-full min-h-[90vh] bg-[#070b13] text-white p-4 sm:p-6 lg:p-8 flex flex-col justify-between select-none ${
        isFullscreen ? 'fixed inset-0 z-50 overflow-y-auto' : ''
      }`}
    >
      {/* Kiosk Top Broadcast Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-ping" />
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-400 font-bold">
              PUBLIC WAITING LOUNGE BROADCAST
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {venueConfig.name}
            </h1>
          </div>
        </div>

        {/* Live Clock & Audio Controls */}
        <div className="flex items-center space-x-3 self-end sm:self-center">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs sm:text-sm text-cyan-400">
            <Clock className="w-4 h-4" />
            <span>{currentTime.toLocaleTimeString()}</span>
          </div>

          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border transition-colors ${
              soundEnabled
                ? 'bg-slate-900 border-slate-800 text-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title="Audio Broadcast Chimes"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Toggle TV Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Kiosk Center Split */}
      <div className="my-6 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-stretch">
        {/* Left: Giant "NOW SERVING" Spotlight Card */}
        <div className="lg:col-span-5 flex flex-col">
          <Card className="flex-1 p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border-2 border-emerald-500/50 shadow-2xl shadow-emerald-500/10 flex flex-col justify-between text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold tracking-widest uppercase mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>NOW CALLING / SERVING</span>
              </div>

              {mostRecentTicket ? (
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                      Ticket Identifier
                    </span>
                    <div className="text-6xl sm:text-7xl lg:text-8xl font-black text-white font-mono tracking-tight animate-in zoom-in-95 duration-300">
                      {mostRecentTicket.id}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-400 uppercase">Destination</span>
                      <span className="text-sm font-bold text-emerald-400 font-mono">
                        COUNTER {mostRecentTicket.counterNumber || 1}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-white">
                      {mostRecentTicket.counterStaff || 'Consultation Officer'}
                    </div>
                    <p className="text-xs text-slate-400">
                      {mostRecentTicket.departmentName} — {mostRecentTicket.serviceName}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500">
                  <Radio className="w-12 h-12 mx-auto mb-3 opacity-40 animate-pulse" />
                  <p className="text-sm font-mono">ALL COUNTERS CURRENTLY IDLE</p>
                </div>
              )}
            </div>

            {/* Quick Action for Demo Testing */}
            <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                {servingTickets.length} currently being served
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (mostRecentTicket) {
                    playQueueChime(0.35)
                    speakTicketAnnouncement(mostRecentTicket.id, mostRecentTicket.counterNumber || 1)
                  }
                }}
                icon={<Volume2 className="w-4 h-4 text-emerald-400" />}
              >
                Announce
              </Button>
            </div>
          </Card>
        </div>

        {/* Right: Counter Status Grid */}
        <div className="lg:col-span-7 flex flex-col space-y-4 text-left">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              Facility Desks &amp; Counters Status
            </h3>
            <span className="text-[11px] font-mono text-emerald-400">
              {counters.filter((c) => c.status === 'BUSY').length} / {counters.length} Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 flex-1">
            {counters.map((cnt) => {
              const isBusy = cnt.status === 'BUSY'
              const isOpen = cnt.status === 'OPEN'
              return (
                <Card
                  key={cnt.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isBusy
                      ? 'bg-slate-900/90 border-emerald-500/40'
                      : isOpen
                      ? 'bg-slate-900/50 border-cyan-500/30'
                      : 'bg-slate-950/40 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-slate-300">
                      COUNTER {cnt.number}
                    </span>
                    <Badge status={cnt.status} size="sm" />
                  </div>

                  <div className="my-2">
                    <div className="text-[11px] font-mono text-slate-400 uppercase">
                      Current Ticket
                    </div>
                    <div className="text-2xl font-black font-mono text-white">
                      {cnt.currentTicketNumber || '—'}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 truncate">
                    <div className="font-semibold text-slate-200 truncate">{cnt.staffName}</div>
                    <div className="truncate text-slate-500">{cnt.name}</div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      {/* Bottom Bar: "Up Next in Queue" Ribbon */}
      <div className="pt-4 border-t border-slate-800 text-left">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center space-x-1.5">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>Next In Line (Preparing to Call)</span>
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            {waitingTickets.length} waiting
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {waitingTickets.length > 0 ? (
            waitingTickets.map((t, idx) => (
              <div
                key={t.id}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-left space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-white font-mono">{t.id}</span>
                  <span className="text-[10px] font-mono text-slate-500">#{idx + 1}</span>
                </div>
                <div className="text-[11px] text-slate-400 truncate">{t.customerName}</div>
                <div className="text-[10px] font-mono text-emerald-400">
                  ~{t.estimatedWaitMinutes}m wait
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-2 text-center text-xs text-slate-500 font-mono">
              Queue is clear. No waiting tickets.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default LiveKioskDisplay
