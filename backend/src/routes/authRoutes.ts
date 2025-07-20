// --- src/routes/auth.routes.ts ---
import express from 'express';
import { loginUser, registerUser } from '../controllers/authController';
import { userSchemaValidation } from '../validations/userSchemaValidation';
import { validateSchema } from '../middlewares/validateSchemas';
import { checkRole } from '../middlewares/checkRole';
import { verifyToken } from '../middlewares/verifyToken';
import { loginRateLimiter } from '../middlewares/security';

const router = express.Router();


router.post('/register',verifyToken,validateSchema(userSchemaValidation),checkRole("admin"), registerUser);
router.post('/login', loginRateLimiter,loginUser);

export default router;
