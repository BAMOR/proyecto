// src/router/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    // ⏳ Si el contexto está cargando o verificando el token en localStorage...
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // 🛡️ Si NO está autenticado, lo expulsa cambiando la URL del navegador a /login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 🔓 Si está autenticado, renderiza el MainLayout y sus rutas hijas
    return <Outlet />;
};