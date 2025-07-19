// --- src/controllers/auth.controller.ts ---
import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password, role, status } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashed,
      role,
      status,
      createdBy: (req as any).userId,
    });
    res.status(201).json({
      username: user.username,
      email: user.email,
      role: user.role,
      createdBy: user.createdBy,
      status: user.status,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ error: "All fields  are required" });
    }

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) return res.status(403).json({ message: "Invalid credentials" });

    const token = generateToken(user._id)
    res.json({ token });
  } catch (error) {
    next(error);
  }
};
