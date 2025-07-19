
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useUsers } from "./useUsers"

export enum Role {
  Admin = "admin",
  Field_agent = "field_agent",
  Medical_staff = "medical_staff",
  Trainer = "trainer"
}

interface User {
  id: string
  email: string
  role: Role
  name: string
  isActive:boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users for testing
// const demoUsers: Record<string, User> = {
//   "admin@safeaid.org": {
//     id: "1",
//     email: "admin@safeaid.org",
//     role: Role.Admin ,
//     name: "Admin User",
//     isActive:true
//   },
//   "agent@safeaid.org": {
//     id: "2",
//     email: "agent@safeaid.org",
//     role: Role.Field_agent,
//     name: "Field Agent",
//      isActive:true
//   },
//   "medical@safeaid.org": {
//     id: "3",
//     email: "medical@safeaid.org",
//     role: Role.Medical_staff,
//     name: "Medical Staff",
//      isActive:true
//   },
//   "trainer@safeaid.org": {
//     id: "4",
//     email: "trainer@safeaid.org",
//     role: Role.Trainer,
//     name: "Trainer",
//      isActive:true
//   },
// }

// const demoPasswords: Record<string, string> = {
//   "admin@safeaid.org": "admin123",
//   "agent@safeaid.org": "agent123",
//   "medical@safeaid.org": "medical123",
//   "trainer@safeaid.org": "trainer123",
// }

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
 const { users } = useUsers()

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("safeaid_user");
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("safeaid_user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // const user = demoUsers[email]
    // const validPassword = demoPasswords[email]
    const user = users.find(u => u.email == email)

    if (!user || password !== user.password || !user.isActive) {
      throw new Error("Invalid credentials")
    }
  

    setUser(user)
    localStorage.setItem("safeaid_user", JSON.stringify(user))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("safeaid_user")
  }

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
