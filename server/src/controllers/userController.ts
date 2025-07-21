import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import { Types } from "mongoose";



export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(404).json({ message: "users not Found" });
    }
    res.json(users);
  } catch (error) {
    next(error);
  }
};



export const updateUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { isActive } = req.body;

  // Validate input
  if (typeof isActive !== "boolean") {
    return res.status(400).json({ message: "isActive must be a boolean" });
  }

  try {
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User status updated", user: updatedUser });
  } catch (error) {
    next(error);
  }
};


export const deleteUser = async (req:Request,res:Response,next:NextFunction) =>{

  const {id} = req.params;

  try {
    const user = await User.findByIdAndDelete({_id:id});

    if(!user){
      return res.status(404).json({message:"user not found"});
    }

    res.json({message:"user deleted successfully"})
    
  } catch (error) {
      next(error)
  }

}