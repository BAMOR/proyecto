import { useMemo, useState } from "react";
import { MagnifyingGlassIcon, PlusIcon, UserIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useClientes } from "../../hooks/ventas/useClientes";
import { usePedidos } from "../../hooks/ventas/usePedidos";
import { ClienteFormModal } from "../admin/modals/ClienteFormModal";
import type { Cliente } from "../../types/ventas";

interface Props {
    value: Cliente | null;
    onChange: (cliente: Cliente | null) => void;
}

export const ClientePicker = ({ value, onChange }: Props) => {
    const { data: clientes = [] } = useClientes();
    const { data: historial = [] } = usePedidos(value?.id);
    const [busqueda, setBusqueda] = useState("");
    const [modalAbierto, setModalAbierto] = useState(false);

    const resultados = useMemo(() => {
        const termino = busqueda.trim().toLowerCase();
        if (termino.length < 2) return [];
        return clientes
            .filter((c) => c.nombre.toLowerCase().includes(termino) || c.email.toLowerCase().includes(termino))
            .slice(0, 8);
    }, [clientes, busqueda]);

    if (value) {
        return (
            <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-500/10 text-blue-400 rounded-full p-2">
                            <UserIcon className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="font-semibold text-white">{value.nombre}</p>
                            <p className="text-xs text-gray-400">{value.email}</p>
                            {value.telefono && <p className="text-xs text-gray-500">{value.telefono}</p>}
                        </div>
                    </div>
                    <button onClick={() => onChange(null)} className="text-gray-500 hover:text-white transition-colors">
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>
                {historial.length > 0 && (
                    <div className="border-t border-gray-700 pt-3">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">
                            Compras anteriores ({historial.length})
                        </p>
                        <ul className="space-y-1 max-h-24 overflow-y-auto">
                            {historial.slice(0, 5).map((p) => (
                                <li key={p.id} className="text-xs text-gray-400 flex justify-between">
                                    <span className="font-mono">{p.numero_pedido}</span>
                                    <span className="text-green-400 font-semibold">Q {Number(p.total).toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar cliente por nombre o email..."
                    className="w-full bg-gray-800/60 border border-gray-700 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
            </div>

            {resultados.length > 0 && (
                <div className="bg-gray-800/60 border border-gray-700 rounded-xl overflow-hidden divide-y divide-gray-700/60">
                    {resultados.map((c) => (
                        <button
                            key={c.id}
                            onClick={() => {
                                onChange(c);
                                setBusqueda("");
                            }}
                            className="w-full text-left px-4 py-2.5 hover:bg-gray-700/50 transition-colors flex flex-col"
                        >
                            <span className="text-sm font-semibold text-white">{c.nombre}</span>
                            <span className="text-xs text-gray-500">{c.email}</span>
                        </button>
                    ))}
                </div>
            )}

            {busqueda.trim().length >= 2 && resultados.length === 0 && (
                <p className="text-xs text-gray-500">No se encontró ningún cliente con ese nombre o email.</p>
            )}

            <button
                onClick={() => setModalAbierto(true)}
                className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1.5"
            >
                <PlusIcon className="h-4 w-4" /> Registrar cliente nuevo
            </button>

            <ClienteFormModal
                open={modalAbierto}
                onClose={() => setModalAbierto(false)}
                onCreado={(cliente) => onChange(cliente)}
            />
        </div>
    );
};
