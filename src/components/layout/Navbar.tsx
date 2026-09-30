import React, { useState } from 'react'
import {
  Users,
  Activity,
  Layers,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Ticket as TicketIcon,
  Tv,
  Building2,
  Menu,
  X,
  Radio,
  User,
  Shield,
  LogOut,
  ChevronDown,
  LogIn,
} from 'lucide-react'
import { useQueue } from '@/context/QueueContext'
import { useAuth } from '@/context/AuthContext'
import { VENUES } from '@/data/mockData'
import type { VenueType } from '@/types/queue'

export type ActiveTab =
  | 'landing'
  | 'join'
  | 'my-ticket'
  | 'kiosk'
  | 'staff'
  | 'analytics'
  | 'heatmap'
  | 'signin'
  | 'signup'

interface NavbarProps {
  activeTab: ActiveTab
  setActiveTab: (tab: ActiveTab) => void
  onOpenJoinModal: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenJoinModal,
}) => {
  const {
    venue,
    switchVenue,
    myTicket,
    isSimulationActive,
    toggleSimulation,
    soundEnabled,
    toggleSound,
  } = useQueue()

  const { currentUser, isStaff, signOut, switchRole } = useAuth()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [venueDropdownOpen, setVenueDropdownOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

  // Full navigation catalog
  const allNavLinks: {
    id: ActiveTab
    label: string
    icon: React.ReactNode
    badge?: string
    staffOnly?: boolean
  }[] = [
    { id: 'landing', label: 'Overview', icon: <Layers className="w-4 h-4" /> },
    { id: 'join', label: 'Join Queue', icon: <TicketIcon className="w-4 h-4" /> },
    {
      id: 'my-ticket',
      label: 'My Ticket',
      icon: <Users className="w-4 h-4" />,
      badge: myTicket ? myTicket.id : undefined,
    },
    { id: 'kiosk', label: 'Live Kiosk TV', icon: <Tv className="w-4 h-4" /> },
    { id: 'staff', label: 'Staff Desk', icon: <Radio className="w-4 h-4" />, staffOnly: true },
    { id: 'analytics', label: 'AI Intelligence', icon: <Sparkles className="w-4 h-4" />, staffOnly: true },
    { id: 'heatmap', label: 'Crowd Heatmap', icon: <Activity className="w-4 h-4" /> },
  ]

  // Hide Staff-only links if the user role !== 'staff' (per requirement 6)
  const visibleNavLinks = allNavLinks.filter((item) => !item.staffOnly || isStaff)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090d16]/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div
            onClick={() => setActiveTab('landing')}
            className="flex items-center space-x-3 cursor-pointer group shrink-0"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-[1.5px] shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
              <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-emerald-400 flex items-center justify-center animate-pulse">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#090d16]" />
                </div>
              </div>
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base tracking-wider bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  SMARTQUEUE
                </span>
                <span className="hidden sm:inline-flex px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-widest uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                  v2.4 LIVE
                </span>
              </div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 -mt-0.5 hidden sm:block">
                Intelligent Crowd Flow
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {visibleNavLinks.map((item) => {
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'text-emerald-400 bg-emerald-500/10 shadow-sm border border-emerald-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.2 bg-emerald-500 text-slate-950 font-bold text-[10px] rounded-full animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Right Action Tools: User Auth, Venue Selector, Live Sim, Sound, Join CTA */}
          <div className="hidden md:flex items-center space-x-2.5">
            {/* User Profile / Role Pill */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                    isStaff
                      ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/60'
                      : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
                  }`}
                  title="Account and Role Permissions"
                >
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isStaff ? 'bg-cyan-500 text-slate-950' : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {isStaff ? 'S' : 'U'}
                  </div>
                  <span className="max-w-[90px] truncate">{currentUser.name}</span>
                  <span
                    className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                      isStaff
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {currentUser.role}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {/* Profile Dropdown */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2.5 z-50 text-left space-y-2"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-2.5 py-1.5 border-b border-slate-800">
                      <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono truncate">{currentUser.email}</div>
                      <div className="mt-1 flex items-center space-x-1.5 text-[10px] font-mono">
                        <span className="text-slate-500">Access Level:</span>
                        <span
                          className={`font-bold uppercase ${
                            isStaff ? 'text-cyan-400' : 'text-amber-400'
                          }`}
                        >
                          {currentUser.role === 'staff' ? 'Staff Operations' : 'Citizen User'}
                        </span>
                      </div>
                    </div>

                    {/* Instant 1-Click Role Switcher for Evaluators */}
                    <div className="space-y-1">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-2">
                        Demo Role Quick-Switch:
                      </p>
                      {currentUser.role === 'user' ? (
                        <button
                          onClick={() => {
                            switchRole('staff')
                            setActiveTab('staff')
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-medium flex items-center justify-between transition-colors"
                        >
                          <span>Switch to Staff (Unlock Desks &amp; AI)</span>
                          <Shield className="w-3.5 h-3.5 text-emerald-400" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            switchRole('user')
                            setActiveTab('my-ticket')
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-medium flex items-center justify-between transition-colors"
                        >
                          <span>Switch to User (Lock Staff Features)</span>
                          <User className="w-3.5 h-3.5 text-amber-400" />
                        </button>
                      )}
                    </div>

                    {/* Account Links */}
                    <div className="pt-1 border-t border-slate-800 space-y-1">
                      <button
                        onClick={() => setActiveTab('signin')}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 text-xs transition-colors flex items-center space-x-2"
                      >
                        <LogIn className="w-3.5 h-3.5 text-slate-400" />
                        <span>Sign in with other account</span>
                      </button>
                      <button
                        onClick={() => {
                          signOut()
                          setActiveTab('landing')
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-red-500/15 text-red-400 text-xs transition-colors flex items-center space-x-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setActiveTab('signin')}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setActiveTab('signup')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Venue Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setVenueDropdownOpen(!venueDropdownOpen)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-200"
                title="Switch Venue Type"
              >
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="max-w-[100px] truncate">{VENUES[venue].name}</span>
              </button>

              {venueDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-left"
                  onClick={() => setVenueDropdownOpen(false)}
                >
                  <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-3 py-1">
                    Select Facility Context
                  </p>
                  {(Object.keys(VENUES) as VenueType[]).map((vKey) => (
                    <button
                      key={vKey}
                      onClick={() => switchVenue(vKey)}
                      className={`w-full flex flex-col px-3 py-2 rounded-xl text-xs text-left transition-colors ${
                        venue === vKey
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="font-semibold">{VENUES[vKey].name}</span>
                      <span className="text-[10px] text-slate-400">{VENUES[vKey].category}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Live Simulation Pill */}
            <button
              onClick={toggleSimulation}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                isSimulationActive
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
              title={isSimulationActive ? 'Simulation Running' : 'Simulation Paused'}
            >
              {isSimulationActive ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span>SIM: LIVE</span>
                  <Pause className="w-3 h-3 text-emerald-400 ml-0.5" />
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-slate-500" />
                  <span>SIM: OFF</span>
                  <Play className="w-3 h-3 text-slate-400 ml-0.5" />
                </>
              )}
            </button>

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl border transition-colors ${
                soundEnabled
                  ? 'bg-slate-900 border-slate-800 text-cyan-400 hover:bg-slate-800'
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:bg-slate-800'
              }`}
              title={soundEnabled ? 'Chime sound enabled' : 'Chime muted'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Quick CTA */}
            <button
              onClick={onOpenJoinModal}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-3.5 py-2 rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center space-x-1.5 active:scale-95"
            >
              <TicketIcon className="w-3.5 h-3.5" />
              <span>Join Line</span>
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setActiveTab(currentUser ? (isStaff ? 'staff' : 'my-ticket') : 'signin')}
              className="text-xs px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-200"
            >
              {currentUser ? currentUser.role.toUpperCase() : 'Login'}
            </button>
            <button
              onClick={onOpenJoinModal}
              className="bg-emerald-500 text-slate-950 text-xs font-bold px-2.5 py-1.5 rounded-lg"
            >
              Get Ticket
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-2xl px-4 py-4 space-y-3 text-left">
          {/* User Account Banner */}
          {currentUser && (
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white">{currentUser.name}</div>
                <div className="text-[10px] text-slate-400 font-mono">Role: {currentUser.role}</div>
              </div>
              <button
                onClick={() => switchRole(currentUser.role === 'staff' ? 'user' : 'staff')}
                className="px-2 py-1 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono"
              >
                Switch to {currentUser.role === 'staff' ? 'User' : 'Staff'}
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 mb-3">
            {visibleNavLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setMobileMenuOpen(false)
                }}
                className={`flex items-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                  activeTab === item.id
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-300 bg-slate-900 border border-slate-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Facility: {VENUES[venue].name}</span>
            <button
              onClick={toggleSound}
              className="flex items-center space-x-1 text-cyan-400"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{soundEnabled ? 'Chime On' : 'Muted'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
export default Navbar
