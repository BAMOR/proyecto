const db = require('../config/db')
const AppError = require('../utils/AppError')
const { camposFaltantes } = require('../utils/validate')

async function buscar(req, res) {
    const { q } = req.query
    if (!q || q.trim() === '') throw new AppError(400, 'Término de búsqueda requerido')

    const sql = `
        SELECT id, categoria_id, nombre, descripcion, precio, stock, sku, estado, imagen_url
        FROM productos
        WHERE nombre LIKE ? OR descripcion LIKE ? OR sku LIKE ?
        ORDER BY nombre ASC
    `
    const termino = `%${q.trim()}%`
    const [results] = await db.query(sql, [termino, termino, termino])
    res.json({ success: true, productos: results, total: results.length, termino: q })
}

async function listar(req, res) {
    const [result] = await db.query('SELECT * FROM productos')
    res.json({ success: true, productos: result, total: result.length })
}

async function obtenerPorId(req, res) {
    const [result] = await db.query('SELECT * FROM productos WHERE id = ?', [req.params.id])
    if (result.length === 0) throw new AppError(404, 'Producto no encontrado')
    res.json(result[0])
}

async function crear(req, res) {
    const { categoria_id, nombre, descripcion, precio, stock, sku, estado, imagen_url } = req.body
    const faltantes = camposFaltantes(req.body, ['nombre', 'precio'])
    if (faltantes.length > 0) throw new AppError(400, 'Nombre y precio son obligatorios')

    const sql = 'INSERT INTO productos (categoria_id, nombre, descripcion, precio, stock, sku, estado, imagen_url) VALUES (?,?,?,?,?,?,?,?)'
    const [result] = await db.query(sql, [categoria_id, nombre, descripcion, precio, stock, sku, estado || 'disponible', imagen_url || null])

    res.status(201).json({ success: true, message: 'Producto agregado correctamente', productId: result.insertId })
}

async function actualizar(req, res) {
    const { categoria_id, nombre, descripcion, precio, stock, sku, estado, imagen_url } = req.body
    const faltantes = camposFaltantes(req.body, ['nombre', 'precio'])
    if (faltantes.length > 0) throw new AppError(400, 'Nombre y precio son obligatorios')

    const sql = `
        UPDATE productos
        SET categoria_id=?, nombre=?, descripcion=?, precio=?, stock=?, sku=?, estado=?, imagen_url=?
        WHERE id=?
    `
    const [result] = await db.query(sql, [categoria_id, nombre, descripcion, precio, stock, sku, estado, imagen_url || null, req.params.id])
    if (result.affectedRows === 0) throw new AppError(404, 'Producto no encontrado')
    res.json({ success: true, message: 'Producto actualizado correctamente' })
}

async function eliminar(req, res) {
    const [result] = await db.query('DELETE FROM productos WHERE id = ?', [req.params.id])
    if (result.affectedRows === 0) throw new AppError(404, 'Producto no encontrado')
    res.json({ success: true, message: 'Producto eliminado correctamente' })
}

module.exports = { buscar, listar, obtenerPorId, crear, actualizar, eliminar }
