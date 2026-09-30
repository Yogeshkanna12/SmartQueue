import React from 'react'
import { ShieldAlert, ArrowLeft, KeyRound, Lock } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface AccessDeniedProps {
  sectionTitle?: string
  onBackToDashboard: () => void
  onSignInStaff?: () => void
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  sectionTitle = 'Staff Operations',
  onBackToDashboard,
  onSignInStaff,
}) => {
  const { currentUser, switchRole } = useAuth()

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="max-w-md w-full p-8 sm:p-10 bg-slate-900/90 border-red-500/30 text-center shadow-2xl relative overflow-hidden">
        {/* Subtle red security glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Lock / Shield Icon */}
        <div className="relative mx-auto w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-400 flex items-center justify-center mb-6 shadow-lg shadow-red-500/10">
          <ShieldAlert className="w-8 h-8" />
        </div>

        {/* ACCESS DENIED Header */}
        <div className="inline-block px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono font-bold tracking-widest uppercase mb-3">
          ACCESS DENIED
        </div>

        {/* Core Message */}
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
          THIS PART IS ONLY ACCESSIBLE FOR THE STAFFS
        </h2>

        {/* Supporting Message */}
        <p className="text-sm text-slate-400 mt-3 leading-relaxed">
          Please sign in with a Staff account to access this section.
        </p>

        {/* Current User Role Notice */}
        {currentUser && (
          <div className="mt-4 py-2 px-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Signed in as: <strong className="text-slate-200">{currentUser.name}</strong></span>
            <span className="font-mono uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
              Role: {currentUser.role}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 space-y-3">
          <Button
            variant="emerald"
            size="md"
            onClick={onBackToDashboard}
            icon={<ArrowLeft className="w-4 h-4" />}
            className="w-full font-bold shadow-lg shadow-emerald-500/20"
          >
            Back to Dashboard
          </Button>

          {/* Instant Staff Login Helper */}
          {onSignInStaff ? (
            <Button
              variant="outline"
              size="md"
              onClick={onSignInStaff}
              icon={<KeyRound className="w-4 h-4 text-cyan-400" />}
              className="w-full text-xs"
            >
              Sign In with Staff Account
            </Button>
          ) : (
            <Button
              variant="outline"
              size="md"
              onClick={() => switchRole('staff')}
              icon={<KeyRound className="w-4 h-4 text-cyan-400" />}
              className="w-full text-xs"
            >
              Switch to Staff Account (Demo)
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
export default AccessDenied
