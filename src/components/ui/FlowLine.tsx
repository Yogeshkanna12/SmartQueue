import React from 'react'

interface QueueStepIndicatorProps {
  currentStep: number // 0, 1, 2, 3, 4
  steps?: string[]
}

const DEFAULT_STEPS = [
  'Ticket Issued',
  'Waiting in Lounge',
  'Approaching Turn',
  'Calling / Serving',
  'Completed',
]

export const QueueStepIndicator: React.FC<QueueStepIndicatorProps> = ({
  currentStep,
  steps = DEFAULT_STEPS,
}) => {
  return (
    <div className="w-full py-4">
      <div className="relative flex items-center justify-between">
        {/* Continuous background track line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-800 rounded-full" />
        {/* Active progress fill line */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, (currentStep / (steps.length - 1)) * 100)}%` }}
        />

        {/* Step nodes */}
        {steps.map((label, idx) => {
          const isDone = idx < currentStep
          const isCurrent = idx === currentStep
          return (
            <div key={label} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all duration-300 ${
                  isCurrent
                    ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20 shadow-lg shadow-emerald-500/30 scale-110'
                    : isDone
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-slate-900 text-slate-500 border border-slate-700'
                }`}
              >
                {isDone ? '✓' : idx + 1}
              </div>
              <span
                className={`absolute top-9 text-[11px] whitespace-nowrap font-medium transition-colors hidden sm:block ${
                  isCurrent ? 'text-emerald-400 font-semibold' : isDone ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>
      <div className="h-6 sm:h-5" />
    </div>
  )
}
