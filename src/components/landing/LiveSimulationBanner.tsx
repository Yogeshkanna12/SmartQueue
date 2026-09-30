import React from 'react'
import { Zap, Volume2, Users, ArrowUpRight } from 'lucide-react'
import { useQueue } from '@/context/QueueContext'
import Button from '@/components/ui/Button'
import { playQueueChime } from '@/utils/sound'

export const LiveSimulationBanner: React.FC<{
  onGoToKiosk: () => void
  onGoToAnalytics: () => void
}> = ({ onGoToKiosk, onGoToAnalytics }) => {
  const {
    isSimulationActive,
    toggleSimulation,
    triggerSurgeSimulation,
    stats,
  } = useQueue()

  return (
    <section className="py-12 border-t border-slate-800/80 bg-gradient-to-r from-slate-950 via-[#0a1220] to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-emerald-500/30 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 text-left max-w-xl">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>INTERACTIVE DEMO SANDBOX</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Stress-Test SmartQueue in Real Time
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Inject simulated crowd spikes, observe dynamic Poisson wait time recalculations,
              and test the autonomous AI desk allocation engine live.
            </p>
          </div>

          {/* Interactive Control Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              variant="danger"
              size="md"
              onClick={triggerSurgeSimulation}
              icon={<Zap className="w-4 h-4 text-amber-400" />}
            >
              Trigger Crowd Surge (+5)
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={() => playQueueChime(0.3)}
              icon={<Volume2 className="w-4 h-4 text-cyan-400" />}
            >
              Play Chime
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={onGoToAnalytics}
              icon={<ArrowUpRight className="w-4 h-4" />}
            >
              AI Insights
            </Button>

            <Button
              variant="emerald"
              size="md"
              onClick={onGoToKiosk}
            >
              Launch Wall Kiosk TV
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
export default LiveSimulationBanner
