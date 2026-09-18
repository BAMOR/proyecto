import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { UsuarioAdmin } from "../../types/dashboard";
import { Badge } from "./Badge";

interface Props {
    usuarios: UsuarioAdmin[];
    currentUserId?: number;
    onEditar: (usuario: UsuarioAdmin) => void;
    onEliminar: (usuario: UsuarioAdmin) => void;
}

const fmt = (f: string) => new Date(f).toLocaleDateString("es-GT", { day: "2-digit", month: "short", year: "numeric" });

export const UsuariosTable = ({ usuarios, currentUserId, onEditar, onEliminar }: Props) => (
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
                {usuarios.map((u) => (
                    <tr key={u.id} className="text-gray-300 hover:bg-gray-800/30 transition-colors">
                        <td className="px-6 py-4 text-gray-500 font-mono">#{u.id}</td>
                        <td className="px-6 py-4 font-semibold">{u.nombre}</td>
                        <td className="px-6 py-4 text-gray-400">{u.email}</td>
                        <td className="px-6 py-4"><Badge texto={u.rol} /></td>
                        <td className="px-6 py-4"><Badge texto={u.estado} /></td>
                        <td className="px-6 py-4 font-bold text-green-400">{u.total_pedidos}</td>
                        <td className="px-6 py-4 text-gray-500">{fmt(u.fecha_creacion)}</td>
                        <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                                <button
                                    onClick={() => onEditar(u)}
                                    className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
                                >
                                    <PencilSquareIcon className="h-4 w-4" /> Editar
                                </button>
                                <button
                                    onClick={() => onEliminar(u)}
                                    disabled={u.id === currentUserId}
                                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
                                >
                                    <TrashIcon className="h-4 w-4" /> Eliminar
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {usuarios.length === 0 && <p className="text-center text-gray-600 py-10">No hay usuarios.</p>}
    </div>
);
