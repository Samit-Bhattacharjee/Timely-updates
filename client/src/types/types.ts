// src/types/types.ts

// Represents the logged-in user
export interface User {
  id: string
  name: string
  email: string
}

// Represents a check-in record for a user
export interface CheckInRecord {
  id: string
  date: string
  time: string
  status: string
}

// The full shape of the authentication context
export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  checkInRecords: CheckInRecord[]
  addCheckInRecord: (record: Omit<CheckInRecord, "id">) => void
}
