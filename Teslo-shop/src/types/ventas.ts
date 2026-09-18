import type { Producto } from "./products";

export interface Cliente {
    id: number;
    usuario_id: number | null;
    nombre: string;
    email: string;
    telefono?: string;
    direccion?: string;
    ciudad?: string;
    codigo_postal?: string;
    pais?: string;
    fecha_registro: string;
}

export interface ClientesResponse {
    success: boolean;
    clientes: Cliente[];
    total: number;
}

export const FORM_CLIENTE_VACIO = {
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    codigo_postal: "",
};
export type FormCliente = typeof FORM_CLIENTE_VACIO;

// Línea de venta en construcción: un producto + la cantidad elegida
export type VentaItem = Producto & { cantidad: number };

export type VentaActions =
    | { type: "add-item"; payload: { producto: Producto } }
    | { type: "remove-item"; payload: { id: number } }
    | { type: "decrease-quantity"; payload: { id: number } }
    | { type: "clear" };

export interface VentaDraftState {
    items: VentaItem[];
}

export interface CrearVentaPayload {
    cliente_id: number;
    metodo_pago: string;
    items: { producto_id: number; cantidad: number }[];
}

export interface CrearVentaResponse {
    success: boolean;
    message: string;
    pedidoId: number;
    numero_pedido: string;
    subtotal: number;
    impuesto: number;
    total: number;
}
