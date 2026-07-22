import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { loginValidator } from '../validators/auth.validator';
import { validateRequest } from '../middlewares/validateRequest.middleware';
import { authLimiter } from '../middlewares/rateLimit.middleware';

const router = Router();

router.post('/login', authLimiter, loginValidator, validateRequest, authController.login);
router.post('/refresh', authLimiter, authController.refresh);
router.post('/logout', authController.logout);

export default router;
