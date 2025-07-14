"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { encryptData, decryptData } from "../lib/encryption"

export enum Level  {
    Beginner = "Beginner",
    Intermediate = "Intermediate",
    Advanced = "Advanced",
    Essential = "Essential"

}

interface TrainingModule {
  id: string
  title: string
  description: string
  category: string
  duration: string
  level: Level
  content: string
  attachments?: string[]
  createdBy: string
  createdAt: string
  updatedAt: string
  isActive: boolean
}

interface TrainingContextType {
  modules: TrainingModule[]
  addModule: (module: Omit<TrainingModule, "id" | "createdAt" | "updatedAt">) => Promise<void>
  updateModule: (id: string, updates: Partial<TrainingModule>) => Promise<void>
  deleteModule: (id: string) => Promise<void>
  getModule: (id: string) => TrainingModule | undefined
  getModulesByCategory: (category: string) => TrainingModule[]
  loading: boolean
}

const TrainingContext = createContext<TrainingContextType | undefined>(undefined)

export const Categories:string[] = ["First Aid","Trauma Care","Data Security","Mental Health"]

// Default training modules for initial setup
const defaultModules: TrainingModule[] = [
  {
    id: "default_1",
    title: "Basic First Aid Fundamentals",
    description: "Essential first aid techniques for emergency situations",
    category: "First Aid",
    duration: "45 min",
    level: Level.Beginner,
    content: `Basic First Aid Fundamentals
               Learning Objectives
              - Understand primary assessment techniques
              - Learn basic wound care
              - Master CPR basics
              - Recognize emergency situations

               Module Content
              1. Scene Safety
              Always ensure the scene is safe before approaching a victim...

              2. Primary Assessment
              Check for responsiveness, breathing, and circulation...

              3. Basic Wound Care
              Clean wounds with sterile water or saline...`,
               createdBy: "system",
               createdAt: "2024-01-01T00:00:00Z",
               updatedAt: "2024-01-01T00:00:00Z",
               isActive: true,
  },
  {
    id: "default_2",
    title: "Trauma Response in Crisis Zones",
    description: "Advanced trauma care for high-risk environments",
    category: "Trauma Care",
    duration: "60 min",
    level: Level.Advanced,
    content: `# Trauma Response in Crisis Zones

## Critical Considerations
- Environmental hazards
- Limited resources
- Security concerns
- Evacuation procedures

## Advanced Techniques
### Hemorrhage Control
- Direct pressure
- Pressure points
- Tourniquet application

### Airway Management
- Manual techniques
- Basic adjuncts
- Emergency procedures`,
    createdBy: "system",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    isActive: true,
  },
  {
    id: "default_3",
    title: "Data Protection and Privacy",
    description: "Protecting beneficiary data and maintaining confidentiality",
    category: "Data Security",
    duration: "25 min",
    level: Level.Essential,
    content: `# Data Protection and Privacy

## Core Principles
- Confidentiality
- Integrity
- Availability
- Accountability

## Best Practices
### Data Collection
- Collect only necessary information
- Obtain proper consent
- Use secure methods

### Data Storage
- Encrypt all sensitive data
- Use strong passwords
- Regular backups

### Data Sharing
- Need-to-know basis
- Secure transmission
- Audit trails`,
    createdBy: "system",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    isActive: true,
  },
]

export function TrainingProvider({ children }: { children: ReactNode }) {
  const [modules, setModules] = useState<TrainingModule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadModules()
  }, [])

  const loadModules = async () => {
    try {
      const encryptedData = localStorage.getItem("safeaid_training_modules")
      if (encryptedData) {
        const decryptedData = await decryptData(encryptedData)
        setModules(JSON.parse(decryptedData))
      } else {
        // Initialize with default modules
        setModules(defaultModules)
        await saveModules(defaultModules)
      }
    } catch (error) {
      console.error("Error loading training modules:", error)
      setModules(defaultModules)
    } finally {
      setLoading(false)
    }
  }

  const saveModules = async (data: TrainingModule[]) => {
    try {
      const encryptedData = await encryptData(JSON.stringify(data))
      localStorage.setItem("safeaid_training_modules", encryptedData)
    } catch (error) {
      console.error("Error saving training modules:", error)
    }
  }

  const addModule = async (moduleData: Omit<TrainingModule, "id" | "createdAt" | "updatedAt">) => {
    const newModule: TrainingModule = {
      ...moduleData,
      id: `module_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const updatedModules = [...modules, newModule]
    setModules(updatedModules)
    await saveModules(updatedModules)
  }

  const updateModule = async (id: string, updates: Partial<TrainingModule>) => {
    const updatedModules = modules.map((module) =>
      module.id === id ? { ...module, ...updates, updatedAt: new Date().toISOString() } : module,
    )
    setModules(updatedModules)
    await saveModules(updatedModules)
  }

  const deleteModule = async (id: string) => {
    const updatedModules = modules.filter((module) => module.id !== id)
    setModules(updatedModules)
    await saveModules(updatedModules)
  }

  const getModule = (id: string) => {
    return modules.find((module) => module.id === id)
  }

  const getModulesByCategory = (category: string) => {
    return modules.filter((module) => module.category === category && module.isActive)
  }

  return (
    <TrainingContext.Provider
      value={{
        modules: modules.filter((m) => m.isActive),
        addModule,
        updateModule,
        deleteModule,
        getModule,
        getModulesByCategory,
        loading,
      }}
    >
      {children}
    </TrainingContext.Provider>
  )
}

export function useTraining() {
  const context = useContext(TrainingContext)
  if (context === undefined) {
    throw new Error("useTraining must be used within a TrainingProvider")
  }
  return context
}
