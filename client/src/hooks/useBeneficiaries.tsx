import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { beneficiaryService } from "@/lib/services/beneficiaryService"
import type { Beneficiary } from "@/schemas/schemas"

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
      setLoading(true)
      const data = await beneficiaryService.getAllBeneficiaries()
      setBeneficiaries(data)
    } catch (error) {
      console.error("Error loading beneficiaries:", error)
      setBeneficiaries([])
    } finally {
      setLoading(false)
    }
  }

  const addBeneficiary = async (beneficiaryData: Omit<Beneficiary, "_id">) => {
    try {
      const newBeneficiary = await beneficiaryService.createBeneficiary(beneficiaryData)
      setBeneficiaries(prev => [...prev, newBeneficiary])
    } catch (error) {
      console.error("Error adding beneficiary:", error)
      throw error
    }
  }

  const updateBeneficiary = async (_id: string, updates: Partial<Beneficiary>) => {
    try {
      const updatedBeneficiary = await beneficiaryService.updateBeneficiary(_id, updates)
      setBeneficiaries(prev => 
        prev.map(beneficiary => 
          beneficiary._id === _id ? updatedBeneficiary : beneficiary
        )
      )
    } catch (error) {
      console.error("Error updating beneficiary:", error)
      throw error
    }
  }

  const deleteBeneficiary = async (_id: string) => {
    try {
      await beneficiaryService.deleteBeneficiary(_id)
      setBeneficiaries(prev => prev.filter(beneficiary => beneficiary._id !== _id))
    } catch (error) {
      console.error("Error deleting beneficiary:", error)
      throw error
    }
  }

  const getBeneficiary = async (_id: string) => {
    try {
      return await beneficiaryService.getBeneficiaryById(_id)
    } catch (error) {
      console.error("Error getting beneficiary:", error)
      throw error
    }
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
