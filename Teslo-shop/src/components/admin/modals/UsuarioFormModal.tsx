import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import { InputField, SelectField } from "../../ui/FormField";
import { useCrearUsuario, useActualizarUsuario } from "../../../hooks/admin/useUsuarios";
import { useToast } from "../../../hooks/useToast";
import { FORM_USUARIO_VACIO, type FormUsuario, type UsuarioAdmin } from "../../../types/dashboard";

interface Props {
    open: boolean;
    usuario: UsuarioAdmin | null;
    onClose: () => void;
}

const buildForm = (usuario: UsuarioAdmin | null): FormUsuario =>
    usuario
        ? {
              nombre: usuario.nombre ?? "",
              email: usuario.email ?? "",
              password: "",
              rol: usuario.rol ?? "vendedor",
              estado: usuario.estado ?? "activo",
          }
        : FORM_USUARIO_VACIO;

export const UsuarioFormModal = ({ open, usuario, onClose }: Props) => {
    const crear = useCrearUsuario();
    const actualizar = useActualizarUsuario();
    const { notify } = useToast();

    const [form, setForm] = useState(() => buildForm(usuario));
    const [error, setError] = useState<string | null>(null);

    const modoEditar = Boolean(usuario);
    const saving = crear.isPending || actualizar.isPending;

    // Reinicia el formulario cuando el modal se abre para un usuario distinto
    const syncKey = `${open}-${usuario?.id ?? "nuevo"}`;
    const [lastSyncKey, setLastSyncKey] = useState(syncKey);
    if (syncKey !== lastSyncKey) {
        setLastSyncKey(syncKey);
        setForm(buildForm(usuario));
        setError(null);
    }

    const handleGuardar = async () => {
        if (!form.nombre || !form.email) {
            setError("Nombre y email son obligatorios.");
            return;
        }
        if (!modoEditar && !form.password) {
            setError("La contraseña es obligatoria para nuevos usuarios.");
            return;
        }
        setError(null);
        try {
            if (modoEditar && usuario) {
                await actualizar.mutateAsync({ id: usuario.id, form });
                notify("Usuario actualizado correctamente.", "success");
            } else {
                await crear.mutateAsync(form);
                notify("Usuario creado correctamente.", "success");
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
                        className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl"
                        initial={{ opacity: 0, scale: 0.95, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 16 }}
                        transition={{ duration: 0.18 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                            <h2 className="text-lg font-black">{modoEditar ? "Editar usuario" : "Agregar usuario"}</h2>
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
                                label={modoEditar ? "Nueva contraseña" : "Contraseña *"}
                                nota={modoEditar ? "(dejar vacío para no cambiar)" : undefined}
                                type="password"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <SelectField
                                    label="Rol"
                                    value={form.rol}
                                    onChange={(e) => setForm((f) => ({ ...f, rol: e.target.value }))}
                                >
                                    <option value="vendedor">Vendedor</option>
                                    <option value="admin">Admin</option>
                                </SelectField>
                                <SelectField
                                    label="Estado"
                                    value={form.estado}
                                    onChange={(e) => setForm((f) => ({ ...f, estado: e.target.value }))}
                                >
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                </SelectField>
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
                                        {modoEditar ? "Guardar cambios" : "Crear usuario"}
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
