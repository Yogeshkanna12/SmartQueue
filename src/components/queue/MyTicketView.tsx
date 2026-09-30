import React from 'react'
import {
  Ticket as TicketIcon,
  Clock,
  Users,
  MapPin,
  CheckCircle,
  BellRing,
  Volume2,
  Calendar,
  AlertCircle,
  QrCode,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { useQueue } from '@/context/QueueContext'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { QueueStepIndicator } from '@/components/ui/FlowLine'
import { playQueueChime, speakTicketAnnouncement } from '@/utils/sound'

export const MyTicketView: React.FC<{ onOpenJoinModal: () => void }> = ({
  onOpenJoinModal,
}) => {
  const {
    myTicket,
    tickets,
    counters,
    cancelMyTicket,
    snoozeMyTicket,
    ticketHistory,
    soundEnabled,
    speechEnabled,
  } = useQueue()

  if (!myTicket) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Card className="p-8 sm:p-12 bg-slate-900/90 border-slate-800 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center mb-6">
            <TicketIcon className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No Active Queue Ticket</h2>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            You don't have any active ticket registered in this session. Join a line in seconds to track your turn in real time.
          </p>
          <Button
            variant="emerald"
            size="lg"
            onClick={onOpenJoinModal}
            className="w-full font-bold shadow-lg shadow-emerald-500/25"
          >
            Join Queue Now
          </Button>
        </Card>

        {/* Previous Ticket History if available */}
        {ticketHistory.length > 0 && (
          <div className="mt-12 text-left max-w-xl mx-auto">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-3">
              Session Ticket History
            </h3>
            <div className="space-y-2">
              {ticketHistory.map((t) => (
                <div
                  key={t.dbId}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold text-slate-200">{t.id}</span>
                    <span className="text-slate-400">{t.serviceName}</span>
                  </div>
                  <Badge status={t.status} size="sm" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Calculate real-time position ahead
  const peopleAhead = tickets.filter(
    (t) =>
      t.departmentId === myTicket.departmentId &&
      t.status === 'WAITING' &&
      t.issuedAt < myTicket.issuedAt
  ).length

  // Calculate Step (0: Issued, 1: Waiting, 2: Approaching (<=1 person ahead), 3: Serving/Calling, 4: Completed)
  let stepIndex = 1
  if (myTicket.status === 'COMPLETED') stepIndex = 4
  else if (myTicket.status === 'SERVING' || myTicket.status === 'CALLING') stepIndex = 3
  else if (peopleAhead <= 1) stepIndex = 2

  const assignedCounter = counters.find((c) => c.id === myTicket.counterId)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 text-left">
      {/* Header alert if user is being called */}
      {(myTicket.status === 'CALLING' || myTicket.status === 'SERVING') && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 border border-emerald-500/50 shadow-2xl shadow-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500 text-slate-950 font-bold">
              <BellRing className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">IT'S YOUR TURN NOW!</h3>
              <p className="text-xs text-emerald-300">
                Please proceed immediately to Counter {myTicket.counterNumber || 1} (
                {myTicket.counterStaff || 'Assigned Officer'}).
              </p>
            </div>
          </div>
          <Button
            variant="emerald"
            size="sm"
            onClick={() => {
              playQueueChime(0.3)
              speakTicketAnnouncement(myTicket.id, myTicket.counterNumber || 1)
            }}
            icon={<Volume2 className="w-4 h-4" />}
          >
            Replay Callout
          </Button>
        </div>
      )}

      {/* Main Digital Boarding Pass */}
      <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Glowing aura */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Pass Strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">
              Live Digital Pass
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
              {myTicket.departmentName}
            </h1>
            <p className="text-xs text-slate-400">{myTicket.serviceName}</p>
          </div>

          <div className="flex items-center space-x-2">
            <Badge status={myTicket.status} size="md" pulsing={true} />
            <Badge priority={myTicket.priority} size="md" />
          </div>
        </div>

        {/* Center Boarding Display */}
        <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Big Ticket Number */}
          <div className="md:col-span-6 space-y-4">
            <div>
              <span className="text-xs font-mono uppercase text-slate-400">
                Ticket Identifier
              </span>
              <div className="text-5xl sm:text-6xl font-black text-white font-mono tracking-tight mt-1">
                {myTicket.id}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span className="text-[11px] font-mono text-slate-400 uppercase flex items-center space-x-1">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>People Ahead</span>
                </span>
                <div className="text-2xl font-extrabold text-white font-mono mt-1">
                  {myTicket.status === 'SERVING' ? '0 (Turn)' : peopleAhead}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span className="text-[11px] font-mono text-slate-400 uppercase flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Estimated Wait</span>
                </span>
                <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
                  {myTicket.status === 'SERVING' ? 'Now' : `~${myTicket.estimatedWaitMinutes}m`}
                </div>
              </div>
            </div>
          </div>

          {/* QR Code & Mobile Kiosk Verification */}
          <div className="md:col-span-6 bg-slate-950/80 border border-slate-800/90 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-5">
            {/* Synthetic Vector QR Code */}
            <div className="p-3 bg-white rounded-xl shadow-lg shrink-0">
              <svg
                className="w-28 h-28"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* QR corner 1 */}
                <rect x="5" y="5" width="30" height="30" fill="black" />
                <rect x="10" y="10" width="20" height="20" fill="white" />
                <rect x="15" y="15" width="10" height="10" fill="black" />
                {/* QR corner 2 */}
                <rect x="65" y="5" width="30" height="30" fill="black" />
                <rect x="70" y="10" width="20" height="20" fill="white" />
                <rect x="75" y="15" width="10" height="10" fill="black" />
                {/* QR corner 3 */}
                <rect x="5" y="65" width="30" height="30" fill="black" />
                <rect x="10" y="70" width="20" height="20" fill="white" />
                <rect x="15" y="75" width="10" height="10" fill="black" />
                {/* Simulated QR data grid */}
                <rect x="42" y="10" width="6" height="6" fill="black" />
                <rect x="52" y="18" width="6" height="6" fill="black" />
                <rect x="42" y="28" width="6" height="6" fill="black" />
                <rect x="25" y="45" width="6" height="6" fill="black" />
                <rect x="35" y="52" width="6" height="6" fill="black" />
                <rect x="48" y="42" width="10" height="10" fill="#10b981" />
                <rect x="65" y="50" width="8" height="8" fill="black" />
                <rect x="75" y="62" width="6" height="6" fill="black" />
                <rect x="60" y="75" width="12" height="6" fill="black" />
                <rect x="80" y="80" width="10" height="10" fill="black" />
              </svg>
            </div>

            <div className="space-y-1.5 text-left text-xs">
              <div className="font-semibold text-slate-200">
                Visitor: {myTicket.customerName}
              </div>
              <div className="text-slate-400 font-mono text-[11px]">
                Phone: {myTicket.customerPhone}
              </div>
              <div className="text-slate-400 font-mono text-[11px]">
                Issued: {new Date(myTicket.issuedAt).toLocaleTimeString()}
              </div>
              <p className="text-[11px] text-emerald-400 pt-1">
                Scan at gate or show to desk clerk
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Queue Step Flow Line */}
        <div className="pt-4 border-t border-slate-800">
          <QueueStepIndicator currentStep={stepIndex} />
        </div>

        {/* Directional Guide to Counter */}
        {myTicket.counterNumber && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-3 text-xs">
            <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-slate-300">
              <strong className="text-white">Wayfinding Navigation:</strong> Proceed straight
              past Waiting Lounge A to <span className="text-emerald-400 font-bold">Counter {myTicket.counterNumber}</span> on your right.
            </div>
          </div>
        )}

        {/* Citizen Action Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={snoozeMyTicket}
              disabled={myTicket.status === 'SERVING'}
            >
              Postpone Turn (+5m)
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={cancelMyTicket}
            >
              Leave Queue
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => playQueueChime(0.3)}
              icon={<Volume2 className="w-4 h-4 text-cyan-400" />}
            >
              Test Notification Chime
            </Button>
            <Button
              variant="emerald"
              size="sm"
              onClick={() => window.print()}
            >
              Print / Save Pass
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
export default MyTicketView
