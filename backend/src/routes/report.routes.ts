import { Router } from 'express';
import * as reportController from '../controllers/report.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/products', authMiddleware, reportController.generate);
router.get('/products', authMiddleware, reportController.listAll);
router.get('/status/:jobId', authMiddleware, reportController.status);
router.get('/download/:jobId', authMiddleware, reportController.download);
router.delete('/:jobId', authMiddleware, reportController.deleteById);

export default router;
