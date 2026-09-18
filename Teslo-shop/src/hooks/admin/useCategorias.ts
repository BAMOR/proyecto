import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/api";
import type { Categoria } from "../../types/dashboard";

export const useCategorias = () =>
    useQuery({
        queryKey: ["categorias"],
        queryFn: async () => {
            const { data } = await api.get<{ success: boolean; categories: Categoria[] }>("/categories");
            return data.categories;
        },
        staleTime: 5 * 60 * 1000,
    });
