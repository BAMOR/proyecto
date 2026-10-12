const ESTILOS: Record<string, string> = {
    activo: "bg-green-100 text-green-700 border-green-300 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20",
    inactivo: "bg-red-100 text-red-700 border-red-300 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
    disponible: "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
    agotado: "bg-red-100 text-red-700 border-red-300 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
    pendiente: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20",
    confirmado: "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
    enviado: "bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20",
    entregado: "bg-green-100 text-green-700 border-green-300 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20",
    cancelado: "bg-red-100 text-red-700 border-red-300 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
    pagado: "bg-green-100 text-green-700 border-green-300 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20",
    reembolsado: "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20",
    admin: "bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20",
    vendedor: "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
    cliente: "bg-slate-100 text-slate-600 border-slate-300 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20",
};

const FALLBACK = "bg-slate-200 text-slate-700 border-slate-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600";

export const Badge = ({ texto }: { texto?: string }) => {
    if (!texto) return <span className="text-slate-400 dark:text-gray-600">—</span>;

    return (
        <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${ESTILOS[texto] ?? FALLBACK}`}
        >
            {texto}
        </span>
    );
};
