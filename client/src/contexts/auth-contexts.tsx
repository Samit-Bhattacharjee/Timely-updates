import { createContext, useContext, useState, type ReactNode } from "react"
import type { AuthContextType, CheckInRecord, User } from "../types/types"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const BASE_URL = import.meta.env.VITE_BACKEND_URL

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [checkInRecords, setCheckInRecords] = useState<CheckInRecord[]>([])

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        console.log("Login failed")
      }

      const data = await res.json()
      console.log(data);
      
      localStorage.setItem('token',data.access_token);
      setUser({
        id: data.id,
        name: data.name,
        email: data.email,
      })
    } catch (error) {
      console.error("Login error:", error)
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      if (!res.ok) {
       console.log("Signup failed")
      }

      const data = await res.json()

      setUser({
        id: data.id,
        name: data.name,
        email: data.email,
      })
    } catch (error) {
      console.error("Signup error:", error)
    }
  }

  const logout = () => {
    setUser(null)
    setCheckInRecords([])
  }

  const addCheckInRecord = (record: Omit<CheckInRecord, "id">) => {
    const newRecord: CheckInRecord = {
      ...record,
      id: Date.now().toString(),
    }
    setCheckInRecords((prev) => [newRecord, ...prev])
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        checkInRecords,
        addCheckInRecord,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
