import { NoSymbolIcon } from "@heroicons/react/24/outline";
import type { PedidoAdmin } from "../../types/dashboard";
import { Badge } from "./Badge";

const fmt = (f: string) => new Date(f).toLocaleDateString("es-GT", { day: "2-digit", month: "short", year: "numeric" });
const fmtQ = (v: number) => `Q ${Number(v).toLocaleString("es-GT", { minimumFractionDigits: 2 })}`;

interface Props {
    pedidos: PedidoAdmin[];
    onAnular?: (pedido: PedidoAdmin) => void;
}

export const PedidosTable = ({ pedidos, onAnular }: Props) => (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
            <thead>
                <tr className="text-left text-gray-500 text-xs uppercase tracking-wider border-b border-gray-800">
                    <th className="px-6 py-4">#Pedido</th>
                    <th className="px-6 py-4">Cliente</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Pago</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4">Estado pago</th>
                    <th className="px-6 py-4">Fecha</th>
                    {onAnular && <th className="px-6 py-4 text-right">Acciones</th>}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/40">
                {pedidos.map((p) => (
                    <tr key={p.id} className="text-gray-300 hover:bg-gray-800/30 transition-colors">
                        <td className="px-6 py-4 text-gray-500 font-mono text-xs">{p.numero_pedido ?? `#${p.id}`}</td>
                        <td className="px-6 py-4 font-semibold">{p.cliente}</td>
                        <td className="px-6 py-4 text-green-400 font-bold">{fmtQ(p.total)}</td>
                        <td className="px-6 py-4 text-gray-400 capitalize">{p.metodo_pago ?? "—"}</td>
                        <td className="px-6 py-4"><Badge texto={p.estado} /></td>
                        <td className="px-6 py-4"><Badge texto={p.estado_pago} /></td>
                        <td className="px-6 py-4 text-gray-500">{fmt(p.fecha_pedido)}</td>
                        {onAnular && (
                            <td className="px-6 py-4 text-right">
                                <button
                                    onClick={() => onAnular(p)}
                                    disabled={p.estado === "cancelado"}
                                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
                                >
                                    <NoSymbolIcon className="h-4 w-4" /> Anular
                                </button>
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
        {pedidos.length === 0 && <p className="text-center text-gray-600 py-10">No hay pedidos.</p>}
    </div>
);
