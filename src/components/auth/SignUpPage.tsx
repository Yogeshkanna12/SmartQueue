import React, { useState } from 'react'
import { UserPlus, User, Mail, Lock, CheckCircle2, ArrowRight, ShieldCheck, Users, Radio } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import type { UserRole } from '@/types/auth'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface SignUpPageProps {
  onSuccess: (role: UserRole) => void
  onNavigateSignIn: () => void
}

export const SignUpPage: React.FC<SignUpPageProps> = ({
  onSuccess,
  onNavigateSignIn,
}) => {
  const { signUp } = useAuth()
  const [name, setName] = useState('')
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState<UserRole>('user')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Please enter your full name.')
      return
    }
    if (!emailOrPhone.trim()) {
      setError('Please enter your email or mobile number.')
      return
    }
    if (password && confirmPassword && password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.')
      return
    }
    if (!selectedRole) {
      setError('Please select whether you will use SmartQueue as USER or STAFF.')
      return
    }

    setLoading(true)
    const res = await signUp({
      name,
      emailOrPhone,
      password: password || 'password123',
      role: selectedRole,
    })
    setLoading(false)

    if (res.success) {
      onSuccess(selectedRole)
    } else {
      setError(res.error || 'Registration failed. Please check inputs.')
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <Card className="max-w-lg w-full p-6 sm:p-8 bg-slate-900/90 border-slate-800 shadow-2xl relative overflow-hidden text-left">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
              CREATE SMARTQUEUE ACCOUNT
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">Register for SmartQueue</h2>
          <p className="text-xs text-slate-400 mt-1">
            Choose your account role and get instant access to live queues or operations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Sarah Jenkins"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={<User className="w-4 h-4 text-slate-500" />}
            required
          />

          <Input
            label="Email or Mobile Number"
            placeholder="e.g. sarah@example.com or +1 (555) 019-2834"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            icon={<Mail className="w-4 h-4 text-slate-500" />}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4 text-slate-500" />}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<Lock className="w-4 h-4 text-slate-500" />}
            />
          </div>

          {/* Section 2: Role Selection */}
          <div className="pt-2">
            <label className="text-xs font-semibold text-slate-200 tracking-wide block mb-1">
              How will you use SmartQueue? <span className="text-emerald-400">*</span>
            </label>
            <p className="text-[11px] text-slate-400 mb-3">
              Select one role to configure your access permissions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: USER */}
              <div
                onClick={() => setSelectedRole('user')}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  selectedRole === 'user'
                    ? 'bg-emerald-950/30 border-emerald-500/70 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/40'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400">
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-black text-white font-mono tracking-wider">
                        1. USER
                      </span>
                    </div>
                    {selectedRole === 'user' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Join queues, track your position and receive notifications.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-emerald-400">
                  Access: Citizen Portal &amp; Digital Passes
                </div>
              </div>

              {/* Option 2: STAFF */}
              <div
                onClick={() => setSelectedRole('staff')}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  selectedRole === 'staff'
                    ? 'bg-cyan-950/30 border-cyan-500/70 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400">
                        <Radio className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-black text-white font-mono tracking-wider">
                        2. STAFF
                      </span>
                    </div>
                    {selectedRole === 'staff' && (
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Manage counters, monitor crowds and access AI intelligence.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-cyan-400">
                  Access: Counter Desk &amp; AI Intelligence
                </div>
              </div>
            </div>
          </div>

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
            className="w-full font-bold shadow-lg shadow-emerald-500/25 mt-4"
          >
            Create {selectedRole === 'staff' ? 'Staff' : 'User'} Account &amp; Proceed
          </Button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400">
          <span>Already have an account? </span>
          <button
            onClick={onNavigateSignIn}
            className="text-emerald-400 hover:text-emerald-300 font-bold underline ml-1 cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </Card>
    </div>
  )
}
export default SignUpPage
