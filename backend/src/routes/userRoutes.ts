// --- src/routes/auth.routes.ts ---
import express from 'express';
import { checkRole } from '../middlewares/checkRole';
import { verifyToken } from '../middlewares/verifyToken';

import { deleteUser, getUsers, updateUserStatus } from '../controllers/userController';
const router = express.Router();

router.get('/',verifyToken,checkRole("admin"), getUsers);
router.patch("/status/:id", updateUserStatus);
router.delete("/:id", deleteUser);


export default router;
