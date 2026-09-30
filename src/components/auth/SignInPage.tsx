import React, { useState } from 'react'
import { LogIn, Mail, Lock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface SignInPageProps {
  onSuccess: (role: 'user' | 'staff') => void
  onNavigateSignUp: () => void
}

export const SignInPage: React.FC<SignInPageProps> = ({
  onSuccess,
  onNavigateSignUp,
}) => {
  const { signIn } = useAuth()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!identifier.trim()) {
      setError('Please enter your email or mobile number.')
      return
    }

    setLoading(true)
    const res = await signIn(identifier, password)
    setLoading(false)

    if (res.success) {
      const isStaff = identifier.toLowerCase().includes('staff')
      onSuccess(isStaff ? 'staff' : 'user')
    } else {
      setError(res.error || 'Authentication failed. Please verify credentials.')
    }
  }

  // Quick 1-click demo logins for evaluators
  const handleQuickDemo = async (role: 'user' | 'staff') => {
    const email = role === 'staff' ? 'staff@smartqueue.demo' : 'user@smartqueue.demo'
    setIdentifier(email)
    setPassword('password123')
    setLoading(true)
    await signIn(email, 'password123')
    setLoading(false)
    onSuccess(role)
  }

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-12">
      <Card className="max-w-md w-full p-6 sm:p-8 bg-slate-900/90 border-slate-800 shadow-2xl relative overflow-hidden text-left">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <LogIn className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
              SMARTQUEUE ACCESS
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">Sign In to Your Account</h2>
          <p className="text-xs text-slate-400 mt-1">
            Access your active queue tickets, turn notifications, or counter operations.
          </p>
        </div>

        {/* Quick Demo Credentials Banner */}
        <div className="mb-6 p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center space-x-1.5 font-semibold text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Evaluator Demo Sign-In:</span>
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('user')}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] font-mono font-medium text-left transition-colors"
            >
              <div className="text-white font-bold">Demo User</div>
              <div className="text-slate-500 text-[10px]">Citizen Account</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('staff')}
              className="p-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono font-medium text-left transition-colors"
            >
              <div className="text-white font-bold">Demo Staff</div>
              <div className="text-emerald-400 text-[10px]">Counter &amp; AI Access</div>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email or Mobile Number"
            placeholder="e.g. user@smartqueue.demo or (555) 019-2834"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            icon={<Mail className="w-4 h-4 text-slate-500" />}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-4 h-4 text-slate-500" />}
            helperText="Default demo password: password123"
          />

          {error && (
            <p className="text-xs text-red-400 font-medium bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl">
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="emerald"
            size="lg"
            loading={loading}
            icon={<ArrowRight className="w-4 h-4" />}
            className="w-full font-bold shadow-lg shadow-emerald-500/25 mt-2"
          >
            Sign In
          </Button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400">
          <span>Don't have an account? </span>
          <button
            onClick={onNavigateSignUp}
            className="text-emerald-400 hover:text-emerald-300 font-bold underline ml-1 cursor-pointer"
          >
            Sign Up
          </button>
        </div>
      </Card>
    </div>
  )
}
export default SignInPage
