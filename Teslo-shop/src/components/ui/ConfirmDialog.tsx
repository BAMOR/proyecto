import { AnimatePresence, motion } from "framer-motion";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    danger?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmDialog = ({
    open,
    title,
    description,
    confirmLabel = "Confirmar",
    danger = true,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) => (
    <AnimatePresence>
        {open && (
            <motion.div
                className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onCancel}
            >
                <motion.div
                    className="bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center"
                    initial={{ opacity: 0, scale: 0.92, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 12 }}
                    transition={{ duration: 0.18 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${danger ? "bg-red-100 dark:bg-red-500/10" : "bg-blue-100 dark:bg-blue-500/10"}`}>
                        <ExclamationTriangleIcon className={`h-6 w-6 ${danger ? "text-red-700 dark:text-red-400" : "text-blue-700 dark:text-blue-400"}`} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h2>
                    <p className="text-sm text-slate-500 dark:text-gray-400 mb-6">{description}</p>
                    <div className="flex justify-center gap-3">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                                danger
                                    ? "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20"
                                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20"
                            }`}
                        >
                            {confirmLabel}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);
