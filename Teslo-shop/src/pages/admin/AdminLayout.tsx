import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import {
    Squares2X2Icon,
    UsersIcon,
    UserGroupIcon,
    ShoppingBagIcon,
    ClipboardDocumentListIcon,
    PlusCircleIcon,
    ArrowRightStartOnRectangleIcon,
    BoltIcon,
    SunIcon,
    MoonIcon,
} from "@heroicons/react/24/outline";
import { useLocation } from "react-router-dom";

const MENU = [
    { to: "/admin", label: "Dashboard", icon: Squares2X2Icon, end: true },
    { to: "/admin/usuarios", label: "Usuarios", icon: UsersIcon },
    { to: "/admin/clientes", label: "Clientes", icon: UserGroupIcon },
    { to: "/admin/productos", label: "Productos", icon: ShoppingBagIcon },
    { to: "/admin/pedidos", label: "Pedidos", icon: ClipboardDocumentListIcon },
];

export const AdminLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <div className={`${theme === "dark" ? "dark" : ""} flex h-screen bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-white overflow-hidden font-sans`}>
            <aside className="w-64 bg-white dark:bg-gray-900 border-r border-slate-200 dark:border-gray-800/60 flex flex-col justify-between p-5 shrink-0">
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-600/30">
                                <BoltIcon className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-black tracking-tight">
                                SIGEV <span className="text-blue-500">ICE</span>
                            </span>
                        </div>
                        <button
                            onClick={toggleTheme}
                            title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                            className="p-1.5 rounded-lg text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800/60 hover:text-slate-700 dark:hover:text-gray-200 transition-colors"
                        >
                            {theme === "dark" ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                        </button>
                    </div>
                    <div className="bg-purple-100 dark:bg-purple-500/10 border border-purple-300 dark:border-purple-500/20 rounded-xl px-3 py-2 text-center">
                        <p className="text-xs text-purple-700 dark:text-purple-300 font-bold uppercase tracking-widest">Admin Panel</p>
                    </div>
                    <nav className="space-y-1">
                        {MENU.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                className={({ isActive }) =>
                                    `w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
                                        isActive
                                            ? "bg-blue-600/20 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-500/20"
                                            : "text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800/60 hover:text-slate-700 dark:hover:text-gray-200"
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </NavLink>
                        ))}
                        <NavLink
                            to="/ventas"
                            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-3 text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800/60 hover:text-slate-700 dark:hover:text-gray-200 border-t border-slate-200 dark:border-gray-800 mt-2 pt-4"
                        >
                            <PlusCircleIcon className="w-5 h-5" />
                            Nueva venta
                        </NavLink>
                    </nav>
                </div>
                <div className="border-t border-slate-200 dark:border-gray-800 pt-4 space-y-1">
                    <p className="text-sm font-semibold text-slate-800 dark:text-gray-200 px-2 truncate">{user?.nombre}</p>
                    <p className="text-xs text-purple-700 dark:text-purple-400 px-2 font-bold uppercase tracking-widest mb-3">Administrador</p>
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-100 dark:bg-red-500/10 hover:bg-red-200 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-500/20 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
                        Cerrar sesión
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto p-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18 }}
                        className="space-y-8"
                    >
                        <Outlet context={{ theme }} />
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};
