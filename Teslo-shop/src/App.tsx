// src/App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router-dom";
import { AppRouter } from "./router/AppRouter";
import { AuthProvider } from "./context/AuthContext"; // 👈 Importamos tu nuevo contexto de login

const queryClient = new QueryClient();

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider> {/* 👈 Envolvemos aquí para darle acceso de login a todas las rutas */}
        <RouterProvider router={AppRouter} />
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} /> 
    </QueryClientProvider>
  );
};