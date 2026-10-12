const db = require('../config/db')

async function listarPorPedido(req, res) {
    const [result] = await db.query(
        'SELECT * FROM historial_estados WHERE pedido_id = ? ORDER BY id ASC',
        [req.params.pedido_id]
    )
    res.json({ success: true, historial: result })
}

module.exports = { listarPorPedido }
