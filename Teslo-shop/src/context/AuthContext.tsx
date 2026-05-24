// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
// 👈 Agregamos "type" para cumplir con verbatimModuleSyntax
import type { ReactNode } from "react"; 
import type { Usuario, LoginResponse } from "../types/auth"; 
import { api } from "../api/api"; // Tu instancia de axios sigue normal porque es código ejecutable

interface AuthContextType {
    user: Usuario | null;
    token: string | null;
    loading: boolean;
    login: (authData: LoginResponse) => void;
    logout: () => void;
    isAuthenticated: boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<Usuario | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Revisar si ya había una sesión activa al cargar la app
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            
            // Inyectar el token por defecto en Axios para futuras peticiones protegidas
            api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        }
        setLoading(false);
    }, []);

    const login = (authData: LoginResponse) => {
        setToken(authData.token);
        setUser(authData.usuario);

        localStorage.setItem("token", authData.token);
        localStorage.setItem("user", JSON.stringify(authData.usuario));

        // Pegar el token en Axios automáticamente
        api.defaults.headers.common["Authorization"] = `Bearer ${authData.token}`;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete api.defaults.headers.common["Authorization"];
    };

    // 👈 2. REMOVEMOS EL "if (loading) return null;" de aquí.
    // Dejamos que el árbol de componentes se renderice normalmente para que React Router tome el control.

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
    return context;
};