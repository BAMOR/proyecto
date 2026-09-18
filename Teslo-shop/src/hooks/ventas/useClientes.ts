import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/api";
import type { ClientesResponse, Cliente, FormCliente } from "../../types/ventas";

const QUERY_KEY = ["clientes"];

export const useClientes = () =>
    useQuery({
        queryKey: QUERY_KEY,
        queryFn: async () => {
            const { data } = await api.get<ClientesResponse>("/clientes");
            return data.clientes;
        },
        staleTime: 60 * 1000,
    });

export const useCrearCliente = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (form: FormCliente) => {
            const { data } = await api.post<{ success: boolean; clienteId: number }>("/clientes", form);
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
    });
};

export const useEliminarCliente = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => api.delete(`/clientes/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
    });
};

export type { Cliente };
