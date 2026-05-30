import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
    allowedRoles?: string[]; // 👈 opcional, si no se pasa = cualquier usuario autenticado
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

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Si hay roles requeridos y el usuario no los tiene → lo manda a su home
    if (allowedRoles && !allowedRoles.includes(user!.rol)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};