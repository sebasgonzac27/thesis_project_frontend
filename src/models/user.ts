export interface User {
  id: number
  email: string
  role_id: UserRole
  status: UserStatus
  profile: UserProfile
  created_at: Date
  updated_at: Date
}

export interface UserProfile {
  first_name: string
  last_name: string
  nickname: null
  telephone: string
  document_type: string
  document_number: string
  rh: string
  birthdate: string
  genre: string
  photo: null
  team_id: number
}

export enum UserRole {
  ADMIN = 1,
  LEADER = 2,
  MEMBER = 3,
}

export enum UserStatus {
  ACTIVE = 'activo',
  INACTIVE = 'inactivo',
}
