// src/pages/DashboardPage.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface Stats {
    totalUsuarios: number; totalProductos: number; totalPedidos: number;
    ingresoTotal: number; pedidosHoy: number; stockBajo: number;
}
interface Usuario {
    id: number; nombre: string; email: string; rol: string;
    estado: string; fecha_creacion: string; total_pedidos: number;
}
interface Producto {
    id: number; sku: string; nombre: string; descripcion: string; precio: number;
    stock: number; estado: string; categoria: string; categoria_id: number; imagen_url: string;
}
interface Pedido {
    id: number; numero_pedido: string; cliente: string; total: number;
    metodo_pago: string; estado: string; estado_pago: string; fecha_pedido: string;
}
interface Categoria { id: number; nombre: string; }

const FORM_PRODUCTO_VACIO = {
    categoria_id: "", nombre: "", descripcion: "", precio: "",
    stock: "", sku: "", estado: "disponible", imagen_url: "",
};
const FORM_USUARIO_VACIO = {
    nombre: "", email: "", password: "", rol: "cliente", estado: "activo",
};

// ─── Badge ────────────────────────────────────────────────────────────────────
const Badge = ({ texto }: { texto: string }) => {
    const e: Record<string, string> = {
        activo:      "bg-green-500/10  text-green-400  border-green-500/20",
        inactivo:    "bg-red-500/10    text-red-400    border-red-500/20",
        disponible:  "bg-blue-500/10   text-blue-400   border-blue-500/20",
        agotado:     "bg-red-500/10    text-red-400    border-red-500/20",
        pendiente:   "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        confirmado:  "bg-blue-500/10   text-blue-400   border-blue-500/20",
        enviado:     "bg-purple-500/10 text-purple-400 border-purple-500/20",
        entregado:   "bg-green-500/10  text-green-400  border-green-500/20",
        cancelado:   "bg-red-500/10    text-red-400    border-red-500/20",
        pagado:      "bg-green-500/10  text-green-400  border-green-500/20",
        reembolsado: "bg-orange-500/10 text-orange-400 border-orange-500/20",
        admin:       "bg-purple-500/10 text-purple-400 border-purple-500/20",
        vendedor:    "bg-blue-500/10   text-blue-400   border-blue-500/20",
        cliente:     "bg-gray-500/10   text-gray-400   border-gray-500/20",
    };
    return (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${e[texto] ?? "bg-gray-700 text-gray-300 border-gray-600"}`}>
            {texto}
        </span>
    );
};

const Spinner = () => (
    <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
);

const InputField = ({ label, nota, ...props }: { label: string; nota?: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            {label} {nota && <span className="text-gray-600 normal-case font-normal">{nota}</span>}
        </label>
        <input {...props} className="w-full bg-gray-800/60 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors" />
    </div>
);

const SelectField = ({ label, children, ...props }: { label: string } & React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) => (
    <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</label>
        <select {...props} className="w-full bg-gray-800/60 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors">
            {children}
        </select>
    </div>
);

const MENU = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "usuarios",  label: "Usuarios",  icon: "👥" },
    { id: "productos", label: "Productos", icon: "📦" },
    { id: "pedidos",   label: "Pedidos",   icon: "🛒" },
];

// ─── Componente principal ─────────────────────────────────────────────────────
export const DashboardPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [seccion, setSeccion] = useState("dashboard");

    // Datos
    const [stats, setStats]           = useState<Stats | null>(null);
    const [usuarios, setUsuarios]     = useState<Usuario[]>([]);
    const [productos, setProductos]   = useState<Producto[]>([]);
    const [pedidos, setPedidos]       = useState<Pedido[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);

    // Loading
    const [loadingStats, setLoadingStats]         = useState(true);
    const [loadingUsuarios, setLoadingUsuarios]   = useState(false);
    const [loadingProductos, setLoadingProductos] = useState(false);
    const [loadingPedidos, setLoadingPedidos]     = useState(false);

    // ── Modal Productos ──────────────────────────────────────────────────────
    const [modalProducto, setModalProducto]       = useState(false);
    const [modoEditarProd, setModoEditarProd]     = useState(false);
    const [prodEditId, setProdEditId]             = useState<number | null>(null);
    const [formProd, setFormProd]                 = useState(FORM_PRODUCTO_VACIO);
    const [savingProd, setSavingProd]             = useState(false);
    const [errorProd, setErrorProd]               = useState<string | null>(null);

    // ── Modal Usuarios ───────────────────────────────────────────────────────
    const [modalUsuario, setModalUsuario]         = useState(false);
    const [modoEditarUser, setModoEditarUser]     = useState(false);
    const [userEditId, setUserEditId]             = useState<number | null>(null);
    const [formUser, setFormUser]                 = useState(FORM_USUARIO_VACIO);
    const [savingUser, setSavingUser]             = useState(false);
    const [errorUser, setErrorUser]               = useState<string | null>(null);

    // Stats al montar
    useEffect(() => {
        api.get("/dashboard/stats")
            .then(res => setStats(res.data.stats))
            .catch(console.error)
            .finally(() => setLoadingStats(false));
    }, []);

    // Lazy loading por sección
    useEffect(() => {
        if (seccion === "usuarios") cargarUsuarios();
        if (seccion === "productos") {
            cargarProductos();
            if (categorias.length === 0) {
                api.get("/categories").then(res => setCategorias(res.data.categories)).catch(console.error);
            }
        }
        if (seccion === "pedidos" && pedidos.length === 0) {
            setLoadingPedidos(true);
            api.get("/dashboard/pedidos")
                .then(res => setPedidos(res.data.pedidos))
                .catch(console.error)
                .finally(() => setLoadingPedidos(false));
        }
    }, [seccion]);

    const cargarUsuarios = () => {
        setLoadingUsuarios(true);
        api.get("/dashboard/usuarios")
            .then(res => setUsuarios(res.data.usuarios))
            .catch(console.error)
            .finally(() => setLoadingUsuarios(false));
    };

    const cargarProductos = () => {
        setLoadingProductos(true);
        api.get("/dashboard/productos")
            .then(res => setProductos(res.data.productos))
            .catch(console.error)
            .finally(() => setLoadingProductos(false));
    };

    // ── CRUD Productos ───────────────────────────────────────────────────────
    const abrirModalAgregarProd = () => {
        setModoEditarProd(false); setProdEditId(null);
        setFormProd(FORM_PRODUCTO_VACIO); setErrorProd(null); setModalProducto(true);
    };
    const abrirModalEditarProd = (p: Producto) => {
        setModoEditarProd(true); setProdEditId(p.id);
        setFormProd({
            categoria_id: String(p.categoria_id ?? ""), nombre: p.nombre ?? "",
            descripcion: p.descripcion ?? "", precio: String(p.precio ?? ""),
            stock: String(p.stock ?? ""), sku: p.sku ?? "",
            estado: p.estado ?? "disponible", imagen_url: p.imagen_url ?? "",
        });
        setErrorProd(null); setModalProducto(true);
    };
    const handleGuardarProd = async () => {
        if (!formProd.nombre || !formProd.precio || !formProd.stock) {
            setErrorProd("Nombre, precio y stock son obligatorios."); return;
        }
        setSavingProd(true); setErrorProd(null);
        const payload = {
            categoria_id: formProd.categoria_id ? Number(formProd.categoria_id) : null,
            nombre: formProd.nombre, descripcion: formProd.descripcion,
            precio: Number(formProd.precio), stock: Number(formProd.stock),
            sku: formProd.sku, estado: formProd.estado,
            imagen_url: formProd.imagen_url || null,
        };
        try {
            if (modoEditarProd && prodEditId) await api.put(`/productos/${prodEditId}`, payload);
            else await api.post("/productos", payload);
            setModalProducto(false); cargarProductos();
        } catch (err: any) {
            setErrorProd(err.response?.data?.error ?? "Error al guardar.");
        } finally { setSavingProd(false); }
    };
    const handleEliminarProd = async (id: number, nombre: string) => {
        if (!confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)) return;
        try { await api.delete(`/productos/${id}`); cargarProductos(); }
        catch { alert("Error al eliminar el producto."); }
    };

    // ── CRUD Usuarios ────────────────────────────────────────────────────────
    const abrirModalAgregarUser = () => {
        setModoEditarUser(false); setUserEditId(null);
        setFormUser(FORM_USUARIO_VACIO); setErrorUser(null); setModalUsuario(true);
    };
    const abrirModalEditarUser = (u: Usuario) => {
        setModoEditarUser(true); setUserEditId(u.id);
        setFormUser({
            nombre: u.nombre ?? "", email: u.email ?? "",
            password: "", // vacío — si no escribe nueva clave, no se cambia
            rol: u.rol ?? "cliente", estado: u.estado ?? "activo",
        });
        setErrorUser(null); setModalUsuario(true);
    };
    const handleGuardarUser = async () => {
        if (!formUser.nombre || !formUser.email) {
            setErrorUser("Nombre y email son obligatorios."); return;
        }
        if (!modoEditarUser && !formUser.password) {
            setErrorUser("La contraseña es obligatoria para nuevos usuarios."); return;
        }
        setSavingUser(true); setErrorUser(null);
        const payload = {
            nombre: formUser.nombre, email: formUser.email,
            rol: formUser.rol, estado: formUser.estado,
            // Solo incluimos password si tiene valor
            ...(formUser.password ? { password: formUser.password } : {}),
        };
        try {
            if (modoEditarUser && userEditId) await api.put(`/usuarios/${userEditId}`, payload);
            else await api.post("/usuarios", payload);
            setModalUsuario(false); cargarUsuarios();
        } catch (err: any) {
            setErrorUser(err.response?.data?.error ?? "Error al guardar.");
        } finally { setSavingUser(false); }
    };
    const handleEliminarUser = async (id: number, nombre: string) => {
        if (id === user?.id) { alert("No puedes eliminar tu propio usuario."); return; }
        if (!confirm(`¿Eliminar a "${nombre}"? Esta acción no se puede deshacer.`)) return;
        try { await api.delete(`/usuarios/${id}`); cargarUsuarios(); }
        catch { alert("Error al eliminar el usuario."); }
    };

    const handleLogout = () => { logout(); navigate("/login", { replace: true }); };
    const fmt  = (f: string) => new Date(f).toLocaleDateString("es-GT", { day:"2-digit", month:"short", year:"numeric" });
    const fmtQ = (v: number) => `Q ${Number(v).toLocaleString("es-GT", { minimumFractionDigits: 2 })}`;
    const colorMap: Record<string, string> = {
        blue:   "from-blue-500/20   to-blue-600/5   border-blue-500/20",
        green:  "from-green-500/20  to-green-600/5  border-green-500/20",
        purple: "from-purple-500/20 to-purple-600/5 border-purple-500/20",
        orange: "from-orange-500/20 to-orange-600/5 border-orange-500/20",
    };

    return (
        <div className="flex h-screen bg-gray-950 text-white overflow-hidden font-sans">

            {/* ── SIDEBAR ───────────────────────────────────────────────── */}
            <aside className="w-64 bg-gray-900 border-r border-gray-800/60 flex flex-col justify-between p-5 shrink-0">
                <div className="space-y-6">
                    <div className="flex items-center gap-2 px-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-600/30">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                            </svg>
                        </div>
                        <span className="text-lg font-black tracking-tight">Tech<span className="text-blue-500">Store</span></span>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl px-3 py-2 text-center">
                        <p className="text-xs text-purple-300 font-bold uppercase tracking-widest">Admin Panel</p>
                    </div>
                    <nav className="space-y-1">
                        {MENU.map(item => (
                            <button key={item.id} onClick={() => setSeccion(item.id)}
                                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
                                    seccion === item.id
                                        ? "bg-blue-600/20 text-blue-300 border border-blue-500/20"
                                        : "text-gray-400 hover:bg-gray-800/60 hover:text-gray-200"
                                }`}>
                                <span>{item.icon}</span>{item.label}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="border-t border-gray-800 pt-4 space-y-1">
                    <p className="text-sm font-semibold text-gray-200 px-2 truncate">{user?.nombre}</p>
                    <p className="text-xs text-purple-400 px-2 font-bold uppercase tracking-widest mb-3">Administrador 👑</p>
                    <button onClick={handleLogout}
                        className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 py-2 rounded-xl text-xs font-semibold transition-all">
                        Cerrar sesión
                    </button>
                </div>
            </aside>

            {/* ── CONTENIDO ─────────────────────────────────────────────── */}
            <main className="flex-1 overflow-y-auto p-8 space-y-8">

                {/* ══ DASHBOARD ════════════════════════════════════════════ */}
                {seccion === "dashboard" && (
                    <>
                        <div>
                            <h1 className="text-3xl font-black">Dashboard</h1>
                            <p className="text-gray-400 text-sm mt-1">Bienvenido, <span className="text-white font-semibold">{user?.nombre}</span> 👋</p>
                        </div>
                        {loadingStats ? <Spinner /> : stats && (
                            <>
                                <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                                    {[
                                        { label:"Usuarios",           value: stats.totalUsuarios,      icon:"👥", color:"blue"   },
                                        { label:"Productos activos",  value: stats.totalProductos,     icon:"📦", color:"green"  },
                                        { label:"Pedidos totales",    value: stats.totalPedidos,       icon:"🛒", color:"purple" },
                                        { label:"Ingresos totales",   value: fmtQ(stats.ingresoTotal), icon:"💰", color:"orange" },
                                        { label:"Pedidos hoy",        value: stats.pedidosHoy,         icon:"📅", color:"blue"   },
                                        { label:"Stock bajo/agotado", value: stats.stockBajo,          icon:"⚠️", color:"orange" },
                                    ].map(s => (
                                        <div key={s.label} className={`bg-gradient-to-br ${colorMap[s.color]} border rounded-2xl p-5 flex flex-col gap-2`}>
                                            <span className="text-2xl">{s.icon}</span>
                                            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{s.label}</p>
                                            <p className="text-white text-2xl font-black">{s.value}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { label:"Ver usuarios",  seccion:"usuarios",  icon:"👥", color:"text-blue-400"   },
                                        { label:"Ver productos", seccion:"productos", icon:"📦", color:"text-green-400"  },
                                        { label:"Ver pedidos",   seccion:"pedidos",   icon:"🛒", color:"text-purple-400" },
                                    ].map(a => (
                                        <button key={a.label} onClick={() => setSeccion(a.seccion)}
                                            className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl p-5 flex items-center gap-3 transition-all hover:bg-gray-800/50">
                                            <span className="text-2xl">{a.icon}</span>
                                            <span className={`font-semibold text-sm ${a.color}`}>{a.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}

                {/* ══ USUARIOS (con CRUD) ══════════════════════════════════ */}
                {seccion === "usuarios" && (
                    <>
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-black">Usuarios</h1>
                                <p className="text-gray-400 text-sm mt-1">Gestión de todos los usuarios del sistema</p>
                            </div>
                            <div className="flex items-center gap-3">
                                {!loadingUsuarios && (
                                    <div className="bg-blue-600/10 border border-blue-500/20 px-4 py-2 rounded-xl text-sm text-blue-300 font-semibold">
                                        {usuarios.length} registrados
                                    </div>
                                )}
                                <button onClick={abrirModalAgregarUser}
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20">
                                    <span className="text-lg leading-none">+</span> Agregar usuario
                                </button>
                            </div>
                        </div>

                        {loadingUsuarios ? <Spinner /> : (
                            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-gray-500 text-xs uppercase tracking-wider border-b border-gray-800">
                                            <th className="px-6 py-4">ID</th>
                                            <th className="px-6 py-4">Nombre</th>
                                            <th className="px-6 py-4">Email</th>
                                            <th className="px-6 py-4">Rol</th>
                                            <th className="px-6 py-4">Estado</th>
                                            <th className="px-6 py-4">Pedidos</th>
                                            <th className="px-6 py-4">Registro</th>
                                            <th className="px-6 py-4 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800/40">
                                        {usuarios.map(u => (
                                            <tr key={u.id} className="text-gray-300 hover:bg-gray-800/30 transition-colors">
                                                <td className="px-6 py-4 text-gray-500 font-mono">#{u.id}</td>
                                                <td className="px-6 py-4 font-semibold">{u.nombre}</td>
                                                <td className="px-6 py-4 text-gray-400">{u.email}</td>
                                                <td className="px-6 py-4"><Badge texto={u.rol}/></td>
                                                <td className="px-6 py-4"><Badge texto={u.estado}/></td>
                                                <td className="px-6 py-4 font-bold text-green-400">{u.total_pedidos}</td>
                                                <td className="px-6 py-4 text-gray-500">{fmt(u.fecha_creacion)}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button onClick={() => abrirModalEditarUser(u)}
                                                            className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all">
                                                            ✏️ Editar
                                                        </button>
                                                        <button onClick={() => handleEliminarUser(u.id, u.nombre)}
                                                            disabled={u.id === user?.id}
                                                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                                                            🗑️ Eliminar
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {usuarios.length === 0 && <p className="text-center text-gray-600 py-10">No hay usuarios.</p>}
                            </div>
                        )}
                    </>
                )}

                {/* ══ PRODUCTOS (con CRUD) ════════════════════════════════ */}
                {seccion === "productos" && (
                    <>
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-black">Productos</h1>
                                <p className="text-gray-400 text-sm mt-1">Catálogo completo</p>
                            </div>
                            <div className="flex items-center gap-3">
                                {!loadingProductos && (
                                    <div className="bg-green-600/10 border border-green-500/20 px-4 py-2 rounded-xl text-sm text-green-300 font-semibold">
                                        {productos.length} productos
                                    </div>
                                )}
                                <button onClick={abrirModalAgregarProd}
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20">
                                    <span className="text-lg leading-none">+</span> Agregar producto
                                </button>
                            </div>
                        </div>

                        {loadingProductos ? <Spinner /> : (
                            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-gray-500 text-xs uppercase tracking-wider border-b border-gray-800">
                                            <th className="px-6 py-4">SKU</th>
                                            <th className="px-6 py-4">Nombre</th>
                                            <th className="px-6 py-4">Precio</th>
                                            <th className="px-6 py-4">Stock</th>
                                            <th className="px-6 py-4">Categoría</th>
                                            <th className="px-6 py-4">Estado</th>
                                            <th className="px-6 py-4 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800/40">
                                        {productos.map(p => (
                                            <tr key={p.id} className="text-gray-300 hover:bg-gray-800/30 transition-colors">
                                                <td className="px-6 py-4 text-gray-500 font-mono text-xs">{p.sku ?? "—"}</td>
                                                <td className="px-6 py-4 font-semibold">{p.nombre}</td>
                                                <td className="px-6 py-4 text-green-400 font-bold">{fmtQ(p.precio)}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`font-bold ${p.stock === 0 ? "text-red-400" : p.stock <= 5 ? "text-yellow-400" : "text-gray-200"}`}>{p.stock}</span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-400">{p.categoria ?? "Sin categoría"}</td>
                                                <td className="px-6 py-4"><Badge texto={p.estado}/></td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button onClick={() => abrirModalEditarProd(p)}
                                                            className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all">
                                                            ✏️ Editar
                                                        </button>
                                                        <button onClick={() => handleEliminarProd(p.id, p.nombre)}
                                                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all">
                                                            🗑️ Eliminar
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {productos.length === 0 && <p className="text-center text-gray-600 py-10">No hay productos.</p>}
                            </div>
                        )}
                    </>
                )}

                {/* ══ PEDIDOS ═════════════════════════════════════════════ */}
                {seccion === "pedidos" && (
                    <>
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-black">Pedidos</h1>
                                <p className="text-gray-400 text-sm mt-1">Historial completo de órdenes</p>
                            </div>
                            {!loadingPedidos && (
                                <div className="bg-purple-600/10 border border-purple-500/20 px-4 py-2 rounded-xl text-sm text-purple-300 font-semibold">
                                    {pedidos.length} pedidos
                                </div>
                            )}
                        </div>
                        {loadingPedidos ? <Spinner /> : (
                            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-gray-500 text-xs uppercase tracking-wider border-b border-gray-800">
                                            <th className="px-6 py-4">#Pedido</th><th className="px-6 py-4">Cliente</th>
                                            <th className="px-6 py-4">Total</th><th className="px-6 py-4">Pago</th>
                                            <th className="px-6 py-4">Estado</th><th className="px-6 py-4">Estado pago</th><th className="px-6 py-4">Fecha</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800/40">
                                        {pedidos.map(p => (
                                            <tr key={p.id} className="text-gray-300 hover:bg-gray-800/30 transition-colors">
                                                <td className="px-6 py-4 text-gray-500 font-mono text-xs">{p.numero_pedido ?? `#${p.id}`}</td>
                                                <td className="px-6 py-4 font-semibold">{p.cliente}</td>
                                                <td className="px-6 py-4 text-green-400 font-bold">{fmtQ(p.total)}</td>
                                                <td className="px-6 py-4 text-gray-400 capitalize">{p.metodo_pago}</td>
                                                <td className="px-6 py-4"><Badge texto={p.estado}/></td>
                                                <td className="px-6 py-4"><Badge texto={p.estado_pago}/></td>
                                                <td className="px-6 py-4 text-gray-500">{fmt(p.fecha_pedido)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {pedidos.length === 0 && <p className="text-center text-gray-600 py-10">No hay pedidos.</p>}
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* ══ MODAL PRODUCTOS ═════════════════════════════════════════ */}
            {modalProducto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                            <h2 className="text-lg font-black">{modoEditarProd ? "✏️ Editar producto" : "➕ Agregar producto"}</h2>
                            <button onClick={() => setModalProducto(false)} className="text-gray-500 hover:text-white text-xl font-bold">✕</button>
                        </div>
                        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
                            {errorProd && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">{errorProd}</div>}
                            <InputField label="Nombre *" placeholder="Ej. Laptop HP" value={formProd.nombre}
                                onChange={e => setFormProd(f => ({ ...f, nombre: e.target.value }))} />
                            <div className="grid grid-cols-2 gap-4">
                                <InputField label="Precio (Q) *" type="number" placeholder="0.00" value={formProd.precio}
                                    onChange={e => setFormProd(f => ({ ...f, precio: e.target.value }))} />
                                <InputField label="Stock *" type="number" placeholder="0" value={formProd.stock}
                                    onChange={e => setFormProd(f => ({ ...f, stock: e.target.value }))} />
                            </div>
                            <InputField label="SKU" placeholder="Ej. LAP-HP-001" value={formProd.sku}
                                onChange={e => setFormProd(f => ({ ...f, sku: e.target.value }))} />
                            <SelectField label="Categoría" value={formProd.categoria_id}
                                onChange={e => setFormProd(f => ({ ...f, categoria_id: e.target.value }))}>
                                <option value="">Sin categoría</option>
                                {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                            </SelectField>
                            <SelectField label="Estado" value={formProd.estado}
                                onChange={e => setFormProd(f => ({ ...f, estado: e.target.value }))}>
                                <option value="disponible">Disponible</option>
                                <option value="agotado">Agotado</option>
                                <option value="inactivo">Inactivo</option>
                            </SelectField>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Descripción</label>
                                <textarea value={formProd.descripcion} rows={3} placeholder="Descripción del producto..."
                                    onChange={e => setFormProd(f => ({ ...f, descripcion: e.target.value }))}
                                    className="w-full bg-gray-800/60 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors resize-none" />
                            </div>
                            <div>
                                <InputField label="URL de imagen" nota="(solo para la tienda)"
                                    placeholder="https://ejemplo.com/imagen.jpg" value={formProd.imagen_url}
                                    onChange={e => setFormProd(f => ({ ...f, imagen_url: e.target.value }))} />
                                <p className="text-xs text-gray-600 mt-1">No se muestra aquí pero sí aparecerá en la tienda para los clientes.</p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-800">
                            <button onClick={() => setModalProducto(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white font-medium">Cancelar</button>
                            <button onClick={handleGuardarProd} disabled={savingProd}
                                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2">
                                {savingProd ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Guardando...</> : modoEditarProd ? "💾 Guardar cambios" : "✅ Crear producto"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══ MODAL USUARIOS ══════════════════════════════════════════ */}
            {modalUsuario && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                            <h2 className="text-lg font-black">{modoEditarUser ? "✏️ Editar usuario" : "➕ Agregar usuario"}</h2>
                            <button onClick={() => setModalUsuario(false)} className="text-gray-500 hover:text-white text-xl font-bold">✕</button>
                        </div>
                        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
                            {errorUser && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">{errorUser}</div>}
                            <InputField label="Nombre *" placeholder="Nombre completo" value={formUser.nombre}
                                onChange={e => setFormUser(f => ({ ...f, nombre: e.target.value }))} />
                            <InputField label="Email *" type="email" placeholder="correo@ejemplo.com" value={formUser.email}
                                onChange={e => setFormUser(f => ({ ...f, email: e.target.value }))} />
                            <InputField
                                label={modoEditarUser ? "Nueva contraseña" : "Contraseña *"}
                                nota={modoEditarUser ? "(dejar vacío para no cambiar)" : undefined}
                                type="password" placeholder="••••••••" value={formUser.password}
                                onChange={e => setFormUser(f => ({ ...f, password: e.target.value }))} />
                            <div className="grid grid-cols-2 gap-4">
                                <SelectField label="Rol" value={formUser.rol}
                                    onChange={e => setFormUser(f => ({ ...f, rol: e.target.value }))}>
                                    <option value="cliente">Cliente</option>
                                    <option value="vendedor">Vendedor</option>
                                    <option value="admin">Admin</option>
                                </SelectField>
                                <SelectField label="Estado" value={formUser.estado}
                                    onChange={e => setFormUser(f => ({ ...f, estado: e.target.value }))}>
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                </SelectField>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-800">
                            <button onClick={() => setModalUsuario(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white font-medium">Cancelar</button>
                            <button onClick={handleGuardarUser} disabled={savingUser}
                                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2">
                                {savingUser ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Guardando...</> : modoEditarUser ? "💾 Guardar cambios" : "✅ Crear usuario"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};