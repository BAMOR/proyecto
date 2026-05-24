// src/services/searchProduct.ts
import { api } from "../api/api";
import type { ProductosResponse } from "../types/products";

export const searchProduct = async (query: string): Promise<ProductosResponse> => {
    // Si la base URL ya tiene /api, deja solo /productos/buscar
    // Si NO tiene /api, pon /api/productos/buscar
    const { data } = await api.get<ProductosResponse>("/productos/buscar", {
        params: { q: query } 
    });
    return data;
};