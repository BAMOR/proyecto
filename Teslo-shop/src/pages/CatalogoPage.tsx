import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BoltIcon, MagnifyingGlassIcon, ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline";
import { getProduct } from "../services/getProduct";

export const CatalogoPage = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["catalogo-publico"],
        queryFn: () => getProduct(),
        staleTime: 5 * 60 * 1000,
    });
    const [busqueda, setBusqueda] = useState("");

    const productos = useMemo(() => {
        const lista = data?.productos ?? [];
        const termino = busqueda.trim().toLowerCase();
        if (!termino) return lista;
        return lista.filter((p) => p.nombre.toLowerCase().includes(termino));
    }, [data, busqueda]);

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg">
                            <BoltIcon className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-black tracking-tight text-slate-900">
                            SIGEV <span className="text-blue-600">ICE S.A.</span>
                        </span>
                    </div>
                    <Link
                        to="/login"
                        className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                    >
                        <ArrowRightEndOnRectangleIcon className="w-4 h-4" />
                        Iniciar sesión
                    </Link>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-slate-900">Catálogo de productos</h1>
                    <p className="text-slate-500 mt-1">Consulta la disponibilidad de nuestros productos</p>
                </div>

                <div className="relative max-w-md mx-auto mb-10">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Buscar producto..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 placeholder-slate-400 shadow-sm transition-all"
                    />
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {productos.map((p, index) => (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: Math.min(index, 8) * 0.03 }}
                                className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col"
                            >
                                <div className="w-full overflow-hidden bg-slate-100 h-48 relative">
                                    <img
                                        src={p.imagen_url || "https://via.placeholder.com/400"}
                                        alt={p.nombre}
                                        className="h-full w-full object-cover object-center"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span
                                            className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold ${
                                                p.estado === "disponible" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {p.estado === "disponible" ? "Disponible" : "Agotado"}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col flex-grow">
                                    <h3 className="text-xs text-slate-400 font-medium uppercase tracking-widest">{p.sku}</h3>
                                    <h2 className="text-base font-bold text-slate-900 mt-0.5">{p.nombre}</h2>
                                    <p className="text-slate-500 text-sm line-clamp-2 mt-1 flex-grow">{p.descripcion}</p>
                                    <p className="text-xl font-extrabold text-blue-600 mt-3">Q {Number(p.precio).toFixed(2)}</p>
                                </div>
                            </motion.div>
                        ))}
                        {productos.length === 0 && (
                            <p className="col-span-full text-center text-slate-500 py-10">No se encontraron productos.</p>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};
