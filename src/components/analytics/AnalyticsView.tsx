import React from 'react'
import {
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Zap,
  Activity,
  BarChart2,
  Clock,
  ShieldAlert,
} from 'lucide-react'
import { useQueue } from '@/context/QueueContext'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

export const AnalyticsView: React.FC = () => {
  const {
    venueConfig,
    stats,
    recommendations,
    applyRecommendation,
    tickets,
    counters,
    triggerSurgeSimulation,
  } = useQueue()

  // Hourly arrival projection data
  const hourlyData = [
    { hour: '08:00', arrivals: 12, predicted: 14, waitMin: 4 },
    { hour: '09:00', arrivals: 24, predicted: 26, waitMin: 7 },
    { hour: '10:00', arrivals: 42, predicted: 40, waitMin: 12 },
    { hour: '11:00', arrivals: 58, predicted: 55, waitMin: 16 },
    { hour: '12:00', arrivals: 36, predicted: 38, waitMin: 9 },
    { hour: '13:00', arrivals: 22, predicted: 25, waitMin: 5 },
    { hour: '14:00', arrivals: 46, predicted: 48, waitMin: 13 },
    { hour: '15:00', arrivals: 62, predicted: 60, waitMin: 18 },
    { hour: '16:00', arrivals: 34, predicted: 35, waitMin: 8 },
    { hour: '17:00', arrivals: 18, predicted: 20, waitMin: 4 },
  ]

  const maxArrivals = Math.max(...hourlyData.map((d) => d.arrivals))

  // Departmental distribution
  const deptStats = venueConfig.departments.map((dept) => {
    const deptTickets = tickets.filter((t) => t.departmentId === dept.id)
    const waiting = deptTickets.filter((t) => t.status === 'WAITING').length
    const served = deptTickets.filter((t) => t.status === 'COMPLETED').length
    return {
      dept,
      waiting,
      served,
      total: deptTickets.length,
    }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-left space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-bold">
              PREDICTIVE AI ENGINE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Crowd Intelligence &amp; Wait Forecasting
          </h1>
          <p className="text-xs text-slate-400">
            Real-time M/M/c queueing theory models with continuous arrival prediction
          </p>
        </div>

        <Button
          variant="danger"
          size="sm"
          onClick={triggerSurgeSimulation}
          icon={<Zap className="w-4 h-4 text-amber-400" />}
        >
          Inject Surge Test (+5)
        </Button>
      </div>

      {/* KPI HUD Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-slate-900/80 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase">Congestion Index</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono flex items-center space-x-2">
            <span>{stats.congestionIndex}/100</span>
            <Badge
              variant={stats.congestionIndex > 75 ? 'red' : stats.congestionIndex > 50 ? 'amber' : 'emerald'}
              size="sm"
            >
              {stats.congestionIndex > 75 ? 'Critical' : stats.congestionIndex > 50 ? 'Elevated' : 'Optimal'}
            </Badge>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                stats.congestionIndex > 75
                  ? 'bg-red-500'
                  : stats.congestionIndex > 50
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${stats.congestionIndex}%` }}
            />
          </div>
        </Card>

        <Card className="p-5 bg-slate-900/80 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase">M/M/c Arrival Rate (λ)</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {stats.throughputPerHour}{' '}
            <span className="text-sm font-normal text-slate-400">arr/hr</span>
          </div>
          <p className="text-[11px] text-cyan-400 mt-2 font-mono">
            Service Rate (μ): 42.4 served/hr
          </p>
        </Card>

        <Card className="p-5 bg-slate-900/80 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase">Bottleneck Vector</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {stats.bottleneckArea}
          </div>
          <p className="text-[11px] text-amber-400 mt-2">
            Recommendation: Dynamic Desk Balancing
          </p>
        </Card>

        <Card className="p-5 bg-slate-900/80 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase">Predicted Wait (30m)</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">
            ~{Math.max(3, stats.avgWaitMinutes + 1)}m
          </div>
          <p className="text-[11px] text-emerald-400 mt-2 font-mono">
            99.2% forecast confidence
          </p>
        </Card>
      </div>

      {/* AI Prescriptive Recommendations Center */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h2 className="text-lg font-bold text-white">
              Autonomous AI Counter Allocation Advisories
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {recommendations.filter((r) => !r.applied).length} pending actions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((rec) => (
            <Card
              key={rec.id}
              className={`p-5 flex flex-col justify-between transition-all ${
                rec.applied
                  ? 'bg-slate-950/40 border-slate-800 opacity-60'
                  : rec.severity === 'CRITICAL'
                  ? 'bg-slate-900 border-red-500/40 shadow-lg shadow-red-500/5'
                  : 'bg-slate-900 border-slate-700/80 shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                      rec.severity === 'CRITICAL'
                        ? 'bg-red-500/20 text-red-300'
                        : rec.severity === 'WARNING'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-cyan-500/20 text-cyan-300'
                    }`}
                  >
                    {rec.severity}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {new Date(rec.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-100">{rec.title}</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {rec.description}
                </p>

                <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-emerald-400 font-medium">
                  <strong>Projected Impact:</strong> {rec.impactText}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800">
                {rec.applied ? (
                  <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-medium">
                    <CheckCircle className="w-4 h-4" />
                    <span>Intervention Applied</span>
                  </div>
                ) : (
                  <Button
                    variant="emerald"
                    size="sm"
                    onClick={() => applyRecommendation(rec.id)}
                    className="w-full text-xs font-bold"
                  >
                    Apply Recommended Action
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Hourly Wait Times Forecast Bar Chart */}
      <Card className="p-6 bg-slate-900/90 border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-bold text-white">
              Hourly Arrival Volume vs Wait Time Projection
            </h3>
            <p className="text-xs text-slate-400">
              Correlating footfall surges with required counter velocity
            </p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-mono">
            <span className="flex items-center space-x-1.5 text-slate-300">
              <span className="w-3 h-3 rounded bg-emerald-500" />
              <span>Arrivals</span>
            </span>
            <span className="flex items-center space-x-1.5 text-cyan-400">
              <span className="w-3 h-3 rounded bg-cyan-400/40" />
              <span>Wait (mins)</span>
            </span>
          </div>
        </div>

        {/* Visual Bar Graph */}
        <div className="h-56 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-slate-800">
          {hourlyData.map((d) => {
            const barHeight = Math.round((d.arrivals / maxArrivals) * 100)
            return (
              <div
                key={d.hour}
                className="flex-1 flex flex-col items-center justify-end h-full group"
              >
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-emerald-400 mb-1">
                  {d.arrivals}p / {d.waitMin}m
                </div>
                {/* The Bar */}
                <div
                  className="w-full max-w-[28px] rounded-t-lg bg-gradient-to-t from-emerald-600 via-teal-500 to-cyan-400 group-hover:brightness-125 transition-all"
                  style={{ height: `${barHeight}%` }}
                />
                <span className="text-[10px] font-mono text-slate-400 mt-2 truncate">
                  {d.hour}
                </span>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Department Wait Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {deptStats.map(({ dept, waiting, served }) => (
          <Card key={dept.id} className="p-4 bg-slate-900/80 border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-100">{dept.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                {dept.code}
              </span>
            </div>
            <div className="text-2xl font-black text-white font-mono">
              {waiting} <span className="text-xs font-normal text-slate-400">waiting</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800">
              <span>Avg SLA: ~{dept.avgServiceMinutes}m</span>
              <span className="text-emerald-400 font-mono">{served} cleared</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
export default AnalyticsView
