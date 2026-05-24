import { Link } from "react-router"; 
import { useCart } from "../hooks/useCart";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

export const Header = () => {
    // 1. Extraemos el estado del carrito usando tu hook
    const { state } = useCart();
    
    // 2. Calculamos el total de productos (sumando las cantidades)
    const totalItems = state.cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
                
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-3 transition-transform shadow-lg shadow-blue-100">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <span className="text-xl font-black tracking-tight text-gray-900">
                        Tech<span className="text-blue-600">Store</span>
                    </span>
                </Link>

                
                <Link to="/cart" className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <ShoppingCartIcon className="w-7 h-7" />
                    
                    
                    {totalItems > 0 && (
                        <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                            {totalItems}
                        </span>
                    )}
                </Link>
            </div>
        </header>
    );
};