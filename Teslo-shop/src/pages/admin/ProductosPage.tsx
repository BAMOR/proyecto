import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useProductosAdmin, useEliminarProducto } from "../../hooks/admin/useProductos";
import { ProductosTable } from "../../components/admin/ProductosTable";
import { ProductoFormModal } from "../../components/admin/modals/ProductoFormModal";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { useToast } from "../../hooks/useToast";
import type { ProductoAdmin } from "../../types/dashboard";

export const ProductosPage = () => {
    const { data: productos = [], isLoading } = useProductosAdmin();
    const eliminar = useEliminarProducto();
    const { notify } = useToast();

    const [modalAbierto, setModalAbierto] = useState(false);
    const [productoEditar, setProductoEditar] = useState<ProductoAdmin | null>(null);
    const [productoEliminar, setProductoEliminar] = useState<ProductoAdmin | null>(null);

    const abrirAgregar = () => {
        setProductoEditar(null);
        setModalAbierto(true);
    };

    const abrirEditar = (producto: ProductoAdmin) => {
        setProductoEditar(producto);
        setModalAbierto(true);
    };

    const confirmarEliminar = async () => {
        if (!productoEliminar) return;
        try {
            await eliminar.mutateAsync(productoEliminar.id);
            notify("Producto eliminado correctamente.", "success");
        } catch {
            notify("Error al eliminar el producto.", "error");
        } finally {
            setProductoEliminar(null);
        }
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black">Productos</h1>
                    <p className="text-gray-400 text-sm mt-1">Catálogo completo</p>
                </div>
                <div className="flex items-center gap-3">
                    {!isLoading && (
                        <div className="bg-green-600/10 border border-green-500/20 px-4 py-2 rounded-xl text-sm text-green-300 font-semibold">
                            {productos.length} productos
                        </div>
                    )}
                    <button
                        onClick={abrirAgregar}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20"
                    >
                        <PlusIcon className="h-4 w-4" /> Agregar producto
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <ProductosTable productos={productos} onEditar={abrirEditar} onEliminar={setProductoEliminar} />
            )}

            <ProductoFormModal open={modalAbierto} producto={productoEditar} onClose={() => setModalAbierto(false)} />

            <ConfirmDialog
                open={Boolean(productoEliminar)}
                title="¿Eliminar producto?"
                description={`Se eliminará "${productoEliminar?.nombre}" permanentemente. Esta acción no se puede deshacer.`}
                confirmLabel="Eliminar"
                onConfirm={confirmarEliminar}
                onCancel={() => setProductoEliminar(null)}
            />
        </>
    );
};
