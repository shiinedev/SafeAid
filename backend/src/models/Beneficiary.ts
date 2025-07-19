// --- src/models/Beneficiary.ts ---
import mongoose from 'mongoose';

const beneficiarySchema = new mongoose.Schema({
  name: String,
  age: Number,
  location: String,
  contactInfo:String,
  emergencyContact:String,
  medicalInfo:String,
  notes:String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},{timestamps:true});

export default mongoose.model('Beneficiary', beneficiarySchema);