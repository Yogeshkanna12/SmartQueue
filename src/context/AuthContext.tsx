import React, { createContext, useContext, useState, useEffect } from 'react'
import type { AuthUser, UserRole } from '@/types/auth'

interface AuthContextType {
  currentUser: AuthUser | null
  isAuthenticated: boolean
  role: UserRole | null
  isStaff: boolean
  signIn: (identifier: string, password?: string) => Promise<{ success: boolean; error?: string }>
  signUp: (data: {
    name: string
    emailOrPhone: string
    password?: string
    role: UserRole
  }) => Promise<{ success: boolean; error?: string }>
  signOut: () => void
  switchRole: (newRole: UserRole) => void
}

const STORAGE_KEY_AUTH = 'smartqueue_auth_user_v1'
const STORAGE_KEY_ACCOUNTS = 'smartqueue_mock_accounts_v1'

const DEFAULT_ACCOUNTS: Record<string, AuthUser & { password?: string }> = {
  'user@smartqueue.demo': {
    id: 'usr-demo-1',
    name: 'Demo Citizen User',
    email: 'user@smartqueue.demo',
    phone: '+1 (555) 019-2834',
    role: 'user',
    password: 'password123',
    createdAt: Date.now() - 86400000 * 5,
  },
  'staff@smartqueue.demo': {
    id: 'stf-demo-1',
    name: 'Staff Officer Marcus',
    email: 'staff@smartqueue.demo',
    phone: '+1 (555) 782-9011',
    role: 'staff',
    password: 'password123',
    createdAt: Date.now() - 86400000 * 30,
  },
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize mock registered database if not present
  useEffect(() => {
    try {
      const existing = localStorage.getItem(STORAGE_KEY_ACCOUNTS)
      if (!existing) {
        localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(DEFAULT_ACCOUNTS))
      }
    } catch {
      // ignore
    }
  }, [])

  // Current session user (defaults to Demo User so the app is immediately usable, or persisted session)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH)
      if (saved) {
        return JSON.parse(saved)
      }
      // Default to demo citizen user
      return {
        id: 'usr-demo-1',
        name: 'Demo Citizen User',
        email: 'user@smartqueue.demo',
        phone: '+1 (555) 019-2834',
        role: 'user',
        createdAt: Date.now(),
      }
    } catch {
      return null
    }
  })

  // Sync to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(currentUser))
      } else {
        localStorage.removeItem(STORAGE_KEY_AUTH)
      }
    } catch {
      // ignore
    }
  }, [currentUser])

  // Sign In
  const signIn = async (identifier: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const cleanId = identifier.trim().toLowerCase()
    if (!cleanId) {
      return { success: false, error: 'Please enter your email or mobile number.' }
    }

    try {
      let accounts = DEFAULT_ACCOUNTS
      const stored = localStorage.getItem(STORAGE_KEY_ACCOUNTS)
      if (stored) {
        accounts = { ...DEFAULT_ACCOUNTS, ...JSON.parse(stored) }
      }

      // Check for matching account by email or phone
      const account = Object.values(accounts).find(
        (acc) =>
          acc.email.toLowerCase() === cleanId ||
          (acc.phone && acc.phone.replace(/\D/g, '') === cleanId.replace(/\D/g, ''))
      )

      if (account) {
        const userObj: AuthUser = {
          id: account.id,
          name: account.name,
          email: account.email,
          phone: account.phone,
          role: account.role,
          createdAt: account.createdAt,
        }
        setCurrentUser(userObj)
        return { success: true }
      }

      // If not previously registered, dynamically create a session with the guessed/default role
      const isStaffKeyword = cleanId.includes('staff') || cleanId.includes('admin') || cleanId.includes('doctor')
      const inferredRole: UserRole = isStaffKeyword ? 'staff' : 'user'
      const newUser: AuthUser = {
        id: `usr-${Date.now()}`,
        name: cleanId.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        email: cleanId.includes('@') ? cleanId : `${cleanId}@smartqueue.local`,
        phone: cleanId.includes('@') ? undefined : cleanId,
        role: inferredRole,
        createdAt: Date.now(),
      }

      // Save to mock accounts
      accounts[cleanId] = { ...newUser, password }
      localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts))
      setCurrentUser(newUser)
      return { success: true }
    } catch (err) {
      return { success: false, error: 'Authentication error. Please try again.' }
    }
  }

  // Sign Up with Role Selection
  const signUp = async (data: {
    name: string
    emailOrPhone: string
    password?: string
    role: UserRole
  }): Promise<{ success: boolean; error?: string }> => {
    const cleanName = data.name.trim()
    const cleanId = data.emailOrPhone.trim().toLowerCase()

    if (!cleanName) {
      return { success: false, error: 'Please enter your full name.' }
    }
    if (!cleanId) {
      return { success: false, error: 'Please enter your email or mobile number.' }
    }
    if (!data.role) {
      return { success: false, error: 'Please select whether you will use SmartQueue as a USER or STAFF.' }
    }

    try {
      let accounts = DEFAULT_ACCOUNTS
      const stored = localStorage.getItem(STORAGE_KEY_ACCOUNTS)
      if (stored) {
        accounts = { ...DEFAULT_ACCOUNTS, ...JSON.parse(stored) }
      }

      const newUser: AuthUser = {
        id: `${data.role === 'staff' ? 'stf' : 'usr'}-${Date.now()}`,
        name: cleanName,
        email: cleanId.includes('@') ? cleanId : `${cleanId.replace(/\D/g, '')}@smartqueue.local`,
        phone: cleanId.includes('@') ? undefined : cleanId,
        role: data.role,
        createdAt: Date.now(),
      }

      accounts[cleanId] = { ...newUser, password: data.password }
      localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts))
      setCurrentUser(newUser)
      return { success: true }
    } catch (err) {
      return { success: false, error: 'Unable to complete registration. Please try again.' }
    }
  }

  // Sign Out
  const signOut = () => {
    setCurrentUser(null)
  }

  // Quick switch role (instant testing helper)
  const switchRole = (newRole: UserRole) => {
    if (!currentUser) {
      setCurrentUser({
        id: `usr-${Date.now()}`,
        name: newRole === 'staff' ? 'Staff Operator' : 'Citizen Visitor',
        email: `${newRole}@smartqueue.demo`,
        role: newRole,
        createdAt: Date.now(),
      })
      return
    }
    setCurrentUser((prev) => (prev ? { ...prev, role: newRole } : null))
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        role: currentUser ? currentUser.role : null,
        isStaff: currentUser?.role === 'staff',
        signIn,
        signUp,
        signOut,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
