import fs from 'fs';
import * as jobRepository from "../repositories/job.repository.js";
import { publish, QUEUES } from "./rabbitmq.service.js";

export const requestReport = async (format: 'csv' | 'xlsx') => {
    const job = await jobRepository.createJob('REPORT_GENERATION', 'PENDING', undefined, format);
    await publish(QUEUES.REPORT, { jobId: job.id, format });
    return job;
};

export const getJobStatus = async (jobId: string) => {
    return await jobRepository.findById(Number(jobId));
};

export const listAllReports = async (page: number = 1, limit: number = 10, sortBy: string = 'created_at', sortOrder: 'ASC' | 'DESC' = 'DESC') => {
    const jobs = await jobRepository.findAll(undefined, page, limit, sortBy, sortOrder);
    const total = await jobRepository.countAll(undefined);
    return { jobs, total };
};

export const deleteReport = async (jobId: string) => {
    const job = await jobRepository.findById(Number(jobId));
    if (job && job.result_file_path && fs.existsSync(job.result_file_path)) {
        try {
            fs.unlinkSync(job.result_file_path);
        } catch (err) {
            console.error('Failed to delete report file:', err);
        }
    }
    const rowCount = await jobRepository.deleteJob(Number(jobId));
    return { success: (rowCount ?? 0) > 0 };
};
