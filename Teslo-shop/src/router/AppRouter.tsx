// src/router/AppRouter.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { MainLayout } from "../Layout/MainLayout";
import { HomePage } from "../pages/HomePage";
import { CartPage } from "../pages/CartPage";
import { LoginPage } from "../pages/LoginPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardPage } from "../pages/DashboardPage"; // 👈 ya lo tenías

export const AppRouter = createBrowserRouter([
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

    // 👑 Ruta admin — ya la tenías correcta
    {
        path: "/admin",
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
            { path: "dashboard", element: <DashboardPage /> }
        ]
    },

    { path: "/login", element: <LoginPage /> },
    { path: "*", element: <Navigate to="/login" replace /> }
]);