// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/api";
import type { LoginResponse } from "../types/auth";

export const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    // 🔄 Estado para controlar si muestra Login o Registro
    const [isRegisterMode, setIsRegisterMode] = useState(false);

    // 📝 Estados del Formulario
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Limpiar alertas al cambiar de modo
    const toggleMode = () => {
        setIsRegisterMode(!isRegisterMode);
        setError(null);
        setSuccessMessage(null);
        setNombre("");
        setEmail("");
        setPassword("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setIsLoading(true);

        try {
            if (isRegisterMode) {
                // 📝 FLUJO DE REGISTRO
                // Forzamos que por defecto vaya con el rol de "cliente"
                const { data } = await api.post("/auth/register", { 
                    nombre, 
                    email, 
                    password, 
                    rol: "cliente" 
                });

                if (data.success) {
                    setSuccessMessage("¡Cuenta creada exitosamente! Ya puedes iniciar sesión.");
                    setIsRegisterMode(false); // Lo pasamos al login para que entre directo
                    setPassword(""); // Limpiamos clave por seguridad
                }
            } else {
                // 🔑 FLUJO DE INICIO DE SESIÓN
                const { data } = await api.post<LoginResponse>("/auth/login", { email, password });
                
if (data.success) {
    login(data);
    const rol = data.usuario.rol;
    if (rol === "admin") {
        navigate("/admin/dashboard", { replace: true }); // 👑 Admin → Dashboard
    } else {
        navigate("/", { replace: true }); // 🛒 Cliente → Tienda
    }
}
            }
        } catch (err: any) {
            console.error(err);
            setError(
                err.response?.data?.error || "Ocurrió un error en el servidor. Inténtalo de nuevo."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto w-full max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
                    {isRegisterMode ? "Crea una cuenta nueva" : "Inicia sesión en tu cuenta"}
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    {isRegisterMode 
                        ? "Regístrate para gestionar tus compras de inmediato" 
                        : "Ingresa tus credenciales para acceder al sistema"
                    }
                </p>
            </div>

            <div className="mt-8 sm:mx-auto w-full max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl border border-slate-100 rounded-xl sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        
                        {/* 🚨 Alerta de Error */}
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                                <p className="text-sm text-red-700 font-medium">{error}</p>
                            </div>
                        )}

                        {/* 🎉 Alerta de Éxito */}
                        {successMessage && (
                            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
                                <p className="text-sm text-green-700 font-medium">{successMessage}</p>
                            </div>
                        )}

                        {/* 👤 Campo Nombre (Solo visible en Registro) */}
                        {isRegisterMode && (
                            <div>
                                <label htmlFor="nombre" className="block text-sm font-semibold text-slate-700">
                                    Nombre Completo
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="nombre"
                                        type="text"
                                        required
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                                        placeholder="Tu nombre y apellido"
                                    />
                                </div>
                            </div>
                        )}

                        {/* 📧 Campo Correo */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                                Correo Electrónico
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                                    placeholder="ejemplo@correo.com"
                                />
                            </div>
                        </div>

                        {/* 🔒 Campo Contraseña */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                                Contraseña
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* 🔘 Botón Principal Accionable */}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : isRegisterMode ? (
                                    "Registrarse"
                                ) : (
                                    "Ingresar"
                                )}
                            </button>
                        </div>
                    </form>

                    {/* 🔄 Selector de intercambio Login / Registro */}
                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={toggleMode}
                            className="text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none transition-colors"
                        >
                            {isRegisterMode 
                                ? "¿Ya tienes una cuenta? Inicia sesión aquí" 
                                : "¿No tienes cuenta? Regístrate gratis"
                            }
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};