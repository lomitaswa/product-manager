import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as productController from '../controllers/product.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/products');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${uuidv4()}${ext}`);
    }
});

const upload = multer({ storage });

router.get('/', authMiddleware, productController.list);
router.get('/:id', authMiddleware, productController.getById);
router.post('/', authMiddleware, productController.create);
router.post('/upload', authMiddleware, upload.single('image'), productController.upload);
router.patch('/:id', authMiddleware, productController.update);
router.delete('/:id', authMiddleware, productController.deleteById);

export default router;
