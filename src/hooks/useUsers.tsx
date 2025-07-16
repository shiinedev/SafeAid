
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { encryptData, decryptData } from "@/lib/encryption"


interface User {
  id: string
  email: string
  name: string
  role: Role
  password: string
  isActive: boolean
  createdAt: string
  lastLogin?: string
  createdBy: string
}

 enum Role {
  Admin = "admin",
  Field_agent = "field_agent",
  Medical_staff = "medical_staff",
  Trainer = "trainer"
}

interface UsersContextType {
  users: User[]
  addUser: (user: Omit<User, "id" | "createdAt">) => Promise<void>
  updateUser: (id: string, updates: Partial<User>) => Promise<void>
  deleteUser: (id: string) => Promise<void>
  getUser: (id: string) => User | undefined
  getUsersByRole: (role: string) => User[]
  loading: boolean
}

const UsersContext = createContext<UsersContextType | undefined>(undefined)

// Default users for demo - these include passwords
const defaultUsers: User[] = [
  {
    id: "1",
    email: "admin@safeaid.org",
    name: "Admin User",
    role: Role.Admin,
    password: "admin123",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: "2024-01-15T10:30:00Z",
    createdBy: "system",
  },
  {
    id: "2",
    email: "agent@safeaid.org",
    name: "Field Agent",
    role: Role.Field_agent,
    password: "agent123",
    isActive: true,
    createdAt: "2024-01-02T00:00:00Z",
    lastLogin: "2024-01-14T14:20:00Z",
    createdBy: "admin@safeaid.org",
  },
  {
    id: "3",
    email: "medical@safeaid.org",
    name: "Medical Staff",
    role: Role.Medical_staff,
    password: "medical123",
    isActive: true,
    createdAt: "2024-01-03T00:00:00Z",
    lastLogin: "2024-01-13T09:15:00Z",
    createdBy: "admin@safeaid.org",
  },
  {
    id: "4",
    email: "trainer@safeaid.org",
    name: "Trainer",
    role: Role.Trainer,
    password: "trainer123",
    isActive: true,
    createdAt: "2024-01-04T00:00:00Z",
    lastLogin: "2024-01-12T16:45:00Z",
    createdBy: "admin@safeaid.org",
  },
]

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const encryptedData = localStorage.getItem("safeaid_users")
      if (encryptedData) {
        const decryptedData = await decryptData(encryptedData)
        setUsers(JSON.parse(decryptedData))
      } else {
        // Initialize with default users
        setUsers(defaultUsers)
        await saveUsers(defaultUsers)
      }
    } catch (error) {
      console.error("Error loading users:", error)
      setUsers(defaultUsers)
    } finally {
      setLoading(false)
    }
  }

  const saveUsers = async (data: User[]) => {
    try {
      const encryptedData = await encryptData(JSON.stringify(data))
      localStorage.setItem("safeaid_users", encryptedData)
    } catch (error) {
      console.error("Error saving users:", error)
    }
  }

  const addUser = async (userData: Omit<User, "id" | "createdAt">) => {
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    }

    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)
    await saveUsers(updatedUsers)
  }

  const updateUser = async (id: string, updates: Partial<User>) => {
    console.log(updates);
    
    const updatedUsers = users.map((user) => (user.id === id ? { ...user, ...updates } : user))
    setUsers(updatedUsers)
    await saveUsers(updatedUsers)
  }

  const deleteUser = async (id: string) => {
    const updatedUsers = users.filter((user) => user.id !== id)
    setUsers(updatedUsers)
    await saveUsers(updatedUsers)
  }

  const getUser = (id: string) => {
    return users.find((user) => user.id === id)
  }

  const getUsersByRole = (role: string) => {
    return users.filter((user) => user.role === role && user.isActive)
  }

  return (
    <UsersContext.Provider
      value={{
        users: users,
        addUser,
        updateUser,
        deleteUser,
        getUser,
        getUsersByRole,
        loading,
      }}
    >
      {children}
    </UsersContext.Provider>
  )
}

export function useUsers() {
  const context = useContext(UsersContext)
  if (context === undefined) {
    throw new Error("useUsers must be used within a UsersProvider")
  }
  return context
}
