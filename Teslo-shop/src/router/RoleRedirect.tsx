import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Punto de entrada tras el login: cada rol de staff va a su área correspondiente.
export const RoleRedirect = () => {
    const { user } = useAuth();

    if (user?.rol === "admin") return <Navigate to="/admin" replace />;
    return <Navigate to="/ventas" replace />;
};
