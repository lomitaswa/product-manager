import * as categoryRepository from "../repositories/category.repository.js";
import { CreateCategoryDto } from "../dtos/category.dto.js";

export const get = async (id: string) => {
    const category = await categoryRepository.findById(id);
    return { category };
}

export const update = async (id: string, name: string) => {
    const category = await categoryRepository.update(id, name);
    return { category };
}

export const deleteById = async (id: string) => {
    const result = await categoryRepository.deleteById(id);
    return { success: (result ?? 0) > 0 };
}

export const create = async (categoryData: CreateCategoryDto) => {
    const category = await categoryRepository.create(categoryData);
    return { category };
}

export const getAll = async () => {
    const categories = await categoryRepository.findAll();
    return { categories };
}