import { motion } from "framer-motion";
import { MinusIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { VentaItem } from "../../types/ventas";

interface Props {
    item: VentaItem;
    onIncrease: () => void;
    onDecrease: () => void;
    onRemove: () => void;
}

export const VentaItemRow = ({ item, onIncrease, onDecrease, onRemove }: Props) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.18 }}
        className="flex items-center justify-between gap-4 bg-gray-800/40 border border-gray-700/60 rounded-xl px-4 py-3"
    >
        <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{item.nombre}</p>
            <p className="text-xs text-gray-500 font-mono">{item.sku}</p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center border border-gray-700 rounded-lg overflow-hidden">
                <button onClick={onDecrease} className="p-1.5 text-gray-400 hover:bg-gray-700/60 transition-colors">
                    <MinusIcon className="h-3.5 w-3.5" />
                </button>
                <span className="px-3 text-sm font-bold text-white w-8 text-center">{item.cantidad}</span>
                <button
                    onClick={onIncrease}
                    disabled={item.cantidad >= item.stock}
                    className="p-1.5 text-gray-400 hover:bg-gray-700/60 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <PlusIcon className="h-3.5 w-3.5" />
                </button>
            </div>
            <span className="text-green-400 font-bold text-sm w-20 text-right">
                Q {(Number(item.precio) * item.cantidad).toFixed(2)}
            </span>
            <button onClick={onRemove} className="text-red-400 hover:text-red-300 transition-colors">
                <TrashIcon className="h-4 w-4" />
            </button>
        </div>
    </motion.div>
);
