// src/pages/LoginPage.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BoltIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../hooks/useAuth";
import { api } from "../api/api";
import { InputField } from "../components/ui/FormField";
import type { LoginResponse } from "../types/auth";

export const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const { data } = await api.post<LoginResponse>("/auth/login", { email, password });

            if (data.success) {
                login(data);
                navigate(data.usuario.rol === "admin" ? "/admin" : "/ventas", { replace: true });
            }
        } catch (err) {
            console.error(err);
            const message =
                (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
                "Ocurrió un error en el servidor. Inténtalo de nuevo.";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="sm:mx-auto w-full max-w-md text-center"
            >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-200">
                    <BoltIcon className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    SIGEV <span className="text-blue-600">ICE S.A.</span>
                </h1>
                <p className="mt-2 text-sm text-slate-600">Sistema Integrado de Gestión de Ventas</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.05 }}
                className="mt-8 sm:mx-auto w-full max-w-md"
            >
                <div className="bg-white py-8 px-4 shadow-xl border border-slate-100 rounded-xl sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                                <p className="text-sm text-red-700 font-medium">{error}</p>
                            </div>
                        )}

                        <InputField
                            variant="light"
                            label="Correo Electrónico"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ejemplo@icesa.com"
                        />

                        <InputField
                            variant="light"
                            label="Contraseña"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                "Ingresar"
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-xs text-slate-400">
                        Acceso exclusivo para personal de ICE S.A. Si no tienes cuenta, contacta a un administrador.
                    </p>
                </div>

                <p className="mt-6 text-center text-sm">
                    <Link to="/catalogo" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                        Ver catálogo de productos
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};
