const ESTILOS: Record<string, string> = {
    activo: "bg-green-500/10  text-green-400  border-green-500/20",
    inactivo: "bg-red-500/10    text-red-400    border-red-500/20",
    disponible: "bg-blue-500/10   text-blue-400   border-blue-500/20",
    agotado: "bg-red-500/10    text-red-400    border-red-500/20",
    pendiente: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    confirmado: "bg-blue-500/10   text-blue-400   border-blue-500/20",
    enviado: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    entregado: "bg-green-500/10  text-green-400  border-green-500/20",
    cancelado: "bg-red-500/10    text-red-400    border-red-500/20",
    pagado: "bg-green-500/10  text-green-400  border-green-500/20",
    reembolsado: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    admin: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    vendedor: "bg-blue-500/10   text-blue-400   border-blue-500/20",
    cliente: "bg-gray-500/10   text-gray-400   border-gray-500/20",
};

export const Badge = ({ texto }: { texto?: string }) => {
    if (!texto) return <span className="text-gray-600">—</span>;

    return (
        <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${
                ESTILOS[texto] ?? "bg-gray-700 text-gray-300 border-gray-600"
            }`}
        >
            {texto}
        </span>
    );
};
