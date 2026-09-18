import { useCallback, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { ToastContext, type ToastVariant } from "../../context/ToastContext";

interface ToastMessage {
    id: number;
    text: string;
    variant: ToastVariant;
}

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const notify = useCallback((text: string, variant: ToastVariant = "error") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, text, variant }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    return (
        <ToastContext.Provider value={{ notify }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 40 }}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium max-w-sm ${
                                toast.variant === "error"
                                    ? "bg-red-950 border-red-500/30 text-red-300"
                                    : "bg-green-950 border-green-500/30 text-green-300"
                            }`}
                        >
                            {toast.variant === "error" ? (
                                <XCircleIcon className="h-5 w-5 shrink-0" />
                            ) : (
                                <CheckCircleIcon className="h-5 w-5 shrink-0" />
                            )}
                            {toast.text}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};
