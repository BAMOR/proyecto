import { createContext } from "react";
import type { Usuario, LoginResponse } from "../types/auth";

export interface AuthContextType {
    user: Usuario | null;
    token: string | null;
    loading: boolean;
    login: (authData: LoginResponse) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
