// --- src/controllers/beneficiary.controller.ts ---
import { NextFunction, Request, Response } from "express";
import Beneficiary from "../models/Beneficiary";
import { decrypt, encrypt } from "../utils/encryption";

export const createBeneficiary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, age, location, emergencyContact, medicalInfo, notes } =
    req.body;
  try {
    const encryptedLocation = encrypt(location);
    const encryptedMedicalInfo = encrypt(medicalInfo);
    const encryptedNotes = encrypt(notes);
    const createdBy = (req as any).userId;
    const beneficiary = await Beneficiary.create({
      name,
      age,
      medicalInfo: encryptedMedicalInfo,
      location: encryptedLocation,
      emergencyContact,
      notes: encryptedNotes,
      createdBy,
    });
    res.status(201).json(beneficiary);
  } catch (error) {
    next(error);
  }
};

export const getBeneficiaries = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const beneficiaries = await Beneficiary.find();

    if (!beneficiaries || beneficiaries.length === 0) {
      return res.status(404).json({ message: "Beneficiaries not found" });
    }

    const decryptedBeneficiaries = beneficiaries.map((b) => ({
      ...b.toObject(),
      location: b.location ? decrypt(b.location) : null,
      medicalInfo: b.medicalInfo
        ? decrypt(b.medicalInfo)
        : null,
      notes: b.notes ? decrypt(b.notes) : null,
    }));

    res.json(decryptedBeneficiaries);
  } catch (error) {
    next(error);
  }
};

export const getBeneficiariesById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const beneficiary = await Beneficiary.findById({ _id: id });
    if (!beneficiary)
      return res.status(404).json({ message: "beneficiary is not found" });
    res.json(beneficiary);
  } catch (error) {
    next(error);
  }
};

export const updateBeneficiary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const beneficiary = await Beneficiary.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!beneficiary) {
      return res.status(404).json({
        message: "Beneficiary not found",
      });
    }
    res.json(beneficiary);
  } catch (error) {
    next(error);
  }
};

export const deleteBeneficiary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const beneficiary = await Beneficiary.findByIdAndDelete(id);
    if (!beneficiary)
      return res.status(404).json({ message: "user not found" });
    res.json({ message: "Beneficiary Deleted successfully" });
  } catch (error) {
    next(error);
  }
};
