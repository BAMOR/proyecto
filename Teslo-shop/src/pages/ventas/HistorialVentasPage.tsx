import { usePedidos } from "../../hooks/ventas/usePedidos";
import { PedidosTable } from "../../components/admin/PedidosTable";

export const HistorialVentasPage = () => {
    const { data: pedidos = [], isLoading } = usePedidos();

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white">Historial de ventas</h1>
                    <p className="text-gray-400 text-sm mt-1">Todas las ventas registradas en el sistema</p>
                </div>
                {!isLoading && (
                    <div className="bg-purple-600/10 border border-purple-500/20 px-4 py-2 rounded-xl text-sm text-purple-300 font-semibold">
                        {pedidos.length} ventas
                    </div>
                )}
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <PedidosTable pedidos={pedidos} />
            )}
        </div>
    );
};
