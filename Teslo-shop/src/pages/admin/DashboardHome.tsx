import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import {
    UsersIcon,
    ShoppingBagIcon,
    ShoppingCartIcon,
    BanknotesIcon,
    CalendarDaysIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../hooks/useAuth";
import { useDashboardStats } from "../../hooks/admin/useDashboardStats";
import { usePedidosAdmin } from "../../hooks/admin/usePedidos";
import { useProductosAdmin } from "../../hooks/admin/useProductos";
import { StatCard } from "../../components/admin/StatCard";

const fmtQ = (v: number) => `Q ${Number(v).toLocaleString("es-GT", { minimumFractionDigits: 2 })}`;

const PIE_COLORS = ["#3b82f6", "#a855f7", "#22c55e", "#f97316", "#ef4444", "#eab308"];

export const DashboardHome = () => {
    const { user } = useAuth();
    const { data: stats, isLoading: loadingStats } = useDashboardStats();
    const { data: pedidos } = usePedidosAdmin();
    const { data: productos } = useProductosAdmin();

    const pedidosPorEstado = useMemo(() => {
        if (!pedidos) return [];
        const conteo = pedidos.reduce<Record<string, number>>((acc, p) => {
            acc[p.estado] = (acc[p.estado] ?? 0) + 1;
            return acc;
        }, {});
        return Object.entries(conteo).map(([estado, total]) => ({ estado, total }));
    }, [pedidos]);

    const stockChart = useMemo(() => {
        if (!productos) return [];
        const bajo = productos.filter((p) => p.stock <= 5).length;
        const normal = productos.length - bajo;
        return [
            { nombre: "Stock bajo (≤5)", cantidad: bajo },
            { nombre: "Stock normal", cantidad: normal },
        ];
    }, [productos]);

    return (
        <>
            <div>
                <h1 className="text-3xl font-black">Dashboard</h1>
                <p className="text-gray-400 text-sm mt-1">
                    Bienvenido, <span className="text-white font-semibold">{user?.nombre}</span>
                </p>
            </div>

            {loadingStats || !stats ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                        <StatCard index={0} label="Usuarios" value={stats.totalUsuarios} icon={UsersIcon} color="blue" />
                        <StatCard index={1} label="Productos activos" value={stats.totalProductos} icon={ShoppingBagIcon} color="green" />
                        <StatCard index={2} label="Pedidos totales" value={stats.totalPedidos} icon={ShoppingCartIcon} color="purple" />
                        <StatCard index={3} label="Ingresos totales" value={fmtQ(stats.ingresoTotal)} icon={BanknotesIcon} color="orange" />
                        <StatCard index={4} label="Pedidos hoy" value={stats.pedidosHoy} icon={CalendarDaysIcon} color="blue" />
                        <StatCard index={5} label="Stock bajo/agotado" value={stats.stockBajo} icon={ExclamationTriangleIcon} color="orange" />
                    </div>

                    <div className="grid lg:grid-cols-2 gap-4">
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                            <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">Pedidos por estado</h2>
                            {pedidosPorEstado.length === 0 ? (
                                <p className="text-gray-600 text-sm py-10 text-center">Sin datos aún.</p>
                            ) : (
                                <ResponsiveContainer width="100%" height={260}>
                                    <PieChart>
                                        <Pie
                                            data={pedidosPorEstado}
                                            dataKey="total"
                                            nameKey="estado"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={3}
                                        >
                                            {pedidosPorEstado.map((entry, i) => (
                                                <Cell key={entry.estado} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 12 }}
                                            labelStyle={{ color: "#e5e7eb", textTransform: "capitalize" }}
                                        />
                                        <Legend wrapperStyle={{ fontSize: 12, textTransform: "capitalize" }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                            <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">Inventario</h2>
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={stockChart}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                                    <XAxis dataKey="nombre" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={{ stroke: "#1f2937" }} tickLine={false} />
                                    <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                                    <Tooltip
                                        contentStyle={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 12 }}
                                        labelStyle={{ color: "#e5e7eb" }}
                                        cursor={{ fill: "rgba(59,130,246,0.08)" }}
                                    />
                                    <Bar dataKey="cantidad" radius={[8, 8, 0, 0]}>
                                        <Cell fill="#f97316" />
                                        <Cell fill="#3b82f6" />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { label: "Ver usuarios", to: "/admin/usuarios", icon: UsersIcon, color: "text-blue-400" },
                            { label: "Ver productos", to: "/admin/productos", icon: ShoppingBagIcon, color: "text-green-400" },
                            { label: "Ver pedidos", to: "/admin/pedidos", icon: ShoppingCartIcon, color: "text-purple-400" },
                        ].map((a) => (
                            <Link
                                key={a.label}
                                to={a.to}
                                className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl p-5 flex items-center gap-3 transition-all hover:bg-gray-800/50"
                            >
                                <a.icon className={`h-6 w-6 ${a.color}`} />
                                <span className={`font-semibold text-sm ${a.color}`}>{a.label}</span>
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </>
    );
};
