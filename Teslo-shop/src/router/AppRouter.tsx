// src/router/AppRouter.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { MainLayout } from "../Layout/MainLayout";
import { HomePage } from "../pages/HomePage";
import { CartPage } from "../pages/CartPage";
import { LoginPage } from "../pages/LoginPage";
import { ProtectedRoute } from "./ProtectedRoute";

export const AppRouter = createBrowserRouter([
    // 1. 🔓 Ruta raíz limpia: Si entran a /, se evalúa el Guardián directamente
    {
        path: "/",
        element: <ProtectedRoute />, // 🛡️ El guardián decide si se quedan o se van
        children: [
            {
                element: <MainLayout />,
                children: [
                    { 
                        index: true, 
                        element: <HomePage /> // 🔐 http://localhost:5173/ si está logueado
                    },
                    { 
                        path: "cart", 
                        element: <CartPage /> // 🔐 http://localhost:5173/cart
                    }
                ]
            }
        ]
    },

    // 2. 🔓 Ruta pública del Login
    {
        path: "/login",
        element: <LoginPage /> // 👈 Al estar al mismo nivel que la raíz, el navegador limpia la URL
    },

    // 3. 🔄 Comodín de seguridad total
    {
        path: "*",
        element: <Navigate to="/login" replace />
    }
]);