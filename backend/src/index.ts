// SafeAid Backend – Full Implementation (Node.js + Express + TypeScript)

// --- src/index.ts ---
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import beneficiaryRoutes from './routes/beneficiaryRoutes';
import trainingRoutes from './routes/trainingRoutes';
import { errorHandler } from './middlewares/errorHandler';
import cors from 'cors';
import { notFound } from './middlewares/notFound';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/beneficiaries', beneficiaryRoutes);
app.use('/api/training', trainingRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI!).then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
