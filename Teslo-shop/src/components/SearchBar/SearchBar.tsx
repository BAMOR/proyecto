import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchProduct } from "../../services/searchProduct";
import type { Producto } from "../../types/products";

interface SearchBarProps {
    onSearchResults: (products: Producto[]) => void;
    onClear: () => void;
}

export const SearchBar = ({ onSearchResults, onClear }: SearchBarProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Usar React Query para la búsqueda
    const { data, refetch, isFetching } = useQuery({
        queryKey: ['busqueda', searchTerm],
        queryFn: () => searchProduct(searchTerm),
        enabled: false, // No se ejecuta automáticamente al montar
        staleTime: 2 * 60 * 1000
    });

    // 🔍 Lógica de Debounce (espera 500ms después de dejar de escribir)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm.trim().length >= 2) {
                refetch();
            } else if (searchTerm.trim().length === 0) {
                onClear();
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, refetch, onClear]);

    // Notificar al componente padre cuando lleguen resultados nuevos
    useEffect(() => {
        if (data?.success && data.productos) {
            onSearchResults(data.productos);
        }
    }, [data, onSearchResults]);

    const handleClear = () => {
        setSearchTerm('');
        onClear();
    };

    return (
        <div className="max-w-2xl mx-auto mb-10">
            <div className="relative">
                <svg
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>

                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar productos (ej: laptop, mouse, gamer)..."
                    className="w-full pl-12 pr-10 py-4 bg-white border border-slate-200 rounded-2xl
                    focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800
                    placeholder-slate-400 shadow-sm transition-all"
                />

                {searchTerm && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                )}

                {isFetching && (
                    <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                    </div>
                )}
            </div>

            {searchTerm && (
                <p className="text-sm text-slate-500 mt-2 text-center">
                    {isFetching ? 'Buscando...' : `${data?.productos?.length || 0} productos encontrados`}
                </p>
            )}
        </div>
    );
};