import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/api";
import type { FormUsuario, UsuarioAdmin } from "../../types/dashboard";

const QUERY_KEY = ["admin", "usuarios"];

export const useUsuarios = () =>
    useQuery({
        queryKey: QUERY_KEY,
        queryFn: async () => {
            const { data } = await api.get<{ success: boolean; usuarios: UsuarioAdmin[] }>("/dashboard/usuarios");
            return data.usuarios;
        },
    });

const buildPayload = (form: FormUsuario) => ({
    nombre: form.nombre,
    email: form.email,
    rol: form.rol,
    estado: form.estado,
    ...(form.password ? { password: form.password } : {}),
});

export const useCrearUsuario = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (form: FormUsuario) => api.post("/usuarios", buildPayload(form)),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
    });
};

export const useActualizarUsuario = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, form }: { id: number; form: FormUsuario }) => api.put(`/usuarios/${id}`, buildPayload(form)),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
    });
};

export const useEliminarUsuario = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => api.delete(`/usuarios/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
    });
};
