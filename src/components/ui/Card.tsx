import React from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean
  interactive?: boolean
  variant?: 'default' | 'elevated' | 'subtle' | 'gradient'
}

export const Card: React.FC<CardProps> = ({
  children,
  glow = false,
  interactive = false,
  variant = 'default',
  className = '',
  ...props
}) => {
  const base =
    'relative rounded-2xl transition-all duration-200 border backdrop-blur-md overflow-hidden'

  const variants = {
    default: 'bg-slate-900/75 border-slate-800/80 shadow-lg shadow-black/20',
    elevated: 'bg-[#0f172a]/90 border-slate-700/70 shadow-xl shadow-black/40',
    subtle: 'bg-slate-900/40 border-slate-800/50',
    gradient: 'bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950/90 border-slate-800/90',
  }

  const interactiveStyles = interactive
    ? 'hover:border-slate-600 hover:shadow-emerald-500/5 hover:-translate-y-0.5 cursor-pointer'
    : ''

  const glowStyles = glow
    ? 'ring-1 ring-emerald-500/30 shadow-[0_0_24px_rgba(16,185,129,0.12)]'
    : ''

  return (
    <div
      className={`${base} ${variants[variant]} ${interactiveStyles} ${glowStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
export default Card
