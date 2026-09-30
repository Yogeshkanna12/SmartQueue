import React from 'react'
import {
  HeartPulse,
  Landmark,
  Building,
  GraduationCap,
  CheckCircle,
  Clock,
  Shield,
  ArrowRight,
} from 'lucide-react'
import { useQueue } from '@/context/QueueContext'
import { VENUES } from '@/data/mockData'
import type { VenueType } from '@/types/queue'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export const SectorShowcase: React.FC<{ onJoinQueue: () => void }> = ({ onJoinQueue }) => {
  const { venue, switchVenue } = useQueue()

  const sectors: {
    id: VenueType
    name: string
    icon: React.ReactNode
    highlights: string[]
    metric: string
    metricLabel: string
  }[] = [
    {
      id: 'hospital',
      name: 'Hospitals & Clinics',
      icon: <HeartPulse className="w-5 h-5 text-emerald-400" />,
      highlights: [
        'Automated Emergency Triage escalation protocol',
        'Senior citizen & accessibility fast-track lanes',
        'Direct pharmacy and lab pickup routing',
      ],
      metric: '3.8m',
      metricLabel: 'Average Acute Triage Response',
    },
    {
      id: 'bank',
      name: 'Banks & Financial Hubs',
      icon: <Landmark className="w-5 h-5 text-indigo-400" />,
      highlights: [
        'High-value wealth advisor appointment routing',
        'Cash teller vs document underwriting separation',
        'SMS summons when turn approaches within 5 minutes',
      ],
      metric: '94%',
      metricLabel: 'Teller Utilization Rate',
    },
    {
      id: 'civic',
      name: 'DMV & Government Offices',
      icon: <Building className="w-5 h-5 text-cyan-400" />,
      highlights: [
        'Eliminate outdoor lines with virtual mobile check-in',
        'Document pre-validation to avoid turnaround delays',
        'Multi-language audio chimes & digital kiosk TV signage',
      ],
      metric: '-52%',
      metricLabel: 'Lobby Congestion Reduction',
    },
    {
      id: 'university',
      name: 'Universities & Colleges',
      icon: <GraduationCap className="w-5 h-5 text-purple-400" />,
      highlights: [
        'Peak semester registration rush balancing',
        'Financial aid & transcript window synchronization',
        'Interactive campus map routing to service desks',
      ],
      metric: '1,800+',
      metricLabel: 'Students Handled Daily',
    },
  ]

  const activeSector = sectors.find((s) => s.id === venue) || sectors[0]
  const venueData = VENUES[venue]

  return (
    <section className="py-16 sm:py-24 border-t border-slate-800/80 bg-[#070b13]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold mb-2">
            Tailored Industry Frameworks
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for Any High-Footfall Facility
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            SmartQueue dynamically recalibrates priority rules, handling SLAs, and staff allocations based on your venue type.
          </p>
        </div>

        {/* Sector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {sectors.map((sec) => {
            const isSelected = venue === sec.id
            return (
              <button
                key={sec.id}
                onClick={() => switchVenue(sec.id)}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`p-2 rounded-xl ${
                      isSelected ? 'bg-emerald-500/15' : 'bg-slate-900'
                    }`}
                  >
                    {sec.icon}
                  </div>
                  {isSelected && (
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">{sec.name}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Click to preview context</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Active Sector Detailed Panel */}
        <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            <div className="lg:col-span-7 space-y-5">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                  Facility In Action
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">{venueData.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{venueData.address}</p>
              </div>

              <div className="space-y-3">
                {activeSector.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-200">{item}</span>
                  </div>
                ))}
              </div>

              {/* Department Pills in this venue */}
              <div className="pt-2">
                <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  Configured Active Queues:
                </p>
                <div className="flex flex-wrap gap-2">
                  {venueData.departments.map((dept) => (
                    <span
                      key={dept.id}
                      className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-medium text-slate-300 flex items-center space-x-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dept.color }} />
                      <span>{dept.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">({dept.avgServiceMinutes}m)</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="emerald"
                  size="md"
                  onClick={onJoinQueue}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Join {venueData.name} Queue
                </Button>
              </div>
            </div>

            {/* Right KPI Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-6">
              <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 inline-flex">
                <Clock className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-extrabold text-white font-mono">
                  {activeSector.metric}
                </div>
                <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mt-1">
                  {activeSector.metricLabel}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-4 text-left">
                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase">Compliance</span>
                  <div className="text-lg font-bold text-emerald-400 font-mono">99.8%</div>
                </div>
                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase">Wait Reduction</span>
                  <div className="text-lg font-bold text-teal-400 font-mono">-47%</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
export default SectorShowcase
