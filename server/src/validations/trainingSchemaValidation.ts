import { z } from "zod";

export const trainingSchemaValidation = z.object({
  title: z.string().min(1,"title is required"),
  category: z.string().min(1,"category is required"),
  duration: z.string().min(1,"duration is required"),
  level: z.enum(["Beginner", "Intermediate", "Advanced", "Essential"]).default("Beginner"),
  description: z.string().min(1,"description is required"),
  content: z.string().min(1,"content is required"),
});