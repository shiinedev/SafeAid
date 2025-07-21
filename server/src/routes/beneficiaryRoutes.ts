// --- src/routes/beneficiary.routes.ts ---
import express from 'express';
import { createBeneficiary, getBeneficiaries, updateBeneficiary, deleteBeneficiary, getBeneficiariesById } from '../controllers/beneficiaryController';
import { verifyToken } from '../middlewares/verifyToken';
import { validateSchema } from '../middlewares/validateSchemas';
import { beneficiarySchemaValidation } from '../validations/beneficiarySchemaValidation';
import { checkRole } from '../middlewares/checkRole';
const router = express.Router();

router.use(verifyToken);
router.post('/', checkRole("admin","field_agent"),validateSchema(beneficiarySchemaValidation), createBeneficiary);
router.get('/', getBeneficiaries);
router.get('/:id', getBeneficiariesById);
router.put('/:id',checkRole("admin","field_agent"), updateBeneficiary);
router.delete('/:id', checkRole("admin","field_agent"),deleteBeneficiary);

export default router;