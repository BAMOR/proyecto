// src/router/AppRouter.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { MainLayout } from "../Layout/MainLayout";
import { HomePage } from "../pages/HomePage";
import { CartPage } from "../pages/CartPage";
import { LoginPage } from "../pages/LoginPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardPage } from "../pages/DashboardPage";

export const AppRouter = createBrowserRouter([
    // Rutas de clientes (las que ya tienes)
    {
        path: "/",
        element: <ProtectedRoute />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    { index: true, element: <HomePage /> },
                    { path: "cart", element: <CartPage /> }
                ]
            }
        ]
    },

    // 👑 Ruta del Admin (separada, sin MainLayout de tienda)
    {
        path: "/admin",
        element: <ProtectedRoute allowedRoles={["admin"]} />, // 🛡️ Solo admins
        children: [
            { path: "dashboard", element: <DashboardPage /> }
        ]
    },

    { path: "/login", element: <LoginPage /> },
    { path: "*", element: <Navigate to="/login" replace /> }
]);