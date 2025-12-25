import { NextFunction, Request, Response } from 'express';
import * as productService from '../services/product.service.js';
import { createProductSchema, updateProductSchema, productFilterSchema } from '../dtos/product.dto.js';

export const list = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { error, value: filters } = productFilterSchema.validate(req.query);
        if (error) {
            return res.status(400).json({ error: error.details[0].message, msg: "validation error" });
        }
        const data = await productService.getAllProducts(filters);
        res.status(200).json({ data, msg: "success" });
    } catch (error: any) {
        next(error);
    }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await productService.getProductById(req.params.id);
        res.status(200).json({ data: product, msg: "success" });
    } catch (error: any) {
        res.status(404).json({ error: error.message, msg: "error" });
    }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { error, value: productData } = createProductSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message, msg: "validation error" });
        }
        const category = await productService.createProduct(productData);
        res.status(201).json({ data: category, msg: "success" });
    } catch (error: any) {
        next(error);
    }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id: string = req.params.id;
        const { error, value: productData } = updateProductSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message, msg: "validation error" });
        }
        const product = await productService.updateProduct(id, productData);
        res.status(200).json({ data: product, msg: "success" });
    } catch (error: any) {
        res.status(404).json({ error: error.message, msg: "error" });
    }
};

export const deleteById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id: string = req.params.id;
        await productService.deleteProduct(id);
        res.status(200).json({ data: { success: true }, msg: "success" });
    } catch (error: any) {
        res.status(404).json({ error: error.message, msg: "error" });
    }
};

export const upload = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded', msg: 'error' });
        }

        const url = `${req.protocol}://${req.get('host')}/uploads/products/${req.file.filename}`;
        res.status(200).json({ data: { url }, msg: 'success' });
    } catch (error: any) {
        next(error);
    }
};
