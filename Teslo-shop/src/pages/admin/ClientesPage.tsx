import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useClientes, useEliminarCliente } from "../../hooks/ventas/useClientes";
import { ClientesTable } from "../../components/admin/ClientesTable";
import { ClienteFormModal } from "../../components/admin/modals/ClienteFormModal";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { useToast } from "../../hooks/useToast";
import type { Cliente } from "../../types/ventas";

export const ClientesPage = () => {
    const { data: clientes = [], isLoading } = useClientes();
    const eliminar = useEliminarCliente();
    const { notify } = useToast();

    const [modalAbierto, setModalAbierto] = useState(false);
    const [clienteEliminar, setClienteEliminar] = useState<Cliente | null>(null);

    const confirmarEliminar = async () => {
        if (!clienteEliminar) return;
        try {
            await eliminar.mutateAsync(clienteEliminar.id);
            notify("Cliente eliminado correctamente.", "success");
        } catch {
            notify("Error al eliminar el cliente.", "error");
        } finally {
            setClienteEliminar(null);
        }
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black">Clientes</h1>
                    <p className="text-gray-400 text-sm mt-1">Base de clientes de ICE S.A.</p>
                </div>
                <div className="flex items-center gap-3">
                    {!isLoading && (
                        <div className="bg-blue-600/10 border border-blue-500/20 px-4 py-2 rounded-xl text-sm text-blue-300 font-semibold">
                            {clientes.length} registrados
                        </div>
                    )}
                    <button
                        onClick={() => setModalAbierto(true)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20"
                    >
                        <PlusIcon className="h-4 w-4" /> Agregar cliente
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <ClientesTable clientes={clientes} onEliminar={setClienteEliminar} />
            )}

            <ClienteFormModal open={modalAbierto} onClose={() => setModalAbierto(false)} />

            <ConfirmDialog
                open={Boolean(clienteEliminar)}
                title="¿Eliminar cliente?"
                description={`Se eliminará a "${clienteEliminar?.nombre}" permanentemente.`}
                confirmLabel="Eliminar"
                onConfirm={confirmarEliminar}
                onCancel={() => setClienteEliminar(null)}
            />
        </>
    );
};
