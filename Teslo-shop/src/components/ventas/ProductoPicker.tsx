import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MagnifyingGlassIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { getProduct } from "../../services/getProduct";
import type { Producto } from "../../types/products";

interface Props {
    onAgregar: (producto: Producto) => void;
}

export const ProductoPicker = ({ onAgregar }: Props) => {
    const { data, isLoading } = useQuery({
        queryKey: ["productos"],
        queryFn: () => getProduct(),
        staleTime: 60 * 1000,
    });
    const [busqueda, setBusqueda] = useState("");

    const productos = useMemo(() => {
        const lista = data?.productos ?? [];
        const termino = busqueda.trim().toLowerCase();
        if (!termino) return lista;
        return lista.filter(
            (p) => p.nombre.toLowerCase().includes(termino) || p.sku?.toLowerCase().includes(termino)
        );
    }, [data, busqueda]);

    return (
        <div className="space-y-3">
            <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar producto por nombre o SKU..."
                    className="w-full bg-gray-800/60 border border-gray-700 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
            </div>

            {isLoading ? (
                <div className="flex justify-center py-10">
                    <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
                    {productos.map((p) => {
                        const sinStock = p.stock <= 0
                        return (
                            <button
                                key={p.id}
                                onClick={() => onAgregar(p)}
                                disabled={sinStock}
                                className="text-left bg-gray-800/60 border border-gray-700 hover:border-blue-500/60 rounded-xl p-3 transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <span className="text-sm font-semibold text-white line-clamp-2">{p.nombre}</span>
                                    <PlusCircleIcon className="h-5 w-5 text-blue-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <p className="text-xs text-gray-500 font-mono mt-1">{p.sku}</p>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-green-400 font-bold text-sm">Q {Number(p.precio).toFixed(2)}</span>
                                    <span className={`text-xs font-semibold ${sinStock ? "text-red-400" : p.stock <= 5 ? "text-yellow-400" : "text-gray-500"}`}>
                                        {sinStock ? "Sin stock" : `Stock: ${p.stock}`}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                    {productos.length === 0 && (
                        <p className="col-span-full text-center text-gray-600 py-10">No se encontraron productos.</p>
                    )}
                </div>
            )}
        </div>
    );
};
