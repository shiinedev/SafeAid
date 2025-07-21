import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateSchema = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    console.log("result:", result);

    if (!result.success) {
      const formatted = result.error.format();

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: Object.keys(formatted).map((field) => ({
          field,
          message: (formatted as any)[field]?._errors?.[0] || "Invalid input",
        })),
      });
    }
    next();
  };
};
