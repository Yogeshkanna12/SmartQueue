import React from 'react'
import { ArrowRight, Tv, ShieldCheck, Zap, Activity, Users } from 'lucide-react'
import { CrowdCanvas } from '@/components/canvas/CrowdCanvas'
import { useQueue } from '@/context/QueueContext'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

interface HeroSectionProps {
  onJoinQueue: () => void
  onViewLiveKiosk: () => void
  onExploreStaff: () => void
  onViewHeatmap: () => void
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onJoinQueue,
  onViewLiveKiosk,
  onExploreStaff,
  onViewHeatmap,
}) => {
  const { stats, venueConfig, tickets, counters } = useQueue()

  const busyCounters = counters.filter((c) => c.status === 'BUSY').length
  const openCounters = counters.filter((c) => c.status === 'OPEN').length

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden pt-8 pb-12">
      {/* Background Interactive Crowd Canvas */}
      <div className="absolute inset-0 z-0 pointer-events-auto opacity-75">
        <CrowdCanvas
          density="medium"
          flowSpeed={1.1}
          showFlowLines={true}
          interactive={true}
          height="100%"
        />
        {/* Subtle radial gradients to enhance contrast of text */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-[#090d16]/70 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(9,13,22,0.3)_0%,rgba(9,13,22,0.85)_100%)] pointer-events-none" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex-1 flex flex-col justify-center items-center">
        {/* Category Pill */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 shadow-lg shadow-emerald-500/10 mb-6 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-500">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
            {venueConfig.name}
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-[11px] text-slate-300 font-medium">
            AI-Driven Queueing Protocol
          </span>
        </div>

        {/* Brand Eyebrow */}
        <div className="space-y-1 mb-3">
          <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.25em] text-slate-400 font-semibold">
            SMARTQUEUE • INTELLIGENT CROWD &amp; QUEUE MANAGEMENT
          </p>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.08] mb-6">
          Turn Crowds{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Into Flow.
          </span>
        </h1>

        {/* Supporting Text */}
        <p className="text-base sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed mb-8">
          Real-time queue intelligence that helps people spend less time waiting.
          Designed for hospitals, banks, civic centers, and campuses.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto mb-12">
          <Button
            size="lg"
            variant="emerald"
            onClick={onJoinQueue}
            className="w-full sm:w-auto text-base font-bold shadow-xl shadow-emerald-500/25 group"
          >
            <span>Join the Queue</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            size="lg"
            variant="secondary"
            onClick={onViewLiveKiosk}
            icon={<Tv className="w-4 h-4 text-cyan-400" />}
            className="w-full sm:w-auto"
          >
            View Live Status
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={onExploreStaff}
            className="w-full sm:w-auto"
          >
            Staff Desk
          </Button>
        </div>

        {/* Live Facility Telemetry HUD Card */}
        <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-left">
          <Card className="p-4 bg-slate-900/80 border-slate-800 backdrop-blur-xl">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-mono uppercase tracking-wider">Est. Wait Time</span>
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              ~{stats.avgWaitMinutes} <span className="text-sm font-normal text-slate-400">mins</span>
            </div>
            <p className="text-[11px] text-emerald-400 font-medium mt-1">
              ↓ 47% vs static arrival
            </p>
          </Card>

          <Card className="p-4 bg-slate-900/80 border-slate-800 backdrop-blur-xl">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-mono uppercase tracking-wider">In Queue Now</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {stats.activeInQueue}{' '}
              <span className="text-sm font-normal text-slate-400">visitors</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {tickets.filter((t) => t.status === 'SERVING').length} currently with staff
            </p>
          </Card>

          <Card className="p-4 bg-slate-900/80 border-slate-800 backdrop-blur-xl">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-mono uppercase tracking-wider">Active Desks</span>
              <Activity className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {busyCounters + openCounters}
              <span className="text-sm font-normal text-slate-400"> / {counters.length}</span>
            </div>
            <div className="flex items-center space-x-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[11px] text-slate-300">{busyCounters} serving</span>
            </div>
          </Card>

          <Card
            onClick={onViewHeatmap}
            className="p-4 bg-slate-900/80 border-slate-800 backdrop-blur-xl cursor-pointer hover:border-emerald-500/50 transition-colors"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-mono uppercase tracking-wider">Flow Index</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono flex items-center space-x-2">
              <span>{100 - stats.congestionIndex}%</span>
              <Badge
                variant={stats.congestionIndex > 75 ? 'red' : stats.congestionIndex > 45 ? 'amber' : 'emerald'}
                size="sm"
              >
                {stats.congestionIndex > 75 ? 'Surge' : 'Smooth'}
              </Badge>
            </div>
            <p className="text-[11px] text-cyan-400 hover:underline mt-1">
              Explore Heatmap →
            </p>
          </Card>
        </div>
      </div>
    </section>
  )
}
export default HeroSection
