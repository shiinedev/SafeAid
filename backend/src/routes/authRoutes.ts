// --- src/routes/auth.routes.ts ---
import express from 'express';
import { loginUser, registerUser } from '../controllers/authController';
import { userSchemaValidation } from '../validations/userSchemaValidation';
import { validateSchema } from '../middlewares/validateSchemas';
import { checkRole } from '../middlewares/checkRole';
const router = express.Router();

router.post('/register',validateSchema(userSchemaValidation),checkRole("admin"), registerUser);
router.post('/login', loginUser);

export default router;
