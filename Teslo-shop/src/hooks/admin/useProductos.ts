import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/api";
import type { FormProducto, ProductoAdmin } from "../../types/dashboard";

const QUERY_KEY = ["admin", "productos"];

export const useProductosAdmin = () =>
    useQuery({
        queryKey: QUERY_KEY,
        queryFn: async () => {
            const { data } = await api.get<{ success: boolean; productos: ProductoAdmin[] }>("/dashboard/productos");
            return data.productos;
        },
    });

const buildPayload = (form: FormProducto) => ({
    categoria_id: form.categoria_id ? Number(form.categoria_id) : null,
    nombre: form.nombre,
    descripcion: form.descripcion,
    precio: Number(form.precio),
    stock: Number(form.stock),
    sku: form.sku,
    estado: form.estado,
    imagen_url: form.imagen_url || null,
});

export const useCrearProducto = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (form: FormProducto) => api.post("/productos", buildPayload(form)),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
    });
};

export const useActualizarProducto = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, form }: { id: number; form: FormProducto }) => api.put(`/productos/${id}`, buildPayload(form)),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
    });
};

export const useEliminarProducto = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => api.delete(`/productos/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
    });
};
