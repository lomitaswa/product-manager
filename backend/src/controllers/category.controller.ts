import { Request, Response } from 'express';
import * as categoryService from '../services/category.service.js';

export const list = async (req: Request, res: Response) => {
    try {
        const { categories } = await categoryService.getAll();
        res.status(200).json({ data: categories, msg: "success" });
    } catch (error: any) {
        res.status(500).json({ error: error.message, msg: "error" });
    }
}

export const getById = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const { category } = await categoryService.get(id);
        if (!category) {
            return res.status(404).json({ error: "Category not found", msg: "error" });
        }
        res.status(200).json({ data: category, msg: "success" });
    } catch (error: any) {
        res.status(400).json({ error: error.message, msg: "error" });
    }
}

export const create = async (req: Request, res: Response) => {
    try {
        const name: string = req.body.name;
        const { category } = await categoryService.create({ name });
        res.status(201).json({ data: category, msg: "success" });
    } catch (error: any) {
        res.status(400).json({ error: error.message, msg: "error" });
    }
}

export const update = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const name: string = req.body.name;
        const { category } = await categoryService.update(id, name);
        res.status(200).json({ data: category, msg: "success" });
    } catch (error: any) {
        res.status(400).json({ error: error.message, msg: "error" });
    }
}

export const deleteById = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const { success } = await categoryService.deleteById(id);
        res.status(200).json({ data: { success }, msg: success ? "success" : "not found" });
    } catch (error: any) {
        res.status(400).json({ error: error.message, msg: "error" });
    }
}