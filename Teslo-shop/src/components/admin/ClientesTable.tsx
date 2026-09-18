import { TrashIcon } from "@heroicons/react/24/outline";
import type { Cliente } from "../../types/ventas";

const fmt = (f: string) => new Date(f).toLocaleDateString("es-GT", { day: "2-digit", month: "short", year: "numeric" });

interface Props {
    clientes: Cliente[];
    onEliminar: (cliente: Cliente) => void;
}

export const ClientesTable = ({ clientes, onEliminar }: Props) => (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
            <thead>
                <tr className="text-left text-gray-500 text-xs uppercase tracking-wider border-b border-gray-800">
                    <th className="px-6 py-4">Nombre</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Teléfono</th>
                    <th className="px-6 py-4">Ciudad</th>
                    <th className="px-6 py-4">Registro</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/40">
                {clientes.map((c) => (
                    <tr key={c.id} className="text-gray-300 hover:bg-gray-800/30 transition-colors">
                        <td className="px-6 py-4 font-semibold">{c.nombre}</td>
                        <td className="px-6 py-4 text-gray-400">{c.email}</td>
                        <td className="px-6 py-4 text-gray-400">{c.telefono || "—"}</td>
                        <td className="px-6 py-4 text-gray-400">{c.ciudad || "—"}</td>
                        <td className="px-6 py-4 text-gray-500">{fmt(c.fecha_registro)}</td>
                        <td className="px-6 py-4 text-right">
                            <button
                                onClick={() => onEliminar(c)}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1.5"
                            >
                                <TrashIcon className="h-4 w-4" /> Eliminar
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {clientes.length === 0 && <p className="text-center text-gray-600 py-10">No hay clientes.</p>}
    </div>
);
