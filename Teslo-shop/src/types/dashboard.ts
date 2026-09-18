import type { Producto } from "./products";

export interface Stats {
    totalUsuarios: number;
    totalProductos: number;
    totalPedidos: number;
    ingresoTotal: number;
    pedidosHoy: number;
    stockBajo: number;
}

export interface UsuarioAdmin {
    id: number;
    nombre: string;
    email: string;
    rol: string;
    estado: string;
    fecha_creacion: string;
    total_pedidos: number;
}

export interface ProductoAdmin extends Producto {
    categoria: string;
}

export interface PedidoAdmin {
    id: number;
    numero_pedido: string;
    cliente: string;
    total: number;
    metodo_pago?: string;
    estado: string;
    estado_pago?: string;
    fecha_pedido: string;
}

export interface Categoria {
    id: number;
    nombre: string;
}

export const FORM_PRODUCTO_VACIO = {
    categoria_id: "",
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    sku: "",
    estado: "disponible",
    imagen_url: "",
};

export const FORM_USUARIO_VACIO = {
    nombre: "",
    email: "",
    password: "",
    rol: "vendedor",
    estado: "activo",
};

export type FormProducto = typeof FORM_PRODUCTO_VACIO;
export type FormUsuario = typeof FORM_USUARIO_VACIO;
