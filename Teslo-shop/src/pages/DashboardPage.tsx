// src/pages/DashboardPage.tsx
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const DashboardPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center gap-6">
            <h1 className="text-4xl font-bold text-slate-800">Panel de Administración</h1>
            <p className="text-slate-500">Bienvenido, <span className="font-semibold">{user?.nombre}</span> 👑</p>
            <p className="text-sm text-slate-400">Aquí irá el dashboard completo</p>
            <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
                Cerrar sesión
            </button>
        </div>
    );
};