const db = require('../config/db')
const AppError = require('../utils/AppError')
const { camposFaltantes } = require('../utils/validate')

async function crear(req, res) {
    const { pedido_id, producto_id, cantidad, precio_unitario, subtotal } = req.body
    const faltantes = camposFaltantes(req.body, ['pedido_id', 'producto_id', 'cantidad', 'precio_unitario'])
    if (faltantes.length > 0) throw new AppError(400, 'pedido_id, producto_id, cantidad y precio_unitario son obligatorios')

    const sql = 'INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)'
    await db.query(sql, [pedido_id, producto_id, cantidad, precio_unitario, subtotal])

    res.status(201).json({ success: true, message: 'Producto registrado en el pedido' })
}

async function listarPorPedido(req, res) {
    const [result] = await db.query('SELECT * FROM detalle_pedido WHERE pedido_id = ?', [req.params.pedido_id])
    res.json({ success: true, detalle: result })
}

module.exports = { crear, listarPorPedido }
