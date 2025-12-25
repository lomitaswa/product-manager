import Joi from 'joi';

export const createCategorySchema = Joi.object({
    name: Joi.string().required().max(255)
});

export const getCategorySchema = Joi.object({
    id: Joi.string().uuid().required()
});

export interface CreateCategoryDto {
    name: string;
}
