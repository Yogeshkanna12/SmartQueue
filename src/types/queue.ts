export type VenueType = 'hospital' | 'bank' | 'civic' | 'university'

export type PriorityLevel = 'STANDARD' | 'SENIOR' | 'ACCESSIBILITY' | 'EMERGENCY_TRIAGE'

export type TicketStatus = 
  | 'WAITING' 
  | 'CALLING' 
  | 'SERVING' 
  | 'HELD' 
  | 'COMPLETED' 
  | 'NO_SHOW' 
  | 'CANCELLED'

export type CounterStatus = 'OPEN' | 'BUSY' | 'ON_BREAK' | 'CLOSED'

export interface Department {
  id: string
  name: string
  code: string // Prefix like 'OPD', 'TELL', 'DMV', 'FIN'
  description: string
  icon: string
  color: string
  avgServiceMinutes: number
}

export interface Counter {
  id: string
  number: number
  name: string
  staffName: string
  staffRole: string
  departmentId: string
  status: CounterStatus
  currentTicketId?: string
  currentTicketNumber?: string
  ticketsServedCount: number
  avgHandlingSeconds: number
}

export interface Ticket {
  id: string // e.g., "A-104" or "OPD-102"
  dbId: string // unique uuid
  venueId: VenueType
  departmentId: string
  departmentName: string
  serviceName: string
  customerName: string
  customerPhone: string
  priority: PriorityLevel
  status: TicketStatus
  issuedAt: number
  calledAt?: number
  completedAt?: number
  counterId?: string
  counterNumber?: number
  counterStaff?: string
  estimatedWaitMinutes: number
  notificationsEnabled: boolean
  notes?: string
}

export interface HeatmapZone {
  id: string
  name: string
  category: 'ENTRANCE' | 'WAITING' | 'COUNTERS' | 'TRIAGE' | 'EXIT'
  currentCount: number
  maxCapacity: number
  flowRatePerMin: number
  status: 'OPTIMAL' | 'ELEVATED' | 'CRITICAL'
  x: number
  y: number
  width: number
  height: number
}

export interface AIRecommendation {
  id: string
  title: string
  description: string
  severity: 'INFO' | 'WARNING' | 'CRITICAL'
  departmentId: string
  actionType: 'OPEN_COUNTER' | 'TRIAGE_REVISE' | 'REDIRECT_FLOW' | 'STAFF_BREAK'
  impactText: string
  applied: boolean
  timestamp: number
}

export interface VenueConfig {
  id: VenueType
  name: string
  tagline: string
  category: string
  address: string
  departments: Department[]
}

export interface SystemStats {
  totalServedToday: number
  activeInQueue: number
  avgWaitMinutes: number
  satisfactionScore: number
  throughputPerHour: number
  congestionIndex: number // 0 - 100
  bottleneckArea: string
}
