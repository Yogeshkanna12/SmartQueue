import React, { useState, useEffect } from 'react'
import {
  Radio,
  PhoneCall,
  RotateCcw,
  CheckCircle,
  PauseCircle,
  UserX,
  Share2,
  Clock,
  Search,
  Filter,
  Users,
  ChevronDown,
  Sparkles,
  AlertTriangle,
} from 'lucide-react'
import { useQueue } from '@/context/QueueContext'
import type { CounterStatus } from '@/types/queue'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'

export const StaffDashboard: React.FC = () => {
  const {
    venueConfig,
    counters,
    tickets,
    callNextTicket,
    recallTicket,
    completeService,
    holdTicket,
    markNoShow,
    transferTicket,
    setCounterStatus,
  } = useQueue()

  // Selected active counter station for this operator
  const [activeCounterId, setActiveCounterId] = useState<string>(counters[1]?.id || counters[0]?.id)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDept, setFilterDept] = useState<string>('all')
  const [transferModalOpen, setTransferModalOpen] = useState(false)
  const [targetTransferDept, setTargetTransferDept] = useState(venueConfig.departments[0]?.id)

  // Timer for active customer handling time
  const [serviceSeconds, setServiceSeconds] = useState(0)

  const activeCounter = counters.find((c) => c.id === activeCounterId) || counters[0]
  const currentServingTicket = tickets.find((t) => t.id === activeCounter?.currentTicketId)

  // Track service elapsed timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (activeCounter?.status === 'BUSY' && currentServingTicket) {
      setServiceSeconds(0)
      interval = setInterval(() => {
        setServiceSeconds((prev) => prev + 1)
      }, 1000)
    } else {
      setServiceSeconds(0)
    }
    return () => clearInterval(interval)
  }, [activeCounter?.status, currentServingTicket?.id])

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60)
    const rem = sec % 60
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`
  }

  // Filtered waiting tickets
  const waitingTickets = tickets.filter((t) => {
    if (t.status !== 'WAITING') return false
    if (filterDept !== 'all' && t.departmentId !== filterDept) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        t.id.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) ||
        t.serviceName.toLowerCase().includes(q)
      )
    }
    return true
  })

  const handleTransferSubmit = () => {
    if (currentServingTicket && targetTransferDept) {
      transferTicket(currentServingTicket.id, targetTransferDept)
      setTransferModalOpen(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-left space-y-8">
      {/* Operator Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
              OPERATOR WORKSTATION
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Staff Counter Control Panel
          </h1>
          <p className="text-xs text-slate-400">{venueConfig.name}</p>
        </div>

        {/* Counter Switcher & Status Pill */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Select Counter */}
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold">Station:</span>
            <select
              value={activeCounterId}
              onChange={(e) => setActiveCounterId(e.target.value)}
              className="bg-transparent text-white font-mono font-bold focus:outline-none cursor-pointer"
            >
              {counters.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                  Counter {c.number} — {c.staffName}
                </option>
              ))}
            </select>
          </div>

          {/* Status Buttons */}
          <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs font-medium">
            {(['OPEN', 'ON_BREAK', 'CLOSED'] as CounterStatus[]).map((st) => (
              <button
                key={st}
                onClick={() => setCounterStatus(activeCounter.id, st)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeCounter.status === st
                    ? st === 'OPEN'
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                      : st === 'ON_BREAK'
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                      : 'bg-red-500/20 text-red-300 font-bold border border-red-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st === 'ON_BREAK' ? 'Break' : st.charAt(0) + st.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Operator Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Currently Serving Customer & Core Actions */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold">
                  COUNTER {activeCounter.number} ACTIVE TURN
                </span>
              </div>
              <Badge status={activeCounter.status} size="sm" />
            </div>

            {currentServingTicket ? (
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono uppercase text-emerald-400 font-semibold">
                      Current Visitor
                    </span>
                    <div className="text-4xl sm:text-5xl font-black text-white font-mono mt-1">
                      {currentServingTicket.id}
                    </div>
                    <div className="text-lg font-bold text-slate-100 mt-1">
                      {currentServingTicket.customerName}
                    </div>
                    <p className="text-xs text-slate-400 font-mono">
                      Phone: {currentServingTicket.customerPhone}
                    </p>
                  </div>

                  {/* Handling Timer */}
                  <div className="text-right">
                    <span className="text-[11px] font-mono text-slate-400 uppercase">
                      Handling Timer
                    </span>
                    <div className="text-2xl font-bold font-mono text-emerald-400 mt-0.5">
                      {formatTimer(serviceSeconds)}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Target: ~{activeCounter.avgHandlingSeconds / 60}m
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Department:</span>
                    <span className="font-semibold text-slate-200">
                      {currentServingTicket.departmentName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Service:</span>
                    <span className="font-semibold text-slate-200">
                      {currentServingTicket.serviceName}
                    </span>
                  </div>
                  {currentServingTicket.notes && (
                    <div className="pt-1 text-[11px] text-amber-300">
                      <strong>Notes:</strong> {currentServingTicket.notes}
                    </div>
                  )}
                </div>

                {/* Primary Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button
                    variant="emerald"
                    size="md"
                    onClick={() => completeService(activeCounter.id)}
                    icon={<CheckCircle className="w-4 h-4" />}
                  >
                    Complete Service
                  </Button>

                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => recallTicket(activeCounter.id)}
                    icon={<RotateCcw className="w-4 h-4 text-cyan-400" />}
                  >
                    Recall Ticket
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => holdTicket(activeCounter.id)}
                    icon={<PauseCircle className="w-3.5 h-3.5 text-amber-400" />}
                  >
                    Put on Hold
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => markNoShow(activeCounter.id)}
                    icon={<UserX className="w-3.5 h-3.5 text-red-400" />}
                  >
                    Mark No-Show
                  </Button>
                </div>

                <div className="pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTransferModalOpen(true)}
                    icon={<Share2 className="w-3.5 h-3.5 text-purple-400" />}
                    className="w-full text-xs text-purple-300 hover:text-purple-200"
                  >
                    Transfer Customer to Another Department...
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 text-slate-500 mx-auto flex items-center justify-center">
                  <Clock className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Desk Ready for Next Customer</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {waitingTickets.length} waiting visitors in queue.
                  </p>
                </div>
                <Button
                  variant="emerald"
                  size="lg"
                  onClick={() => callNextTicket(activeCounter.id)}
                  icon={<PhoneCall className="w-5 h-5" />}
                  className="font-bold shadow-lg shadow-emerald-500/25"
                >
                  Call Next Ticket Now
                </Button>
              </div>
            )}
          </Card>

          {/* Desk Operator Efficiency Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-4 bg-slate-900/80 border-slate-800 text-left">
              <span className="text-[11px] font-mono uppercase text-slate-400">
                Served Today
              </span>
              <div className="text-2xl font-extrabold text-white font-mono mt-1">
                {activeCounter.ticketsServedCount}
              </div>
            </Card>

            <Card className="p-4 bg-slate-900/80 border-slate-800 text-left">
              <span className="text-[11px] font-mono uppercase text-slate-400">Avg AHT</span>
              <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
                {Math.round(activeCounter.avgHandlingSeconds / 60)}m
              </div>
            </Card>

            <Card className="p-4 bg-slate-900/80 border-slate-800 text-left">
              <span className="text-[11px] font-mono uppercase text-slate-400">Rating</span>
              <div className="text-2xl font-extrabold text-cyan-400 font-mono mt-1">
                4.9 ★
              </div>
            </Card>
          </div>
        </div>

        {/* Right Column: Waiting Queue Live Table with Search & Triage Override */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white">Live Waiting Registry</h2>
              <p className="text-xs text-slate-400">
                {waitingTickets.length} visitors awaiting consultation
              </p>
            </div>

            {/* Department Filter */}
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
            >
              <option value="all">All Departments</option>
              {venueConfig.departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <Input
            placeholder="Search visitor name, ticket code (e.g. OPD-106)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4 text-slate-400" />}
          />

          {/* Tickets Queue List */}
          <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
            {waitingTickets.length > 0 ? (
              waitingTickets.map((t, idx) => (
                <Card
                  key={t.id}
                  className="p-3.5 bg-slate-900/80 border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="w-6 text-center text-xs font-mono font-bold text-slate-500 shrink-0">
                      #{idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-extrabold text-white text-sm">
                          {t.id}
                        </span>
                        <Badge priority={t.priority} size="sm" />
                      </div>
                      <div className="text-xs text-slate-200 truncate mt-0.5">
                        {t.customerName}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {t.departmentName}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-mono text-emerald-400 font-bold">
                        ~{t.estimatedWaitMinutes}m
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">est. wait</div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => callNextTicket(activeCounter.id)}
                      className="text-xs hover:border-emerald-500 hover:text-emerald-400"
                    >
                      Call
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800/60 text-slate-500 text-xs font-mono">
                No matching tickets in queue.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transfer Department Modal */}
      <Modal
        isOpen={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        title="Transfer Active Customer"
        description="Select destination department for referral or subsequent consultation."
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Target Department
            </label>
            <select
              value={targetTransferDept}
              onChange={(e) => setTargetTransferDept(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100"
            >
              {venueConfig.departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
            <Button variant="ghost" size="sm" onClick={() => setTransferModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="emerald" size="sm" onClick={handleTransferSubmit}>
              Confirm Referral Transfer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
export default StaffDashboard
