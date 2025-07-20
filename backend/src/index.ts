// --- src/index.ts ---
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import beneficiaryRoutes from './routes/beneficiaryRoutes';
import trainingRoutes from './routes/trainingRoutes';
import userRoutes from './routes/userRoutes';
import { errorHandler } from './middlewares/errorHandler';
import cors from 'cors';
import { notFound } from './middlewares/notFound';
import { applySecurityMiddleware } from './middlewares/security';

dotenv.config();
const app = express();
// app.use(cors()); alredy imbelemented in security middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
applySecurityMiddleware(app);
app.use('/api/auth', authRoutes);
app.use('/api/beneficiaries', beneficiaryRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI!).then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
