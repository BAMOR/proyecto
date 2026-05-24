// src/types/auth.ts
export interface Usuario {
    id: number;
    nombre: string;
    email: string;
    rol: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    token: string;
    usuario: Usuario;
}