// --- src/routes/beneficiary.routes.ts ---
import express from 'express';
import { createBeneficiary, getBeneficiaries, updateBeneficiary, deleteBeneficiary } from '../controllers/beneficiaryController';
import { verifyToken } from '../middlewares/verifyToken';
const router = express.Router();

router.use(verifyToken);
router.post('/', createBeneficiary);
router.get('/', getBeneficiaries);
router.put('/:id', updateBeneficiary);
router.delete('/:id', deleteBeneficiary);

export default router;