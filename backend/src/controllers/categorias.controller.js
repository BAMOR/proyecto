const db = require('../config/db')
const AppError = require('../utils/AppError')
const { camposFaltantes } = require('../utils/validate')

async function listar(req, res) {
    const [result] = await db.query('SELECT * FROM categorias')
    res.json({ success: true, categories: result, total: result.length })
}

async function obtenerPorId(req, res) {
    const [result] = await db.query('SELECT * FROM categorias WHERE id = ?', [req.params.id])
    if (result.length === 0) throw new AppError(404, 'Categoría no encontrada')
    res.json(result[0])
}

async function crear(req, res) {
    const { nombre, descripcion, estado } = req.body
    const faltantes = camposFaltantes(req.body, ['nombre'])
    if (faltantes.length > 0) throw new AppError(400, 'El nombre es obligatorio')

    const sql = 'INSERT INTO categorias (nombre, descripcion, estado) VALUES (?, ?, ?)'
    const [result] = await db.query(sql, [nombre, descripcion, estado])

    res.status(201).json({ success: true, message: 'Categoria agregada exitosamente', categoriaId: result.insertId })
}

async function eliminar(req, res) {
    const [result] = await db.query('DELETE FROM categorias WHERE id = ?', [req.params.id])
    if (result.affectedRows === 0) throw new AppError(404, 'Categoría no encontrada')
    res.json({ success: true, message: 'Categoría eliminada correctamente' })
}

module.exports = { listar, obtenerPorId, crear, eliminar }
