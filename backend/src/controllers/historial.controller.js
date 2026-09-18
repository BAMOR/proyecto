const db = require('../config/db')
const AppError = require('../utils/AppError')
const { camposFaltantes } = require('../utils/validate')

async function crear(req, res) {
    const { pedido_id, estado_anterior, estado_nuevo, usuario_id, notas } = req.body
    const faltantes = camposFaltantes(req.body, ['pedido_id', 'estado_nuevo'])
    if (faltantes.length > 0) throw new AppError(400, 'pedido_id y estado_nuevo son obligatorios')

    const sql = 'INSERT INTO historial_estados (pedido_id, estado_anterior, estado_nuevo, usuario_id, notas) VALUES (?, ?, ?, ?, ?)'
    await db.query(sql, [pedido_id, estado_anterior, estado_nuevo, usuario_id, notas])

    res.status(201).json({ success: true, message: 'Estado actualizado en el historial' })
}

async function listarPorPedido(req, res) {
    const [result] = await db.query('SELECT * FROM historial_estados WHERE pedido_id = ?', [req.params.pedido_id])
    res.json({ success: true, historial: result })
}

module.exports = { crear, listarPorPedido }
