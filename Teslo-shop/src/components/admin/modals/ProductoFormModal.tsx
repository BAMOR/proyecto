import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import { InputField, SelectField, TextAreaField } from "../../ui/FormField";
import { useCategorias } from "../../../hooks/admin/useCategorias";
import { useCrearProducto, useActualizarProducto } from "../../../hooks/admin/useProductos";
import { useToast } from "../../../hooks/useToast";
import { FORM_PRODUCTO_VACIO, type FormProducto, type ProductoAdmin } from "../../../types/dashboard";

interface Props {
    open: boolean;
    producto: ProductoAdmin | null;
    onClose: () => void;
}

const buildForm = (producto: ProductoAdmin | null): FormProducto =>
    producto
        ? {
              categoria_id: String(producto.categoria_id ?? ""),
              nombre: producto.nombre ?? "",
              descripcion: producto.descripcion ?? "",
              precio: String(producto.precio ?? ""),
              stock: String(producto.stock ?? ""),
              sku: producto.sku ?? "",
              estado: producto.estado ?? "disponible",
              imagen_url: producto.imagen_url ?? "",
          }
        : FORM_PRODUCTO_VACIO;

export const ProductoFormModal = ({ open, producto, onClose }: Props) => {
    const { data: categorias = [] } = useCategorias();
    const crear = useCrearProducto();
    const actualizar = useActualizarProducto();
    const { notify } = useToast();

    const [form, setForm] = useState(() => buildForm(producto));
    const [error, setError] = useState<string | null>(null);

    const modoEditar = Boolean(producto);
    const saving = crear.isPending || actualizar.isPending;

    // Reinicia el formulario cuando el modal se abre para un producto distinto
    // (patrón "adjust state during render" en vez de useEffect, ver docs de React)
    const syncKey = `${open}-${producto?.id ?? "nuevo"}`;
    const [lastSyncKey, setLastSyncKey] = useState(syncKey);
    if (syncKey !== lastSyncKey) {
        setLastSyncKey(syncKey);
        setForm(buildForm(producto));
        setError(null);
    }

    const handleGuardar = async () => {
        if (!form.nombre || !form.precio || !form.stock) {
            setError("Nombre, precio y stock son obligatorios.");
            return;
        }
        setError(null);
        try {
            if (modoEditar && producto) {
                await actualizar.mutateAsync({ id: producto.id, form });
                notify("Producto actualizado correctamente.", "success");
            } else {
                await crear.mutateAsync(form);
                notify("Producto creado correctamente.", "success");
            }
            onClose();
        } catch (err) {
            const message =
                (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? "Error al guardar.";
            setError(message);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl"
                        initial={{ opacity: 0, scale: 0.95, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 16 }}
                        transition={{ duration: 0.18 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                            <h2 className="text-lg font-black">{modoEditar ? "Editar producto" : "Agregar producto"}</h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
                                    {error}
                                </div>
                            )}
                            <InputField
                                label="Nombre *"
                                placeholder="Ej. Laptop HP"
                                value={form.nombre}
                                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <InputField
                                    label="Precio (Q) *"
                                    type="number"
                                    placeholder="0.00"
                                    value={form.precio}
                                    onChange={(e) => setForm((f) => ({ ...f, precio: e.target.value }))}
                                />
                                <InputField
                                    label="Stock *"
                                    type="number"
                                    placeholder="0"
                                    value={form.stock}
                                    onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                                />
                            </div>
                            <InputField
                                label="SKU"
                                placeholder="Ej. LAP-HP-001"
                                value={form.sku}
                                onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
                            />
                            <SelectField
                                label="Categoría"
                                value={form.categoria_id}
                                onChange={(e) => setForm((f) => ({ ...f, categoria_id: e.target.value }))}
                            >
                                <option value="">Sin categoría</option>
                                {categorias.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.nombre}
                                    </option>
                                ))}
                            </SelectField>
                            <SelectField
                                label="Estado"
                                value={form.estado}
                                onChange={(e) => setForm((f) => ({ ...f, estado: e.target.value }))}
                            >
                                <option value="disponible">Disponible</option>
                                <option value="agotado">Agotado</option>
                                <option value="inactivo">Inactivo</option>
                            </SelectField>
                            <TextAreaField
                                label="Descripción"
                                rows={3}
                                placeholder="Descripción del producto..."
                                value={form.descripcion}
                                onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
                            />
                            <div>
                                <InputField
                                    label="URL de imagen"
                                    nota="(solo para la tienda)"
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                    value={form.imagen_url}
                                    onChange={(e) => setForm((f) => ({ ...f, imagen_url: e.target.value }))}
                                />
                                <p className="text-xs text-gray-600 mt-1">
                                    No se muestra aquí pero sí aparecerá en la tienda para los clientes.
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-800">
                            <button onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white font-medium">
                                Cancelar
                            </button>
                            <button
                                onClick={handleGuardar}
                                disabled={saving}
                                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                            >
                                {saving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <CheckIcon className="h-4 w-4" />
                                        {modoEditar ? "Guardar cambios" : "Crear producto"}
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
