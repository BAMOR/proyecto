const db = require('../config/db')

async function listarPorPedido(req, res) {
    const [result] = await db.query('SELECT * FROM detalle_pedido WHERE pedido_id = ?', [req.params.pedido_id])
    res.json({ success: true, detalle: result })
}

module.exports = { listarPorPedido }
