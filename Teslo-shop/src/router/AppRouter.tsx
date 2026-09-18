// src/router/AppRouter.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { CatalogoPage } from "../pages/CatalogoPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleRedirect } from "./RoleRedirect";
import { AdminLayout } from "../pages/admin/AdminLayout";
import { DashboardHome } from "../pages/admin/DashboardHome";
import { UsuariosPage } from "../pages/admin/UsuariosPage";
import { ProductosPage } from "../pages/admin/ProductosPage";
import { PedidosPage } from "../pages/admin/PedidosPage";
import { ClientesPage } from "../pages/admin/ClientesPage";
import { VentasLayout } from "../pages/ventas/VentasLayout";
import { NuevaVentaPage } from "../pages/ventas/NuevaVentaPage";
import { HistorialVentasPage } from "../pages/ventas/HistorialVentasPage";

export const AppRouter = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoute />,
        children: [{ index: true, element: <RoleRedirect /> }],
    },

    // Ventas: admin y vendedor
    {
        path: "/ventas",
        element: <ProtectedRoute allowedRoles={["admin", "vendedor"]} />,
        children: [
            {
                element: <VentasLayout />,
                children: [
                    { index: true, element: <NuevaVentaPage /> },
                    { path: "historial", element: <HistorialVentasPage /> },
                ],
            },
        ],
    },

    // Panel admin
    {
        path: "/admin",
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
            {
                element: <AdminLayout />,
                children: [
                    { index: true, element: <DashboardHome /> },
                    { path: "usuarios", element: <UsuariosPage /> },
                    { path: "clientes", element: <ClientesPage /> },
                    { path: "productos", element: <ProductosPage /> },
                    { path: "pedidos", element: <PedidosPage /> },
                ],
            },
        ],
    },

    { path: "/login", element: <LoginPage /> },
    { path: "/catalogo", element: <CatalogoPage /> },
    { path: "*", element: <Navigate to="/login" replace /> },
]);
