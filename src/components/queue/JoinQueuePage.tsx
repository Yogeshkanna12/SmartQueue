import React, { useState } from 'react'
import confetti from 'canvas-confetti'
import {
  Users,
  Clock,
  Sparkles,
  Ticket as TicketIcon,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Smartphone,
} from 'lucide-react'
import { useQueue } from '@/context/QueueContext'
import type { PriorityLevel } from '@/types/queue'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export const JoinQueuePage: React.FC<{ onSuccessNavigate: () => void }> = ({
  onSuccessNavigate,
}) => {
  const { venueConfig, joinQueue, tickets } = useQueue()

  const [selectedDeptId, setSelectedDeptId] = useState<string>(
    venueConfig.departments[0]?.id || ''
  )
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [priority, setPriority] = useState<PriorityLevel>('STANDARD')
  const [notes, setNotes] = useState('')
  const [smsConsent, setSmsConsent] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      joinQueue({
        departmentId: selectedDept.id,
        serviceName: selectedDept.name,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim() || '+1 (555) 019-2834',
        priority,
        notes: notes.trim(),
      })

      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#06b6d4', '#3b82f6'],
        })
      } catch {
        // ignore
      }

      setIsSubmitting(false)
      onSuccessNavigate()
    }, 400)
  }

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-left">
      <div className="mb-8">
        <div className="flex items-center space-x-2">
          <TicketIcon className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
            VIRTUAL QUEUE REGISTRATION
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Join the Live Line at {venueConfig.name}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Issue a secure digital boarding pass and monitor your position in real time from your mobile browser.
        </p>
      </div>

      <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quick Demo Pre-fill Pill Bar */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="text-slate-300 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Hackathon One-Click Demo Personas:</span>
            </span>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('standard')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
              >
                Standard Visitor
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('senior')}
                className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 text-xs font-medium"
              >
                Senior Citizen (65+)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('emergency')}
                className="px-2.5 py-1 rounded-lg bg-red-500/15 text-red-300 hover:bg-red-500/25 text-xs font-medium"
              >
                Acute Triage
              </button>
            </div>
          </div>

          {/* 1. Department Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-300 tracking-wide block mb-3">
              1. Choose Desired Service Department <span className="text-emerald-400">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {venueConfig.departments.map((dept) => {
                const isSelected = selectedDeptId === dept.id
                const waiting = tickets.filter(
                  (t) => t.departmentId === dept.id && t.status === 'WAITING'
                ).length
                return (
                  <div
                    key={dept.id}
                    onClick={() => setSelectedDeptId(dept.id)}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-950/30 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-slate-100">{dept.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                          {dept.code}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-3">{dept.description}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                      <span className="flex items-center space-x-1.5 text-emerald-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>~{dept.avgServiceMinutes}m avg service</span>
                      </span>
                      <span className="font-mono text-slate-300 font-semibold">{waiting} ahead in line</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 2. Customer Credentials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Visitor Full Name"
              placeholder="e.g. Alex Morgan"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
            <Input
              label="Mobile Number (for SMS summons)"
              placeholder="+1 (555) 012-3456"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </div>

          {/* 3. Priority Triage */}
          <div>
            <label className="text-xs font-semibold text-slate-300 tracking-wide block mb-2">
              3. Priority &amp; Triage Needs
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'STANDARD', label: 'Standard', desc: 'Standard chronological turn' },
                { id: 'SENIOR', label: 'Senior (65+)', desc: 'Priority seated lane' },
                { id: 'ACCESSIBILITY', label: 'Accessibility', desc: 'Step-free & assistive needs' },
                { id: 'EMERGENCY_TRIAGE', label: 'Acute Triage', desc: 'Immediate clinical review' },
              ].map((p) => {
                const active = priority === p.id
                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => setPriority(p.id as PriorityLevel)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      active
                        ? p.id === 'EMERGENCY_TRIAGE'
                          ? 'bg-red-950/40 border-red-500/70 text-red-200'
                          : 'bg-emerald-950/30 border-emerald-500/60 text-emerald-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-xs font-bold">{p.label}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{p.desc}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="text-xs font-semibold text-slate-300 tracking-wide block mb-1.5">
              Special Requests or Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Translation needed, bringing wheelchair, rapid consultation..."
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
            />
          </div>

          {/* SMS Notification Simulation Checkbox */}
          <div className="flex items-center space-x-2 text-xs text-slate-300">
            <input
              type="checkbox"
              id="pageSmsConsent"
              checked={smsConsent}
              onChange={(e) => setSmsConsent(e.target.checked)}
              className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
            />
            <label htmlFor="pageSmsConsent" className="cursor-pointer">
              Enable simulated SMS text notifications and audio chimes when my turn approaches
            </label>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">
              Free digital pass • No account required
            </span>

            <Button
              type="submit"
              variant="emerald"
              size="lg"
              loading={isSubmitting}
              disabled={!customerName.trim()}
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Get Digital Ticket Pass
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
export default JoinQueuePage
