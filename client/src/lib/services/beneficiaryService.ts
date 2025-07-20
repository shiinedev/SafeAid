import api from '../apiClient';
import type { Beneficiary } from '@/schemas/schemas';

export const beneficiaryService = {
  async getAllBeneficiaries() {

    const response = await api.get('/beneficiaries');
    console.log('loadinig beneficiaries');
    console.log(response.data );

    return response.data;
  },

  async getBeneficiaryById(id: string) {
    const response = await api.get(`/beneficiaries/${id}`);
    return response.data;
  },

  async createBeneficiary(data: Omit<Beneficiary, 'id'>) {
    const response = await api.post('/beneficiaries', data);
    return response.data;
  },

  async updateBeneficiary(id: string, data: Partial<Beneficiary>) {
    const response = await api.put(`/beneficiaries/${id}`, data);
    return response.data;
  },

  async deleteBeneficiary(id: string) {
    const response = await api.delete(`/beneficiaries/${id}`);
    return response.data;
  }
};
