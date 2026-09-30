export type UserRole = 'user' | 'staff'

export interface AuthUser {
  id: string
  name: string
  email: string
  phone?: string
  role: UserRole
  createdAt: number
}
