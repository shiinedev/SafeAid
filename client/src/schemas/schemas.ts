
import { Role } from "@/lib/store/authStore";
import z from "zod";


export const loginSchema = z.object({
  email: z.email("Email is not valid"),
  password: z.string().min(1, "please enter your password"),
});

export type login= z.infer<typeof loginSchema>;

enum Level {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
  Essential = "Essential",
}

export const trainingSchema = z.object({
  title: z.string().min(1, "title is required"),
  description: z.string().min(1, "description is required"),
  category: z.string().min(1, "category is required"),
  duration: z.string().min(1, "duration is required"),
  content: z.string().min(1, "content is required"),
  level: z.nativeEnum(Level),
});

export type TrainingFormValues = z.infer<typeof trainingSchema>;

export const BeneficiarySchema = z.object({
  name: z.string().min(1, "name is required"),
  age: z.coerce.number().min(1, "age is must be greater than 0"),
  contact: z.string().min(1, "contact is required"),
  emergencyContact: z.string().min(1, "emergency contact"),
  location: z.string().min(1, "location is required"),
  medicalInfo: z.string().optional(),
  notes: z.string().optional(),
});

export type Beneficiary = z.infer<typeof BeneficiarySchema>;

export const userSchema = z
  .object({
    email: z.email("email is not valid"),
    username: z.string().min(1, "name is required"),
    role: z.nativeEnum(Role),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string("confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type User = z.infer<typeof userSchema>;





