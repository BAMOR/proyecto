import { useState } from "react";
import { usePedidosAdmin, useAnularPedido } from "../../hooks/admin/usePedidos";
import { PedidosTable } from "../../components/admin/PedidosTable";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { useToast } from "../../hooks/useToast";
import type { PedidoAdmin } from "../../types/dashboard";

export const PedidosPage = () => {
    const { data: pedidos = [], isLoading } = usePedidosAdmin();
    const anular = useAnularPedido();
    const { notify } = useToast();
    const [pedidoAnular, setPedidoAnular] = useState<PedidoAdmin | null>(null);

    const confirmarAnular = async () => {
        if (!pedidoAnular) return;
        try {
            await anular.mutateAsync(pedidoAnular.id);
            notify("Pedido anulado, stock restaurado.", "success");
        } catch {
            notify("Error al anular el pedido.", "error");
        } finally {
            setPedidoAnular(null);
        }
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black">Pedidos</h1>
                    <p className="text-gray-400 text-sm mt-1">Historial completo de órdenes</p>
                </div>
                {!isLoading && (
                    <div className="bg-purple-600/10 border border-purple-500/20 px-4 py-2 rounded-xl text-sm text-purple-300 font-semibold">
                        {pedidos.length} pedidos
                    </div>
                )}
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <PedidosTable pedidos={pedidos} onAnular={setPedidoAnular} />
            )}

            <ConfirmDialog
                open={Boolean(pedidoAnular)}
                title="¿Anular este pedido?"
                description={`Se restaurará el stock de los productos de "${pedidoAnular?.numero_pedido}" y quedará marcado como cancelado.`}
                confirmLabel="Anular"
                onConfirm={confirmarAnular}
                onCancel={() => setPedidoAnular(null)}
            />
        </>
    );
};
