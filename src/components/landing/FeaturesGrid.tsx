import React from 'react'
import {
  Users,
  Compass,
  Radio,
  Sparkles,
  Sliders,
  ArrowRight,
  TrendingDown,
  BellRing,
  QrCode,
} from 'lucide-react'
import Card from '@/components/ui/Card'

export const FeaturesGrid: React.FC<{
  onSelectFeature?: (tab: string) => void
}> = ({ onSelectFeature }) => {
  const pillars = [
    {
      badge: 'PEOPLE',
      title: 'Human-Centered Flow',
      description:
        'Replaces anxious, physical standing lines with relaxed virtual queues, allowing visitors to wait anywhere with dignity.',
      icon: <Users className="w-5 h-5 text-emerald-400" />,
      color: 'border-emerald-500/20',
      action: 'my-ticket',
      actionLabel: 'See Citizen Pass',
    },
    {
      badge: 'FLOW',
      title: 'Predictive Stage Routing',
      description:
        'Continuous dynamic queuing stages: Check-In → Lounge Waiting → 5-Min Warning → Desk Call → Resolution.',
      icon: <Compass className="w-5 h-5 text-cyan-400" />,
      color: 'border-cyan-500/20',
      action: 'kiosk',
      actionLabel: 'View TV Display',
    },
    {
      badge: 'STATUS',
      title: 'Sub-Second Real-Time Telemetry',
      description:
        'Dynamic wait-time recalculations updated in real time. WebSocket/audio broadcast announcements for seamless calls.',
      icon: <Radio className="w-5 h-5 text-teal-400" />,
      color: 'border-teal-500/20',
      action: 'kiosk',
      actionLabel: 'Live Kiosk Board',
    },
    {
      badge: 'INTELLIGENCE',
      title: 'Surge Prediction & AI Advisor',
      description:
        'Poisson arrival forecasting flags bottlenecks up to 45 minutes in advance and recommends optimal counter allocations.',
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      color: 'border-purple-500/20',
      action: 'analytics',
      actionLabel: 'Explore AI Engine',
    },
    {
      badge: 'CONTROL',
      title: 'Staff Command Station',
      description:
        'Streamlined 1-click workflows for desk officers: Call Next, Recall, Hold, Transfer, and Triage Priority with zero friction.',
      icon: <Sliders className="w-5 h-5 text-amber-400" />,
      color: 'border-amber-500/20',
      action: 'staff',
      actionLabel: 'Open Staff Desk',
    },
    {
      badge: 'OMNI-CHANNEL',
      title: 'Mobile Passports & Kiosks',
      description:
        'Zero app download required. Instant digital QR pass via web browser, simulated SMS alerts, and wall TV monitors.',
      icon: <QrCode className="w-5 h-5 text-blue-400" />,
      color: 'border-blue-500/20',
      action: 'join',
      actionLabel: 'Get Digital Pass',
    },
  ]

  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="max-w-3xl mx-auto mb-16">
        <p className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold mb-2">
          Architecture &amp; Core Pillars
        </p>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          One System. Total Queue Fluidity.
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mt-3">
          Designed from first principles to harmonize human behavior with intelligent operational orchestration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
        {pillars.map((item, idx) => (
          <Card
            key={idx}
            className={`p-6 bg-slate-900/80 border ${item.color} flex flex-col justify-between hover:border-slate-600 transition-all`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  {item.icon}
                </div>
                <span className="text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {item.badge}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-100">{item.title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                {item.description}
              </p>
            </div>

            {onSelectFeature && (
              <div className="pt-6 mt-4 border-t border-slate-800/80">
                <button
                  onClick={() => onSelectFeature(item.action)}
                  className="inline-flex items-center text-xs font-semibold text-emerald-400 hover:text-emerald-300 group"
                >
                  <span>{item.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </section>
  )
}
export default FeaturesGrid
