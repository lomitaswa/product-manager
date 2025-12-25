import Joi from 'joi';

export interface CreateProductDto {
    name: string;
    image_url?: string;
    price: number;
    category_id: number;
}

export interface UpdateProductDto {
    name?: string;
    image_url?: string;
    price?: number;
    category_id?: number;
}

export interface ProductFilterDto {
    category_id?: number;
    search?: string;
    sortBy?: 'price' | 'name';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export const createProductSchema = Joi.object({
    name: Joi.string().required().max(255),
    image_url: Joi.string().uri().allow('').optional(),
    price: Joi.number().required().min(0),
    category_id: Joi.string().uuid().required()
});

export const updateProductSchema = Joi.object({
    name: Joi.string().max(255).optional(),
    image_url: Joi.string().uri().allow('').optional(),
    price: Joi.number().min(0).optional(),
    category_id: Joi.string().uuid().optional()
});

export const productFilterSchema = Joi.object({
    category_id: Joi.string().uuid().optional(),
    search: Joi.string().optional(),
    sortBy: Joi.string().valid('price', 'name').optional(),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
});
