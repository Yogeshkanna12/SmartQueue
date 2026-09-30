import React, { useState } from 'react'
import confetti from 'canvas-confetti'
import {
  Users,
  Clock,
  Sparkles,
  HeartHandshake,
  AlertTriangle,
  CheckCircle2,
  Smartphone,
  Info,
} from 'lucide-react'
import { useQueue } from '@/context/QueueContext'
import type { PriorityLevel } from '@/types/queue'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface JoinQueueModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccessNavigate?: () => void
}

export const JoinQueueModal: React.FC<JoinQueueModalProps> = ({
  isOpen,
  onClose,
  onSuccessNavigate,
}) => {
  const { venueConfig, joinQueue, tickets, counters } = useQueue()

  const [selectedDeptId, setSelectedDeptId] = useState<string>(
    venueConfig.departments[0]?.id || ''
  )
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [priority, setPriority] = useState<PriorityLevel>('STANDARD')
  const [notes, setNotes] = useState('')
  const [smsConsent, setSmsConsent] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Keep selectedDeptId in sync if venue changes
  React.useEffect(() => {
    if (venueConfig.departments.length > 0) {
      setSelectedDeptId(venueConfig.departments[0].id)
    }
  }, [venueConfig])

  const selectedDept =
    venueConfig.departments.find((d) => d.id === selectedDeptId) ||
    venueConfig.departments[0]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerName.trim()) return

    setIsSubmitting(true)
    setTimeout(() => {
      const generatedTicket = joinQueue({
        departmentId: selectedDept.id,
        serviceName: selectedDept.name,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim() || '+1 (555) 019-2834',
        priority,
        notes: notes.trim(),
      })

      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#10b981', '#06b6d4', '#3b82f6'],
        })
      } catch {
        // ignore
      }

      setIsSubmitting(false)
      onClose()
      if (onSuccessNavigate) {
        onSuccessNavigate()
      }
    }, 400)
  }

  // Pre-fill quick demo presets for judges/reviewers
  const handleQuickDemo = (type: 'senior' | 'emergency' | 'standard') => {
    if (type === 'senior') {
      setCustomerName('Eleanor Vance (Senior)')
      setCustomerPhone('+1 (555) 724-1188')
      setPriority('SENIOR')
      setNotes('Requires ground-floor seating assistance')
    } else if (type === 'emergency') {
      setCustomerName('David Sterling (Urgent)')
      setCustomerPhone('+1 (555) 901-4432')
      setPriority('EMERGENCY_TRIAGE')
      setNotes('Acute fever and respiratory triage')
    } else {
      setCustomerName('Marcus Chen')
      setCustomerPhone('+1 (555) 438-9921')
      setPriority('STANDARD')
      setNotes('Routine appointment check-in')
    }
  }

  // Waiting count calculation for selected department
  const deptWaitingCount = tickets.filter(
    (t) => t.departmentId === selectedDept.id && t.status === 'WAITING'
  ).length

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Users className="w-5 h-5" />
          </div>
          <span>Join Queue — {venueConfig.name}</span>
        </div>
      }
      description="Enter your details to generate your real-time digital ticket pass."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-left">
        {/* Quick Demo Pre-fill Pill Bar */}
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Fast Demo Fill:</span>
          </span>
          <div className="flex space-x-1.5">
            <button
              type="button"
              onClick={() => handleQuickDemo('standard')}
              className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px]"
            >
              Standard
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('senior')}
              className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 text-[11px]"
            >
              Senior 65+
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('emergency')}
              className="px-2 py-0.5 rounded-md bg-red-500/15 text-red-300 hover:bg-red-500/25 text-[11px]"
            >
              Acute Triage
            </button>
          </div>
        </div>

        {/* 1. Department / Service Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-300 tracking-wide block mb-2">
            1. Select Service / Department <span className="text-emerald-400">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {venueConfig.departments.map((dept) => {
              const isSelected = selectedDeptId === dept.id
              const waiting = tickets.filter(
                (t) => t.departmentId === dept.id && t.status === 'WAITING'
              ).length
              return (
                <div
                  key={dept.id}
                  onClick={() => setSelectedDeptId(dept.id)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-950/30 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-100">{dept.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {dept.code}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      <span>~{dept.avgServiceMinutes}m avg</span>
                    </span>
                    <span className="font-mono text-slate-400">{waiting} ahead</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 2. Visitor Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Full Name"
            placeholder="e.g. Elena Rostova"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
          <Input
            label="Mobile Number (Simulated SMS)"
            placeholder="+1 (555) 000-0000"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
          />
        </div>

        {/* 3. Priority & Triage Level */}
        <div>
          <label className="text-xs font-semibold text-slate-300 tracking-wide block mb-2">
            3. Priority Classification
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'STANDARD', label: 'Standard', desc: 'Routine general turn' },
              { id: 'SENIOR', label: 'Senior Citizen', desc: 'Age 65+ expedited' },
              { id: 'ACCESSIBILITY', label: 'Accessibility', desc: 'Mobility assistance' },
              { id: 'EMERGENCY_TRIAGE', label: 'Acute Triage', desc: 'Urgent priority' },
            ].map((p) => {
              const active = priority === p.id
              return (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setPriority(p.id as PriorityLevel)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    active
                      ? p.id === 'EMERGENCY_TRIAGE'
                        ? 'bg-red-950/40 border-red-500/70 text-red-200'
                        : 'bg-emerald-950/30 border-emerald-500/60 text-emerald-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-bold">{p.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{p.desc}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* SMS Simulation Consent */}
        <div className="flex items-center space-x-2 text-xs text-slate-300">
          <input
            type="checkbox"
            id="smsConsent"
            checked={smsConsent}
            onChange={(e) => setSmsConsent(e.target.checked)}
            className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
          />
          <label htmlFor="smsConsent" className="cursor-pointer">
            Receive SMS &amp; audio alerts when my turn is approaching (5 mins prior)
          </label>
        </div>

        {/* Submit CTA */}
        <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="emerald"
            loading={isSubmitting}
            disabled={!customerName.trim()}
          >
            Generate Ticket &amp; Enter Queue
          </Button>
        </div>
      </form>
    </Modal>
  )
}
export default JoinQueueModal
