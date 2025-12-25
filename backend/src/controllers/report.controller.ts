import { NextFunction, Request, Response } from 'express';
import * as reportService from '../services/report.service.js';

export const generate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const format = req.body.format || 'csv';
        if (!['csv', 'xlsx'].includes(format)) {
            return res.status(400).json({ error: "Invalid format. Use 'csv' or 'xlsx'", msg: "validation error" });
        }
        const job = await reportService.requestReport(format);
        res.status(202).json({ data: { jobId: job.id }, msg: "Report generation started" });
    } catch (error: any) {
        next(error);
    }
};

export const listAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const sortBy = (req.query.sortBy as string) || 'created_at';
        const sortOrder = (req.query.sortOrder as string === 'ASC') ? 'ASC' : 'DESC';

        const { jobs, total } = await reportService.listAllReports(page, limit, sortBy, sortOrder);
        res.status(200).json({ data: { jobs, total }, msg: "success" });
    } catch (error: any) {
        next(error);
    }
};

export const status = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const job = await reportService.getJobStatus(req.params.jobId);
        if (!job) {
            return res.status(404).json({ error: "Job not found", msg: "error" });
        }
        res.status(200).json({ data: job, msg: "success" });
    } catch (error: any) {
        next(error);
    }
};

export const download = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const job = await reportService.getJobStatus(req.params.jobId);
        if (!job || job.status !== 'COMPLETED' || !job.result_file_path) {
            return res.status(404).json({ error: "Report not ready or not found", msg: "error" });
        }
        res.download(job.result_file_path);
    } catch (error: any) {
        next(error);
    }
};

export const deleteById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { success } = await reportService.deleteReport(req.params.jobId);
        res.status(200).json({ data: { success }, msg: success ? "success" : "not found" });
    } catch (error: any) {
        next(error);
    }
};
