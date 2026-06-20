// src/router/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
    allowedRoles?: string[]; // 👈 prop nueva, opcional
}

export const ProtectedRoute = ({ allowedRoles }: Props) => {
    const { isAuthenticated, loading, user } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // 1. Si no está autenticado → al login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 2. Si hay roles requeridos y el usuario no tiene el rol → lo manda a su home
    if (allowedRoles && !allowedRoles.includes(user?.rol ?? "")) {
        return <Navigate to="/" replace />;
    }

    // 3. Todo OK → renderiza la ruta
    return <Outlet />;
};