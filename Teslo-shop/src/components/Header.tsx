import { Link, useNavigate } from "react-router-dom"; // 👈 agrega useNavigate
import { useCart } from "../hooks/useCart";
import { useAuth } from "../context/AuthContext"; // 👈 agrega esto
import { ShoppingCartIcon, ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline"; // 👈 agrega el icono

export const Header = () => {
    const { state } = useCart();
    const { user, logout } = useAuth(); // 👈 agrega esto
    const navigate = useNavigate();    // 👈 agrega esto
    
    const totalItems = state.cart.reduce((total, item) => total + item.quantity, 0);

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

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

                {/* Lado derecho */}
                <div className="flex items-center gap-3">
                    
                    {/* Nombre del usuario */}
                    <span className="hidden sm:block text-sm text-gray-500">
                        Hola, <span className="font-semibold text-gray-800">{user?.nombre}</span>
                    </span>

                    {/* Carrito */}
                    <Link to="/cart" className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
                        <ShoppingCartIcon className="w-7 h-7" />
                        {totalItems > 0 && (
                            <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    {/* Botón Logout */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Cerrar sesión"
                    >
                        <ArrowRightEndOnRectangleIcon className="w-5 h-5" />
                        <span className="hidden sm:block">Salir</span>
                    </button>
                </div>
            </div>
        </header>
    );
};