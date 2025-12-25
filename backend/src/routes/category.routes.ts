import { Router } from 'express';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { createCategorySchema, getCategorySchema } from '../dtos/category.dto.js';
import * as categoryController from '../controllers/category.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', authMiddleware, categoryController.list);
router.get('/:id', validateRequest(getCategorySchema, 'params'), authMiddleware, categoryController.getById);
router.post('/', validateRequest(createCategorySchema), authMiddleware, categoryController.create);
router.put('/:id', validateRequest(createCategorySchema), authMiddleware, categoryController.update);
router.delete('/:id', authMiddleware, categoryController.deleteById);

export default router;
