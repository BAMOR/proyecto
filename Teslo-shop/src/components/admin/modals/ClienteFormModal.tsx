import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import { InputField } from "../../ui/FormField";
import { useCrearCliente } from "../../../hooks/ventas/useClientes";
import { useToast } from "../../../hooks/useToast";
import { FORM_CLIENTE_VACIO, type Cliente } from "../../../types/ventas";

interface Props {
    open: boolean;
    onClose: () => void;
    onCreado?: (cliente: Cliente) => void;
}

export const ClienteFormModal = ({ open, onClose, onCreado }: Props) => {
    const crear = useCrearCliente();
    const { notify } = useToast();

    const [form, setForm] = useState(FORM_CLIENTE_VACIO);
    const [error, setError] = useState<string | null>(null);

    const [lastOpen, setLastOpen] = useState(open);
    if (open !== lastOpen) {
        setLastOpen(open);
        if (open) {
            setForm(FORM_CLIENTE_VACIO);
            setError(null);
        }
    }

    const handleGuardar = async () => {
        if (!form.nombre || !form.email) {
            setError("Nombre y email son obligatorios.");
            return;
        }
        setError(null);
        try {
            const data = await crear.mutateAsync(form);
            notify("Cliente creado correctamente.", "success");
            onCreado?.({
                id: data.clienteId,
                usuario_id: null,
                nombre: form.nombre,
                email: form.email,
                telefono: form.telefono,
                direccion: form.direccion,
                ciudad: form.ciudad,
                codigo_postal: form.codigo_postal,
                fecha_registro: new Date().toISOString(),
            });
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
                        className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl"
                        initial={{ opacity: 0, scale: 0.95, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 16 }}
                        transition={{ duration: 0.18 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                            <h2 className="text-lg font-black">Nuevo cliente</h2>
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
                                placeholder="Nombre completo"
                                value={form.nombre}
                                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                            />
                            <InputField
                                label="Email *"
                                type="email"
                                placeholder="correo@ejemplo.com"
                                value={form.email}
                                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                            />
                            <InputField
                                label="Teléfono"
                                placeholder="Ej. 5555-5555"
                                value={form.telefono}
                                onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
                            />
                            <InputField
                                label="Dirección"
                                placeholder="Dirección del cliente"
                                value={form.direccion}
                                onChange={(e) => setForm((f) => ({ ...f, direccion: e.target.value }))}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <InputField
                                    label="Ciudad"
                                    value={form.ciudad}
                                    onChange={(e) => setForm((f) => ({ ...f, ciudad: e.target.value }))}
                                />
                                <InputField
                                    label="Código postal"
                                    value={form.codigo_postal}
                                    onChange={(e) => setForm((f) => ({ ...f, codigo_postal: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-800">
                            <button onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white font-medium">
                                Cancelar
                            </button>
                            <button
                                onClick={handleGuardar}
                                disabled={crear.isPending}
                                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                            >
                                {crear.isPending ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <CheckIcon className="h-4 w-4" />
                                        Crear cliente
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
