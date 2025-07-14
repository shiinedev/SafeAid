import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { encryptData, decryptData } from "@/lib/encryption"

interface Beneficiary {
  id: string
  name: string
  age: number
  contact: string
  emergencyContact: string
  location: string
  medicalInfo?: string
  notes?: string
  registeredBy: string
  registeredAt: string
}

interface BeneficiariesContextType {
  beneficiaries: Beneficiary[]
  addBeneficiary: (beneficiary: Omit<Beneficiary, "id">) => Promise<void>
  updateBeneficiary: (id: string, beneficiary: Partial<Beneficiary>) => Promise<void>
  deleteBeneficiary: (id: string) => Promise<void>
  getBeneficiary: (id: string) => Beneficiary | undefined
  loading: boolean
}

const BeneficiariesContext = createContext<BeneficiariesContextType | undefined>(undefined)

export function BeneficiariesProvider({ children }: { children: ReactNode }) {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBeneficiaries()
  }, [])

  const loadBeneficiaries = async () => {
    try {
      const encryptedData = localStorage.getItem("safeaid_beneficiaries")
      if (encryptedData) {
        const decryptedData = await decryptData(encryptedData)
        setBeneficiaries(JSON.parse(decryptedData))
      }
    } catch (error) {
      console.error("Error loading beneficiaries:", error)
      setBeneficiaries([])
    } finally {
      setLoading(false)
    }
  }

  const saveBeneficiaries = async (data: Beneficiary[]) => {
    try {
      const encryptedData = await encryptData(JSON.stringify(data))
      localStorage.setItem("safeaid_beneficiaries", encryptedData)
    } catch (error) {
      console.error("Error saving beneficiaries:", error)
    }
  }

  const addBeneficiary = async (beneficiaryData: Omit<Beneficiary, "id">) => {
    const newBeneficiary: Beneficiary = {
      ...beneficiaryData,
      id: `ben_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }

    const updatedBeneficiaries = [...beneficiaries, newBeneficiary]
    setBeneficiaries(updatedBeneficiaries)
    await saveBeneficiaries(updatedBeneficiaries)
  }

  const updateBeneficiary = async (id: string, updates: Partial<Beneficiary>) => {
    const updatedBeneficiaries = beneficiaries.map((beneficiary) =>
      beneficiary.id === id ? { ...beneficiary, ...updates } : beneficiary,
    )
    setBeneficiaries(updatedBeneficiaries)
    await saveBeneficiaries(updatedBeneficiaries)
  }

  const deleteBeneficiary = async (id: string) => {
    const updatedBeneficiaries = beneficiaries.filter((beneficiary) => beneficiary.id !== id)
    setBeneficiaries(updatedBeneficiaries)
    await saveBeneficiaries(updatedBeneficiaries)
  }

  const getBeneficiary = (id: string) => {
    return beneficiaries.find((beneficiary) => beneficiary.id === id)
  }

  return (
    <BeneficiariesContext.Provider
      value={{
        beneficiaries,
        addBeneficiary,
        updateBeneficiary,
        deleteBeneficiary,
        getBeneficiary,
        loading,
      }}
    >
      {children}
    </BeneficiariesContext.Provider>
  )
}

export function useBeneficiaries() {
  const context = useContext(BeneficiariesContext)
  if (context === undefined) {
    throw new Error("useBeneficiaries must be used within a BeneficiariesProvider")
  }
  return context
}
