import { useEffect, useState } from "react";

const STORAGE_KEY = "sigev-theme";
export type Theme = "light" | "dark";

const leerTemaGuardado = (): Theme => {
    try {
        const guardado = localStorage.getItem(STORAGE_KEY);
        return guardado === "dark" ? "dark" : "light";
    } catch {
        return "light";
    }
};

// Preferencia de tema compartida por todo el panel de staff (admin y ventas),
// por defecto claro.
export const useTheme = () => {
    const [theme, setTheme] = useState<Theme>(leerTemaGuardado);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch {
            // localStorage no disponible (modo privado, etc.) — el tema solo dura la sesión
        }
    }, [theme]);

    const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

    return { theme, toggleTheme };
};
