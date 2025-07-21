import { z } from "zod";

export const beneficiarySchemaValidation = z.object({
  name: z.string().min(1,"name is required"),
  age: z.number().min(1,"age is required"),
  location: z.string().min(1,"location is required"),
  contactInfo: z.string().min(1,"contact or phone is required"),
  emergencyContact: z.string().min(1,"emergency contact is required"),
  medicalInfo: z.string().optional(),
  notes: z.string().optional()
});