import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { publish, QUEUES } from '../services/rabbitmq.service.js';
import * as jobRepository from '../repositories/job.repository.js';

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${name}-${Date.now()}${ext}`);
    }
});

const upload = multer({ storage });

router.post('/products', upload.single('file'), async (req, res) => {
    const ext = path.extname(req.file?.originalname || '').replace('.', '');
    const result = await jobRepository.createJob('BULK_UPLOAD', 'PENDING', req.file?.path, ext);

    const jobId = result.id;

    await publish(QUEUES.BULK_UPLOAD, {
        jobId,
        filePath: req.file?.path,
        originalName: req.file?.originalname
    });

    res.status(202).json({
        data: { jobId, message: 'Bulk upload started' },
        msg: "success"
    });
});

export default router;