import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "../services/getProduct";
import { SearchBar } from "../components/SearchBar/SearchBar";
import { useCart } from "../hooks/useCart";
import type { Producto } from "../types/products";

export const HomePage = () => {
    const [filteredProducts, setFilteredProducts] = useState<Producto[]>([]);
    const { dispatch } = useCart();

    // 1. Cargar productos iniciales
    const { data, isLoading } = useQuery({
        queryKey: ['productos'],
        queryFn: () => getProduct(),
        staleTime: 5 * 60 * 1000
    });

    // 2. Sincronizar productos cuando la data inicial llega
    useEffect(() => {
        if (data?.productos) {
            setFilteredProducts(data.productos);
        }
    }, [data]);

    const handleSearchResults = (products: Producto[]) => {
        setFilteredProducts(products);
    };

    const handleClear = () => {
        if (data?.productos) {
            setFilteredProducts(data.productos);
        }
    };

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <SearchBar onSearchResults={handleSearchResults} onClear={handleClear} />

            <div className="max-w-7xl mx-auto mb-6 text-center">
                <p className="text-slate-600 font-medium">
                    Mostrando {filteredProducts.length} productos
                </p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((producto) => (
                    <div key={producto.id} className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col">
                        <div className="w-full overflow-hidden bg-gray-200 h-64 relative">
                            <img
                                // 🚩 Asegúrate que el nombre coincida con lo que devuelve el backend
                                src={producto.imagen_url || 'https://via.placeholder.com/400'}
                                alt={producto.nombre}
                                className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
                            />
                            <div className="absolute top-4 left-4">
                                <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold ${
                                    producto.estado === 'disponible' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {producto.estado}
                                </span>
                            </div>
                        </div>

                        <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-widest">{producto.sku}</h3>
                            <h2 className="text-xl font-bold text-gray-900 mb-2 truncate">{producto.nombre}</h2>
                            <p className="text-gray-600 text-sm line-clamp-2 mb-6 flex-grow">{producto.descripcion}</p>

                            <div className="flex items-center justify-between mt-auto">
                                <p className="text-2xl font-extrabold text-blue-600">Q{producto.precio}</p>
                                <button 
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                                    onClick={() => dispatch({type: 'add-to-cart', payload: {item: producto}})}
                                >
                                    Comprar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};