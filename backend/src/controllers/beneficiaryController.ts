// --- src/controllers/beneficiary.controller.ts ---
import { Request, Response } from 'express';
import Beneficiary from '../models/Beneficiary';
import { encrypt } from '../utils/encryption';

export const createBeneficiary = async (req: Request, res: Response) => {
  console.log('Creating beneficiary:', req.body);
  const { name, age, details } = req.body;
  const encryptedData = encrypt(details);
  const createdBy = (req as any).userId;
  const beneficiary = await Beneficiary.create({ name, age, details:encryptedData, createdBy });
  res.status(201).json(beneficiary);
  console.log('Beneficiary created:', beneficiary);
  console.log('response:', res.status(201).json(beneficiary));
};

export const getBeneficiaries = async (_req: Request, res: Response) => {
  const data = await Beneficiary.find();
  res.json(data);
};

export const updateBeneficiary = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await Beneficiary.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
};

export const deleteBeneficiary = async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = await Beneficiary.findByIdAndDelete(id);
  res.json({ message: 'Deleted' });
};
