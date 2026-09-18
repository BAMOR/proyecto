import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/api";
import type { PedidoAdmin } from "../../types/dashboard";

export const usePedidos = (clienteId?: number) =>
    useQuery({
        queryKey: ["pedidos", clienteId ?? "todos"],
        queryFn: async () => {
            const { data } = await api.get<{ success: boolean; pedidos: PedidoAdmin[] }>("/pedidos", {
                params: clienteId ? { cliente_id: clienteId } : undefined,
            });
            return data.pedidos;
        },
        enabled: clienteId === undefined || clienteId > 0,
    });
