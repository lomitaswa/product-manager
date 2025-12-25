import * as productRepository from "../repositories/product.repository.js";
import { CreateProductDto, UpdateProductDto, ProductFilterDto } from "../dtos/product.dto.js";

export const getAllProducts = async (filters: ProductFilterDto) => {
    return await productRepository.findAll(filters);
};

export const getProductById = async (id: string) => {
    const product = await productRepository.findById(id);
    if (!product) {
        throw new Error('Product not found');
    }
    return product;
};

export const createProduct = async (productData: CreateProductDto) => {
    return await productRepository.create(productData);
};

export const updateProduct = async (id: string, productData: UpdateProductDto) => {
    const product = await productRepository.findById(id);
    if (!product) {
        throw new Error('Product not found');
    }
    return await productRepository.update(id, productData);
};

export const deleteProduct = async (id: string) => {
    const rowCount = await productRepository.deleteById(id);
    if ((rowCount ?? 0) === 0) {
        throw new Error('Product not found or already deleted');
    }
    return { success: true };
};
