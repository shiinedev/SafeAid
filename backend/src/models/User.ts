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
  status:{
    type: String, 
    enum: ['active', 'deActive'],
    default:"active"
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
});

export default mongoose.model('User', userSchema);