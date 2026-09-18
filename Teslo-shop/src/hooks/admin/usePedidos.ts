import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/api";
import type { PedidoAdmin } from "../../types/dashboard";

const QUERY_KEY = ["admin", "pedidos"]

export const usePedidosAdmin = () =>
    useQuery({
        queryKey: QUERY_KEY,
        queryFn: async () => {
            const { data } = await api.get<{ success: boolean; pedidos: PedidoAdmin[] }>("/dashboard/pedidos");
            return data.pedidos;
        },
    });

export const useAnularPedido = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => api.patch(`/pedidos/${id}/anular`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: ["admin", "productos"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
        },
    });
};
