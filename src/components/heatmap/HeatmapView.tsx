import React, { useState } from 'react'
import {
  Activity,
  Flame,
  Users,
  Compass,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { useQueue } from '@/context/QueueContext'
import type { HeatmapZone } from '@/types/queue'
import { FloorPlanCanvas } from '@/components/canvas/FloorPlanCanvas'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

export const HeatmapView: React.FC = () => {
  const { venueConfig, heatmapZones, triggerSurgeSimulation } = useQueue()

  const [selectedZone, setSelectedZone] = useState<HeatmapZone>(heatmapZones[2] || heatmapZones[0])
  const [showHeatmap, setShowHeatmap] = useState(true)
  const [showParticles, setShowParticles] = useState(true)

  const occupancyRatio = Math.round((selectedZone.currentCount / selectedZone.maxCapacity) * 100)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-left space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
              SPATIAL CROWD DYNAMICS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Facility Floor Plan &amp; Thermal Heatmap
          </h1>
          <p className="text-xs text-slate-400">
            Real-time pedestrian tracking, zone occupancy sensors, and density bottleneck mitigation
          </p>
        </div>

        {/* View Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
              showHeatmap
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            Heatmap: {showHeatmap ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => setShowParticles(!showParticles)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
              showParticles
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            Particles: {showParticles ? 'ON' : 'OFF'}
          </button>

          <Button
            variant="danger"
            size="sm"
            onClick={triggerSurgeSimulation}
            icon={<Zap className="w-3.5 h-3.5" />}
          >
            Spike Density (+5)
          </Button>
        </div>
      </div>

      {/* Main Grid: Floor Plan Canvas + Zone Detail HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Architectural Floor Plan Canvas */}
        <div className="lg:col-span-8">
          <FloorPlanCanvas
            zones={heatmapZones}
            onSelectZone={(z) => setSelectedZone(z)}
            selectedZoneId={selectedZone.id}
            showHeatmap={showHeatmap}
            showParticles={showParticles}
          />
          <p className="text-[11px] text-slate-400 font-mono mt-2">
            Tip: Click or hover over any architectural zone to inspect occupancy telemetry.
          </p>
        </div>

        {/* Right: Selected Zone Detailed Telemetry */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-6 bg-slate-900/90 border-slate-800 text-left">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                ZONE TELEMETRY
              </span>
              <Badge
                variant={
                  selectedZone.status === 'CRITICAL'
                    ? 'red'
                    : selectedZone.status === 'ELEVATED'
                    ? 'amber'
                    : 'emerald'
                }
                size="sm"
                pulsing={selectedZone.status === 'CRITICAL'}
              >
                {selectedZone.status}
              </Badge>
            </div>

            <h3 className="text-xl font-black text-white">{selectedZone.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">Category: {selectedZone.category}</p>

            <div className="mt-6 space-y-4">
              {/* Density Meter */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-400">Current Occupancy</span>
                  <span className="font-mono font-bold text-white">
                    {selectedZone.currentCount} / {selectedZone.maxCapacity} ({occupancyRatio}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      occupancyRatio > 80
                        ? 'bg-red-500'
                        : occupancyRatio > 50
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${occupancyRatio}%` }}
                  />
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    Flow Velocity
                  </span>
                  <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
                    {selectedZone.flowRatePerMin} p/min
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    Avg Dwell Time
                  </span>
                  <div className="text-lg font-bold text-cyan-400 font-mono mt-0.5">
                    ~{Math.round(selectedZone.currentCount * 0.45 + 3)} mins
                  </div>
                </div>
              </div>

              {/* Safety Recommendation */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="font-bold text-slate-200 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Ventilation &amp; Safety Rating</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {occupancyRatio > 80
                    ? 'Surge threshold breached. Autonomous diversion route recommended to Lounge B.'
                    : 'Operating safely within nominal threshold.'}
                </p>
              </div>
            </div>
          </Card>

          {/* Quick Zone Picker Pills */}
          <Card className="p-4 bg-slate-900/70 border-slate-800 text-left">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold block mb-2">
              Fast Jump to Zone:
            </span>
            <div className="flex flex-col space-y-1.5">
              {heatmapZones.map((z) => (
                <button
                  key={z.id}
                  onClick={() => setSelectedZone(z)}
                  className={`px-3 py-2 rounded-xl text-xs text-left transition-all flex items-center justify-between ${
                    selectedZone.id === z.id
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="font-medium truncate">{z.name}</span>
                  <span className="font-mono text-[11px] text-slate-400 shrink-0 ml-2">
                    {z.currentCount}/{z.maxCapacity}
                  </span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
export default HeatmapView
