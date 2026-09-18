import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/api";
import type { CrearVentaPayload, CrearVentaResponse } from "../../types/ventas";

export const useCrearVenta = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: CrearVentaPayload) => {
            const { data } = await api.post<CrearVentaResponse>("/pedidos", payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pedidos"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "pedidos"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "productos"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
        },
    });
};
