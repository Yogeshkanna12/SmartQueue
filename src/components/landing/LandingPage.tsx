import React from 'react'
import { HeroSection } from './HeroSection'
import { SectorShowcase } from './SectorShowcase'
import { FeaturesGrid } from './FeaturesGrid'
import { LiveSimulationBanner } from './LiveSimulationBanner'
import type { ActiveTab } from '@/components/layout/Navbar'

interface LandingPageProps {
  onNavigateTab: (tab: ActiveTab) => void
  onOpenJoinModal: () => void
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateTab,
  onOpenJoinModal,
}) => {
  return (
    <div className="w-full">
      <HeroSection
        onJoinQueue={onOpenJoinModal}
        onViewLiveKiosk={() => onNavigateTab('kiosk')}
        onExploreStaff={() => onNavigateTab('staff')}
        onViewHeatmap={() => onNavigateTab('heatmap')}
      />
      <SectorShowcase onJoinQueue={onOpenJoinModal} />
      <FeaturesGrid onSelectFeature={(tab) => onNavigateTab(tab as ActiveTab)} />
      <LiveSimulationBanner
        onGoToKiosk={() => onNavigateTab('kiosk')}
        onGoToAnalytics={() => onNavigateTab('analytics')}
      />
    </div>
  )
}
export default LandingPage
