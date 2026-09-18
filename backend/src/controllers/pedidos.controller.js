const db = require('../config/db')
const AppError = require('../utils/AppError')
const { camposFaltantes } = require('../utils/validate')

const IVA = 0.12

async function listar(req, res) {
    const { cliente_id } = req.query

    // La vista no expone cliente_id (solo el nombre ya unido), así que el filtro
    // por cliente se resuelve contra la tabla base.
    if (cliente_id) {
        const [result] = await db.query(
            `SELECT p.id, p.numero_pedido, p.estado, p.total, p.fecha_pedido, c.nombre AS cliente
             FROM pedidos p
             JOIN clientes c ON c.id = p.cliente_id
             WHERE p.cliente_id = ?
             ORDER BY p.fecha_pedido DESC`,
            [cliente_id]
        )
        return res.json({ success: true, pedidos: result })
    }

    const [result] = await db.query('SELECT * FROM vista_pedidos_completo ORDER BY fecha_pedido DESC')
    res.json({ success: true, pedidos: result })
}

// Registra una venta de forma atómica: valida stock, calcula precios en servidor,
// inserta el pedido y su detalle, y descuenta inventario, todo o nada.
async function crear(req, res) {
    const { cliente_id, metodo_pago, items } = req.body
    const faltantes = camposFaltantes(req.body, ['cliente_id', 'items'])
    if (faltantes.length > 0) throw new AppError(400, 'cliente_id e items son obligatorios')
    if (!Array.isArray(items) || items.length === 0) throw new AppError(400, 'La venta debe incluir al menos un producto')

    const connection = await db.getConnection()
    try {
        await connection.beginTransaction()

        let subtotal = 0
        const lineas = []

        for (const item of items) {
            const { producto_id, cantidad } = item
            if (!producto_id || !cantidad || cantidad <= 0) {
                throw new AppError(400, 'Cada producto debe tener producto_id y cantidad válidos')
            }

            const [rows] = await connection.query(
                'SELECT id, nombre, precio, stock FROM productos WHERE id = ? FOR UPDATE',
                [producto_id]
            )
            if (rows.length === 0) throw new AppError(404, `Producto ${producto_id} no encontrado`)

            const producto = rows[0]
            if (producto.stock < cantidad) {
                throw new AppError(400, `Stock insuficiente para "${producto.nombre}" (disponible: ${producto.stock})`)
            }

            const precio_unitario = Number(producto.precio)
            const subtotalLinea = precio_unitario * cantidad
            subtotal += subtotalLinea

            lineas.push({ producto_id, cantidad, precio_unitario, subtotal: subtotalLinea })
        }

        const impuesto = subtotal * IVA
        const total = subtotal + impuesto
        const numero_pedido = 'ORD-' + Date.now()

        const [pedidoResult] = await connection.query(
            `INSERT INTO pedidos (cliente_id, usuario_id, numero_pedido, subtotal, impuesto, envio, total, metodo_pago, estado, estado_pago)
             VALUES (?, ?, ?, ?, ?, 0, ?, ?, 'confirmado', 'pagado')`,
            [cliente_id, req.usuario.id, numero_pedido, subtotal, impuesto, total, metodo_pago || 'efectivo']
        )
        const pedidoId = pedidoResult.insertId

        for (const linea of lineas) {
            await connection.query(
                'INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
                [pedidoId, linea.producto_id, linea.cantidad, linea.precio_unitario, linea.subtotal]
            )
            await connection.query('UPDATE productos SET stock = stock - ? WHERE id = ?', [linea.cantidad, linea.producto_id])
        }

        await connection.commit()

        res.status(201).json({ success: true, message: 'Venta registrada', pedidoId, numero_pedido, subtotal, impuesto, total })
    } catch (error) {
        await connection.rollback()
        throw error
    } finally {
        connection.release()
    }
}

// Anula una venta: restaura el stock de cada línea y marca el pedido como cancelado,
// en vez de borrar el registro (preserva trazabilidad).
async function anular(req, res) {
    const connection = await db.getConnection()
    try {
        await connection.beginTransaction()

        const [pedidos] = await connection.query('SELECT id, estado FROM pedidos WHERE id = ? FOR UPDATE', [req.params.id])
        if (pedidos.length === 0) throw new AppError(404, 'Pedido no encontrado')
        if (pedidos[0].estado === 'cancelado') throw new AppError(400, 'El pedido ya está anulado')

        const [detalle] = await connection.query('SELECT producto_id, cantidad FROM detalle_pedido WHERE pedido_id = ?', [req.params.id])
        for (const linea of detalle) {
            await connection.query('UPDATE productos SET stock = stock + ? WHERE id = ?', [linea.cantidad, linea.producto_id])
        }

        await connection.query("UPDATE pedidos SET estado = 'cancelado' WHERE id = ?", [req.params.id])
        await connection.commit()

        res.json({ success: true, message: 'Pedido anulado correctamente' })
    } catch (error) {
        await connection.rollback()
        throw error
    } finally {
        connection.release()
    }
}

module.exports = { listar, crear, anular }
