import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { ProductoAdmin } from "../../types/dashboard";
import { Badge } from "./Badge";

interface Props {
    productos: ProductoAdmin[];
    onEditar: (producto: ProductoAdmin) => void;
    onEliminar: (producto: ProductoAdmin) => void;
}

const fmtQ = (v: number) => `Q ${Number(v).toLocaleString("es-GT", { minimumFractionDigits: 2 })}`;

export const ProductosTable = ({ productos, onEditar, onEliminar }: Props) => (
    <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
            <thead>
                <tr className="text-left text-slate-400 dark:text-gray-500 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-gray-800">
                    <th className="px-6 py-4">SKU</th>
                    <th className="px-6 py-4">Nombre</th>
                    <th className="px-6 py-4">Precio</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Categoría</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-gray-800/40">
                {productos.map((p) => (
                    <tr key={p.id} className="text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="px-6 py-4 text-slate-400 dark:text-gray-500 font-mono text-xs">{p.sku ?? "—"}</td>
                        <td className="px-6 py-4 font-semibold">{p.nombre}</td>
                        <td className="px-6 py-4 text-green-700 dark:text-green-400 font-bold">{fmtQ(p.precio)}</td>
                        <td className="px-6 py-4">
                            <span className={`font-bold ${p.stock === 0 ? "text-red-700 dark:text-red-400" : p.stock <= 5 ? "text-yellow-700 dark:text-yellow-400" : "text-slate-800 dark:text-gray-200"}`}>
                                {p.stock}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 dark:text-gray-400">{p.categoria ?? "Sin categoría"}</td>
                        <td className="px-6 py-4"><Badge texto={p.estado} /></td>
                        <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                                <button
                                    onClick={() => onEditar(p)}
                                    className="bg-blue-100 dark:bg-blue-500/10 hover:bg-blue-200 dark:hover:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
                                >
                                    <PencilSquareIcon className="h-4 w-4" /> Editar
                                </button>
                                <button
                                    onClick={() => onEliminar(p)}
                                    className="bg-red-100 dark:bg-red-500/10 hover:bg-red-200 dark:hover:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
                                >
                                    <TrashIcon className="h-4 w-4" /> Eliminar
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {productos.length === 0 && <p className="text-center text-slate-300 dark:text-gray-600 py-10">No hay productos.</p>}
    </div>
);
