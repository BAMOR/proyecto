const db = require('../config/db')
const AppError = require('../utils/AppError')
const { camposFaltantes } = require('../utils/validate')

async function listar(req, res) {
    const [result] = await db.query('SELECT * FROM clientes')
    res.json({ success: true, clientes: result, total: result.length })
}

async function obtenerPorId(req, res) {
    const [result] = await db.query('SELECT * FROM clientes WHERE id = ?', [req.params.id])
    if (result.length === 0) throw new AppError(404, 'Cliente no encontrado')
    res.json(result[0])
}

async function crear(req, res) {
    const { usuario_id, nombre, email, telefono, direccion, ciudad, codigo_postal } = req.body
    const faltantes = camposFaltantes(req.body, ['nombre', 'email'])
    if (faltantes.length > 0) throw new AppError(400, 'Nombre y email son obligatorios')

    const sql = 'INSERT INTO clientes (usuario_id, nombre, email, telefono, direccion, ciudad, codigo_postal) VALUES (?,?,?,?,?,?,?)'
    const [result] = await db.query(sql, [usuario_id, nombre, email, telefono, direccion, ciudad, codigo_postal])

    res.status(201).json({ success: true, message: 'Cliente agregado correctamente', clienteId: result.insertId })
}

async function eliminar(req, res) {
    const [result] = await db.query('DELETE FROM clientes WHERE id = ?', [req.params.id])
    if (result.affectedRows === 0) throw new AppError(404, 'Cliente no encontrado')
    res.json({ success: true, message: 'Cliente eliminado correctamente' })
}

module.exports = { listar, obtenerPorId, crear, eliminar }
