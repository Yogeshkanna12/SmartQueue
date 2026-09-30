import React from 'react'
import { Activity, Shield, Sparkles, Building2, Radio } from 'lucide-react'
import { useQueue } from '@/context/QueueContext'
import type { ActiveTab } from '@/components/layout/Navbar'
import type { VenueType } from '@/types/queue'
import { VENUES } from '@/data/mockData'

export const Footer: React.FC<{
  setActiveTab: (tab: ActiveTab) => void
  onOpenJoinModal: () => void
}> = ({ setActiveTab, onOpenJoinModal }) => {
  const { venue, switchVenue, stats } = useQueue()

  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#060910] text-slate-400 text-xs py-12 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-800/80">
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Radio className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm text-white tracking-wider">
                SMARTQUEUE
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Intelligent crowd and queue management system reducing waiting times, preventing congestion, and forecasting arrival dynamics in real time.
            </p>
            <div className="flex items-center space-x-2 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono text-emerald-400">
                AI Queue Optimization Active • 99.8% SLA
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Workspaces
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('landing')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  System Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('join')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Join Queue
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('my-ticket')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  My Digital Pass
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('kiosk')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Waiting TV Kiosk
                </button>
              </li>
            </ul>
          </div>

          {/* Operations */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Operations &amp; AI
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('staff')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Staff Counter Desk
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Predictive Wait Forecasting
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('heatmap')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Crowd Density Heatmap
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenJoinModal}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  + Instant Ticket Modal
                </button>
              </li>
            </ul>
          </div>

          {/* Facility Presets */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Venue Simulation Context
            </h4>
            <div className="space-y-1.5 pt-1">
              {(Object.keys(VENUES) as VenueType[]).map((vKey) => (
                <button
                  key={vKey}
                  onClick={() => switchVenue(vKey)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    venue === vKey
                      ? 'bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20'
                      : 'hover:bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="truncate">{VENUES[vKey].name}</span>
                  {venue === vKey && <span className="text-[10px] font-mono">ACTIVE</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} SmartQueue Systems. Built with React, TypeScript, GSAP, HTML Canvas &amp; Tailwind CSS.
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-slate-400">Throughput: {stats.throughputPerHour} served/hr</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-400">Wait: ~{stats.avgWaitMinutes}m nominal</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
export default Footer
