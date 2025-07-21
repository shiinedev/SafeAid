import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { encryptData, decryptData } from '@/lib/encryption';
import { beneficiaryService } from '@/lib/services/beneficiaryService';

interface Beneficiary {
  id: string;
  name: string;
  age: number;
  contact: string;
  emergencyContact: string;
  location: string;
  medicalInfo?: string;
  notes?: string;
  registeredBy: string;
  registeredAt: string;
}

interface BeneficiariesContextType {
  beneficiaries: Beneficiary[];
  addBeneficiary: (beneficiary: Omit<Beneficiary, 'id'>) => Promise<void>;
  updateBeneficiary: (id: string, beneficiary: Partial<Beneficiary>) => Promise<void>;
  deleteBeneficiary: (id: string) => Promise<void>;
  getBeneficiary: (id: string) => Beneficiary | undefined;
  loading: boolean;
}

const BeneficiariesContext = createContext<BeneficiariesContextType | undefined>(undefined);

export function BeneficiariesProvider({ children }: { children: ReactNode }) {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBeneficiaries();
  }, []);

  const loadBeneficiaries = async () => {
    try {
      console.log('Loading beneficiaries...');
      setLoading(true);
      const encryptedList = await beneficiaryService.getAllBeneficiaries();

      // Decrypt each field for frontend display
      const decrypted = await Promise.all(
        encryptedList.map(async (b: any) => ({
          ...b,
          location: b.location ? await decryptData(b.location) : '',
          medicalInfo: b.medicalInfo ? await decryptData(b.medicalInfo) : '',
          notes: b.notes ? await decryptData(b.notes) : '',
        }))
      );
      console.log('Beneficiaries loaded:', decrypted);
      setBeneficiaries(decrypted);
    } catch (error) {
      console.error('Error fetching beneficiaries:', error);
      setBeneficiaries([]);
    } finally {
      setLoading(false);
    }
  };

  const addBeneficiary = async (data: Omit<Beneficiary, 'id'>) => {
    const encrypted = {
      ...data,
      location: await encryptData(data.location),
      medicalInfo: data.medicalInfo ? await encryptData(data.medicalInfo) : '',
      notes: data.notes ? await encryptData(data.notes) : '',
    };

    const created = await beneficiaryService.createBeneficiary(encrypted);
    await loadBeneficiaries();
  };

  const updateBeneficiary = async (id: string, updates: Partial<Beneficiary>) => {
    const encrypted = {
      ...updates,
      location: updates.location ? await encryptData(updates.location) : undefined,
      medicalInfo: updates.medicalInfo ? await encryptData(updates.medicalInfo) : undefined,
      notes: updates.notes ? await encryptData(updates.notes) : undefined,
    };

    await beneficiaryService.updateBeneficiary(id, encrypted);
    await loadBeneficiaries();
  };

  const deleteBeneficiary = async (id: string) => {
    await beneficiaryService.deleteBeneficiary(id);
    await loadBeneficiaries();
  };

  const getBeneficiary = (id: string) => {
    return beneficiaries.find((b) => b.id === id);
  };

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
  );
}

export function useBeneficiaries() {
  const context = useContext(BeneficiariesContext);
  if (!context) {
    throw new Error('useBeneficiaries must be used within a BeneficiariesProvider');
  }
  return context;
}
