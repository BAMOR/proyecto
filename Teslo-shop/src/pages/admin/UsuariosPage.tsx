import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../hooks/useAuth";
import { useUsuarios, useEliminarUsuario } from "../../hooks/admin/useUsuarios";
import { UsuariosTable } from "../../components/admin/UsuariosTable";
import { UsuarioFormModal } from "../../components/admin/modals/UsuarioFormModal";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { useToast } from "../../hooks/useToast";
import type { UsuarioAdmin } from "../../types/dashboard";

export const UsuariosPage = () => {
    const { user } = useAuth();
    const { data: usuarios = [], isLoading } = useUsuarios();
    const eliminar = useEliminarUsuario();
    const { notify } = useToast();

    const [modalAbierto, setModalAbierto] = useState(false);
    const [usuarioEditar, setUsuarioEditar] = useState<UsuarioAdmin | null>(null);
    const [usuarioEliminar, setUsuarioEliminar] = useState<UsuarioAdmin | null>(null);

    const abrirAgregar = () => {
        setUsuarioEditar(null);
        setModalAbierto(true);
    };

    const abrirEditar = (usuario: UsuarioAdmin) => {
        setUsuarioEditar(usuario);
        setModalAbierto(true);
    };

    const confirmarEliminar = async () => {
        if (!usuarioEliminar) return;
        try {
            await eliminar.mutateAsync(usuarioEliminar.id);
            notify("Usuario eliminado correctamente.", "success");
        } catch {
            notify("Error al eliminar el usuario.", "error");
        } finally {
            setUsuarioEliminar(null);
        }
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black">Usuarios</h1>
                    <p className="text-gray-400 text-sm mt-1">Gestión de todos los usuarios del sistema</p>
                </div>
                <div className="flex items-center gap-3">
                    {!isLoading && (
                        <div className="bg-blue-600/10 border border-blue-500/20 px-4 py-2 rounded-xl text-sm text-blue-300 font-semibold">
                            {usuarios.length} registrados
                        </div>
                    )}
                    <button
                        onClick={abrirAgregar}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20"
                    >
                        <PlusIcon className="h-4 w-4" /> Agregar usuario
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <UsuariosTable
                    usuarios={usuarios}
                    currentUserId={user?.id}
                    onEditar={abrirEditar}
                    onEliminar={setUsuarioEliminar}
                />
            )}

            <UsuarioFormModal open={modalAbierto} usuario={usuarioEditar} onClose={() => setModalAbierto(false)} />

            <ConfirmDialog
                open={Boolean(usuarioEliminar)}
                title="¿Eliminar usuario?"
                description={`Se eliminará a "${usuarioEliminar?.nombre}" permanentemente. Esta acción no se puede deshacer.`}
                confirmLabel="Eliminar"
                onConfirm={confirmarEliminar}
                onCancel={() => setUsuarioEliminar(null)}
            />
        </>
    );
};
