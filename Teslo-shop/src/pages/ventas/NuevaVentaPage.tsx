import { useReducer, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { ClientePicker } from "../../components/ventas/ClientePicker";
import { ProductoPicker } from "../../components/ventas/ProductoPicker";
import { VentaItemRow } from "../../components/ventas/VentaItemRow";
import { ventaReducer, initialVentaState } from "../../reducer/ventaReducer";
import { useCrearVenta } from "../../hooks/ventas/useCrearVenta";
import { useToast } from "../../hooks/useToast";
import type { Cliente } from "../../types/ventas";

const METODOS_PAGO = [
    { value: "efectivo", label: "Efectivo" },
    { value: "tarjeta", label: "Tarjeta" },
    { value: "transferencia", label: "Transferencia" },
    { value: "paypal", label: "PayPal" },
];

const IVA = 0.12;

export const NuevaVentaPage = () => {
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [draft, dispatch] = useReducer(ventaReducer, initialVentaState);
    const [metodoPago, setMetodoPago] = useState("efectivo");
    const crearVenta = useCrearVenta();
    const { notify } = useToast();

    const subtotal = draft.items.reduce((sum, item) => sum + Number(item.precio) * item.cantidad, 0);
    const impuesto = subtotal * IVA;
    const total = subtotal + impuesto;

    const handleRegistrar = async () => {
        if (!cliente) {
            notify("Selecciona o registra un cliente antes de continuar.", "error");
            return;
        }
        if (draft.items.length === 0) {
            notify("Agrega al menos un producto a la venta.", "error");
            return;
        }

        try {
            const data = await crearVenta.mutateAsync({
                cliente_id: cliente.id,
                metodo_pago: metodoPago,
                items: draft.items.map((item) => ({ producto_id: item.id, cantidad: item.cantidad })),
            });
            notify(`Venta ${data.numero_pedido} registrada correctamente.`, "success");
            dispatch({ type: "clear" });
            setCliente(null);
            setMetodoPago("efectivo");
        } catch (err) {
            const message =
                (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? "Error al registrar la venta.";
            notify(message, "error");
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
            <div>
                <h1 className="text-3xl font-black text-white">Nueva venta</h1>
                <p className="text-gray-400 text-sm mt-1">Registra una venta para un cliente de ICE S.A.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                        <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3">1. Cliente</h2>
                        <ClientePicker value={cliente} onChange={setCliente} />
                    </div>

                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                        <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3">2. Productos</h2>
                        <ProductoPicker onAgregar={(producto) => dispatch({ type: "add-item", payload: { producto } })} />
                    </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 h-fit lg:sticky lg:top-8 space-y-4">
                    <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Resumen de venta</h2>

                    <div className="space-y-2 max-h-72 overflow-y-auto">
                        <AnimatePresence initial={false}>
                            {draft.items.map((item) => (
                                <VentaItemRow
                                    key={item.id}
                                    item={item}
                                    onIncrease={() => dispatch({ type: "add-item", payload: { producto: item } })}
                                    onDecrease={() => dispatch({ type: "decrease-quantity", payload: { id: item.id } })}
                                    onRemove={() => dispatch({ type: "remove-item", payload: { id: item.id } })}
                                />
                            ))}
                        </AnimatePresence>
                        {draft.items.length === 0 && (
                            <div className="text-center py-8 text-gray-600">
                                <ShoppingBagIcon className="h-8 w-8 mx-auto mb-2" />
                                <p className="text-sm">Sin productos agregados</p>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                            Método de pago
                        </label>
                        <select
                            value={metodoPago}
                            onChange={(e) => setMetodoPago(e.target.value)}
                            className="w-full bg-gray-800/60 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                        >
                            {METODOS_PAGO.map((m) => (
                                <option key={m.value} value={m.value}>{m.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="border-t border-gray-800 pt-3 space-y-1.5">
                        <div className="flex justify-between text-sm text-gray-400">
                            <span>Subtotal</span>
                            <span>Q {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-400">
                            <span>IVA (12%)</span>
                            <span>Q {impuesto.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-black text-white pt-1">
                            <span>Total</span>
                            <span>Q {total.toFixed(2)}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleRegistrar}
                        disabled={crearVenta.isPending}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                    >
                        {crearVenta.isPending ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            "Registrar venta"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
