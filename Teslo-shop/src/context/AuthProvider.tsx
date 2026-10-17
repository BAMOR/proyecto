// src/context/AuthProvider.tsx
import { useState } from "react";
import type { ReactNode } from "react";
import type { Usuario, LoginResponse } from "../types/auth";
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

    // El token para cada petición lo lee un interceptor de axios directo de
    // localStorage (ver api/api.ts), así que no hace falta sincronizarlo aquí.

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
