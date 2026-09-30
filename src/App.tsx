import React, { useState, useEffect } from 'react'
import { QueueProvider, useQueue } from '@/context/QueueContext'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { Navbar, type ActiveTab } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { LandingPage } from '@/components/landing/LandingPage'
import { JoinQueueModal } from '@/components/queue/JoinQueueModal'
import { JoinQueuePage } from '@/components/queue/JoinQueuePage'
import { MyTicketView } from '@/components/queue/MyTicketView'
import { LiveKioskDisplay } from '@/components/queue/LiveKioskDisplay'
import { StaffDashboard } from '@/components/staff/StaffDashboard'
import { AnalyticsView } from '@/components/analytics/AnalyticsView'
import { HeatmapView } from '@/components/heatmap/HeatmapView'
import { AccessDenied } from '@/components/auth/AccessDenied'
import { SignInPage } from '@/components/auth/SignInPage'
import { SignUpPage } from '@/components/auth/SignUpPage'
import Toast from '@/components/ui/Toast'

const MainAppContent: React.FC = () => {
  // Sync initial tab with URL hash if present
  const getInitialTab = (): ActiveTab => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const raw = window.location.hash.replace('#', '').toLowerCase()
      if (raw === 'staff' || raw === 'staff-desk') return 'staff'
      if (raw === 'analytics' || raw === 'ai-intelligence') return 'analytics'
      if (raw === 'my-ticket' || raw === 'user-dashboard') return 'my-ticket'
      if (raw === 'join' || raw === 'join-queue') return 'join'
      if (raw === 'kiosk' || raw === 'live-status') return 'kiosk'
      if (raw === 'heatmap') return 'heatmap'
      if (raw === 'signin' || raw === 'login') return 'signin'
      if (raw === 'signup' || raw === 'register') return 'signup'
    }
    return 'landing'
  }

  const [activeTab, setActiveTab] = useState<ActiveTab>(getInitialTab)
  const [joinModalOpen, setJoinModalOpen] = useState(false)
  const { toastAlert, dismissToast } = useQueue()
  const { currentUser, isStaff } = useAuth()

  // Keep hash synchronized with activeTab
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.hash = activeTab
    }
  }, [activeTab])

  // Listen to manual URL hash changes (e.g. entering #staff or #analytics manually in URL bar)
  useEffect(() => {
    const handleHashChange = () => {
      const raw = window.location.hash.replace('#', '').toLowerCase()
      if (raw === 'staff' || raw === 'staff-desk') setActiveTab('staff')
      else if (raw === 'analytics' || raw === 'ai-intelligence') setActiveTab('analytics')
      else if (raw === 'my-ticket' || raw === 'user-dashboard') setActiveTab('my-ticket')
      else if (raw === 'join' || raw === 'join-queue') setActiveTab('join')
      else if (raw === 'kiosk' || raw === 'live-status') setActiveTab('kiosk')
      else if (raw === 'heatmap') setActiveTab('heatmap')
      else if (raw === 'signin' || raw === 'login') setActiveTab('signin')
      else if (raw === 'signup' || raw === 'register') setActiveTab('signup')
      else if (raw === 'landing' || raw === '') setActiveTab('landing')
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const handleOpenJoinModal = () => setJoinModalOpen(true)
  const handleCloseJoinModal = () => setJoinModalOpen(false)

  const handleTicketCreated = () => {
    setActiveTab('my-ticket')
  }

  // Handle successful authentication
  const handleAuthSuccess = (role: 'user' | 'staff') => {
    if (role === 'staff') {
      setActiveTab('staff')
    } else {
      setActiveTab('my-ticket')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 selection:bg-emerald-500 selection:text-black">
      {/* Top Navbar (except when in dedicated Wall TV Kiosk Mode) */}
      {activeTab !== 'kiosk' && (
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenJoinModal={handleOpenJoinModal}
        />
      )}

      {/* Main View Area with Role-Based Route Guards */}
      <main className="flex-1 w-full">
        {/* 1. Landing Overview */}
        {activeTab === 'landing' && (
          <LandingPage
            onNavigateTab={setActiveTab}
            onOpenJoinModal={handleOpenJoinModal}
          />
        )}

        {/* 2. Join Queue Page */}
        {activeTab === 'join' && (
          <JoinQueuePage onSuccessNavigate={handleTicketCreated} />
        )}

        {/* 3. My Ticket / Citizen Portal */}
        {activeTab === 'my-ticket' && (
          <MyTicketView onOpenJoinModal={handleOpenJoinModal} />
        )}

        {/* 4. Live TV Kiosk Display */}
        {activeTab === 'kiosk' && (
          <div>
            <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs">
              <span className="font-mono text-slate-400">
                Wall Display Kiosk Mode Active
              </span>
              <button
                onClick={() => setActiveTab('landing')}
                className="text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer"
              >
                ← Exit Kiosk View
              </button>
            </div>
            <LiveKioskDisplay />
          </div>
        )}

        {/* 5. PROTECTED ROUTE: Staff Desk (STAFF ONLY) */}
        {activeTab === 'staff' && (
          isStaff ? (
            <StaffDashboard />
          ) : (
            <AccessDenied
              sectionTitle="Staff Desk & Operations"
              onBackToDashboard={() => setActiveTab('my-ticket')}
              onSignInStaff={() => setActiveTab('signin')}
            />
          )
        )}

        {/* 6. PROTECTED ROUTE: AI Intelligence (STAFF ONLY) */}
        {activeTab === 'analytics' && (
          isStaff ? (
            <AnalyticsView />
          ) : (
            <AccessDenied
              sectionTitle="AI Crowd Intelligence"
              onBackToDashboard={() => setActiveTab('my-ticket')}
              onSignInStaff={() => setActiveTab('signin')}
            />
          )
        )}

        {/* 7. Crowd Heatmap (Public Spatial Overview) */}
        {activeTab === 'heatmap' && <HeatmapView />}

        {/* 8. Sign In View */}
        {activeTab === 'signin' && (
          <SignInPage
            onSuccess={handleAuthSuccess}
            onNavigateSignUp={() => setActiveTab('signup')}
          />
        )}

        {/* 9. Sign Up View with Role Selection */}
        {activeTab === 'signup' && (
          <SignUpPage
            onSuccess={handleAuthSuccess}
            onNavigateSignIn={() => setActiveTab('signin')}
          />
        )}
      </main>

      {/* Universal Footer (except in kiosk mode) */}
      {activeTab !== 'kiosk' && (
        <Footer
          setActiveTab={setActiveTab}
          onOpenJoinModal={handleOpenJoinModal}
        />
      )}

      {/* Join Queue Modal dialog accessible from anywhere */}
      <JoinQueueModal
        isOpen={joinModalOpen}
        onClose={handleCloseJoinModal}
        onSuccessNavigate={handleTicketCreated}
      />

      {/* Floating Reactive Toast Notification */}
      {toastAlert && (
        <Toast
          title={toastAlert.title}
          message={toastAlert.message}
          type={toastAlert.type}
          onClose={dismissToast}
        />
      )}
    </div>
  )
}

export function App() {
  return (
    <AuthProvider>
      <QueueProvider>
        <MainAppContent />
      </QueueProvider>
    </AuthProvider>
  )
}

export default App
