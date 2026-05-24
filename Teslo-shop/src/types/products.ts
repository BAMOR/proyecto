export interface Producto{
    id: number,
    categoria_id: number,
    nombre: string,
    descripcion: string,
    precio: number,
    stock: number,
    sku: string,
    imagen_url?: string
    estado: 'disponible' | 'agotado' | 'descontinuado';
    created_at?: string;
}

export interface ProductosResponse{
    success: boolean,
    productos: Producto[],
    total: number
}