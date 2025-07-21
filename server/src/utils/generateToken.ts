import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

// Define the return type
export const generateToken = (userId:Types.ObjectId): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};
