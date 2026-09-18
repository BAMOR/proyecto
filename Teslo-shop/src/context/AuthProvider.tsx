// src/context/AuthProvider.tsx
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Usuario, LoginResponse } from "../types/auth";
import { api } from "../api/api";
import { AuthContext } from "./AuthContext";

const leerSesionGuardada = (): { user: Usuario | null; token: string | null } => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
        return { token: storedToken, user: JSON.parse(storedUser) as Usuario };
    }
    return { token: null, user: null };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [{ user, token }, setSesion] = useState(leerSesionGuardada);

    // Sincroniza el header de axios con el token actual (efecto legítimo: sistema externo)
    useEffect(() => {
        if (token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
            delete api.defaults.headers.common["Authorization"];
        }
    }, [token]);

    const login = (authData: LoginResponse) => {
        localStorage.setItem("token", authData.token);
        localStorage.setItem("user", JSON.stringify(authData.usuario));
        setSesion({ token: authData.token, user: authData.usuario });
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setSesion({ token: null, user: null });
    };

    return (
        <AuthContext.Provider value={{ user, token, loading: false, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};
