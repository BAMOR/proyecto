const db = require('../config/db')
const AppError = require('../utils/AppError')
const { camposFaltantes } = require('../utils/validate')

async function listar(req, res) {
    const [result] = await db.query('SELECT * FROM carrito')
    res.json({ success: true, carrito: result, total: result.length })
}

async function obtenerPorId(req, res) {
    const [result] = await db.query('SELECT * FROM carrito WHERE id = ?', [req.params.id])
    if (result.length === 0) throw new AppError(404, 'Elemento de carrito no encontrado')
    res.json(result[0])
}

async function crear(req, res) {
    const { cliente_id, producto_id, cantidad } = req.body
    const faltantes = camposFaltantes(req.body, ['cliente_id', 'producto_id', 'cantidad'])
    if (faltantes.length > 0) throw new AppError(400, 'cliente_id, producto_id y cantidad son obligatorios')

    const sql = 'INSERT INTO carrito (cliente_id, producto, cantidad) VALUES (?, ?, ?)'
    const [result] = await db.query(sql, [cliente_id, producto_id, cantidad])

    res.status(201).json({ success: true, message: 'Carrito agregado exitosamente', carritoId: result.insertId })
}

async function eliminar(req, res) {
    const [result] = await db.query('DELETE FROM carrito WHERE id = ?', [req.params.id])
    if (result.affectedRows === 0) throw new AppError(404, 'Elemento de carrito no encontrado')
    res.json({ success: true, message: 'Elemento eliminado del carrito correctamente' })
}

module.exports = { listar, obtenerPorId, crear, eliminar }
