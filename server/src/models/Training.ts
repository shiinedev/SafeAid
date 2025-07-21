// --- src/models/Training.ts ---
import mongoose from 'mongoose';

const trainingSchema = new mongoose.Schema({
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  title: String,
  category: String,
  duration: String,
  level:{
    type:String,
    enum:["Beginner","Intermediate","Advanced","Essential"],
    default:"Beginner"
  },
  description:String,
  content:String
},{timestamps:true});

export default mongoose.model('Training', trainingSchema);
