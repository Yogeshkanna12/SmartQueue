import React from 'react'
import type { TicketStatus, PriorityLevel, CounterStatus } from '@/types/queue'

interface BadgeProps {
  children?: React.ReactNode
  status?: TicketStatus | CounterStatus
  priority?: PriorityLevel
  variant?: 'emerald' | 'cyan' | 'amber' | 'red' | 'slate' | 'violet'
  size?: 'sm' | 'md'
  pulsing?: boolean
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  status,
  priority,
  variant,
  size = 'md',
  pulsing = false,
  className = '',
}) => {
  // Determine variant automatically if status is provided
  let effectiveVariant = variant || 'slate'
  let label = children

  if (status) {
    switch (status) {
      case 'WAITING':
        effectiveVariant = 'amber'
        label = label || 'In Queue'
        break
      case 'CALLING':
        effectiveVariant = 'violet'
        label = label || 'Calling Now'
        break
      case 'SERVING':
      case 'BUSY':
        effectiveVariant = 'emerald'
        label = label || (status === 'BUSY' ? 'Serving' : 'In Service')
        break
      case 'OPEN':
        effectiveVariant = 'cyan'
        label = label || 'Ready / Open'
        break
      case 'COMPLETED':
        effectiveVariant = 'slate'
        label = label || 'Completed'
        break
      case 'HELD':
      case 'ON_BREAK':
        effectiveVariant = 'amber'
        label = label || (status === 'ON_BREAK' ? 'On Break' : 'On Hold')
        break
      case 'NO_SHOW':
      case 'CANCELLED':
      case 'CLOSED':
        effectiveVariant = 'red'
        label = label || (status === 'CLOSED' ? 'Closed' : status === 'NO_SHOW' ? 'No Show' : 'Cancelled')
        break
    }
  }

  if (priority) {
    switch (priority) {
      case 'EMERGENCY_TRIAGE':
        effectiveVariant = 'red'
        label = label || 'Emergency Triage'
        break
      case 'SENIOR':
        effectiveVariant = 'amber'
        label = label || 'Senior Priority'
        break
      case 'ACCESSIBILITY':
        effectiveVariant = 'cyan'
        label = label || 'Accessibility Priority'
        break
      case 'STANDARD':
        effectiveVariant = 'slate'
        label = label || 'Standard'
        break
    }
  }

  const colorStyles = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    violet: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    slate: 'bg-slate-800/80 text-slate-300 border-slate-700/60',
  }

  const dotColors = {
    emerald: 'bg-emerald-400',
    cyan: 'bg-cyan-400',
    amber: 'bg-amber-400',
    red: 'bg-red-400',
    violet: 'bg-purple-400',
    slate: 'bg-slate-400',
  }

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  }

  const showPulse =
    pulsing ||
    status === 'CALLING' ||
    status === 'SERVING' ||
    status === 'BUSY' ||
    priority === 'EMERGENCY_TRIAGE'

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border tracking-wide uppercase font-mono ${sizeStyles[size]} ${colorStyles[effectiveVariant]} ${className}`}
    >
      {showPulse ? (
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColors[effectiveVariant]}`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${dotColors[effectiveVariant]}`}
          />
        </span>
      ) : (
        <span className={`inline-block w-1.5 h-1.5 rounded-full ${dotColors[effectiveVariant]}`} />
      )}
      <span>{label}</span>
    </span>
  )
}
export default Badge
