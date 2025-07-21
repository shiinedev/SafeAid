// --- src/models/User.ts ---
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username:String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'field_agent', 'medical', 'trainer'], 
    default: 'field_agent'
   },
  isActive:{
    type: Boolean, 
    default:true
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
},{timestamps:true});

export default mongoose.model('User', userSchema);