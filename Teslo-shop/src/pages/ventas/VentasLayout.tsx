import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import {
    BoltIcon,
    ClockIcon,
    PlusCircleIcon,
    ArrowRightStartOnRectangleIcon,
    Squares2X2Icon,
    SunIcon,
    MoonIcon,
} from "@heroicons/react/24/outline";

export const VentasLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <div className={`${theme === "dark" ? "dark" : ""} min-h-screen bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-white`}>
            <header className="bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-800/60 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-600/30">
                                <BoltIcon className="w-5 h-5 text-slate-900 dark:text-white" />
                            </div>
                            <span className="font-black tracking-tight">
                                SIGEV <span className="text-blue-500">ICE S.A.</span>
                            </span>
                        </div>
                        <nav className="hidden sm:flex items-center gap-1">
                            <NavLink
                                to="/ventas"
                                end
                                className={({ isActive }) =>
                                    `px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                                        isActive ? "bg-blue-600/20 text-blue-700 dark:text-blue-300" : "text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200"
                                    }`
                                }
                            >
                                <PlusCircleIcon className="w-4 h-4" /> Nueva venta
                            </NavLink>
                            <NavLink
                                to="/ventas/historial"
                                className={({ isActive }) =>
                                    `px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                                        isActive ? "bg-blue-600/20 text-blue-700 dark:text-blue-300" : "text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200"
                                    }`
                                }
                            >
                                <ClockIcon className="w-4 h-4" /> Historial
                            </NavLink>
                            {user?.rol === "admin" && (
                                <NavLink
                                    to="/admin"
                                    className="px-3 py-2 rounded-lg text-sm font-medium text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200 transition-all flex items-center gap-1.5"
                                >
                                    <Squares2X2Icon className="w-4 h-4" /> Panel admin
                                </NavLink>
                            )}
                        </nav>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="hidden sm:block text-sm text-slate-500 dark:text-gray-400">
                            Hola, <span className="font-semibold text-slate-800 dark:text-gray-200">{user?.nombre}</span>
                        </span>
                        <button
                            onClick={toggleTheme}
                            title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                            className="p-1.5 rounded-lg text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800/60 hover:text-slate-700 dark:hover:text-gray-200 transition-colors"
                        >
                            {theme === "dark" ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-500 dark:text-gray-400 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/10 rounded-lg transition-all"
                        >
                            <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
                            <span className="hidden sm:block">Salir</span>
                        </button>
                    </div>
                </div>
            </header>

            <AnimatePresence mode="wait">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                >
                    <Outlet />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
