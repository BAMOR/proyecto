const express = require('express')
const router = express.Router()
const db = require('../config/db')

// GET buscar productos
router.get('/api/productos/buscar', (req, res) => {
    const { q } = req.query
    if (!q || q.trim() === '') {
        return res.status(400).json({ success: false, error: 'Término de búsqueda requerido' })
    }
    const sql = `
        SELECT id, categoria_id, nombre, descripcion, precio, stock, sku, estado, imagen_url
        FROM productos
        WHERE nombre LIKE ? OR descripcion LIKE ? OR sku LIKE ?
        ORDER BY nombre ASC
    `
    const t = `%${q.trim()}%`
    db.query(sql, [t, t, t], (err, results) => {
        if (err) return res.status(500).json({ success: false, error: 'Error al buscar productos', sqlError: err.message })
        res.json({ success: true, productos: results, total: results.length, termino: q })
    })
})

// GET todos los productos
router.get('/api/productos', (req, res) => {
    const sql = 'SELECT * FROM productos'
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al consultar la base de datos' })
        res.json({ success: true, productos: result, total: result.length })
    })
})

// GET producto por id
router.get('/api/productos/:id', (req, res) => {
    const sql = 'SELECT * FROM productos WHERE id = ?'
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error en la consulta' })
        if (result.length === 0) return res.status(404).json({ error: 'Producto no encontrado' })
        res.json(result[0])
    })
})

// POST crear producto (con imagen_url)
router.post('/api/productos', (req, res) => {
    const { categoria_id, nombre, descripcion, precio, stock, sku, estado, imagen_url } = req.body
    const sql = 'INSERT INTO productos (categoria_id, nombre, descripcion, precio, stock, sku, estado, imagen_url) VALUES (?,?,?,?,?,?,?,?)'
    db.query(sql, [categoria_id, nombre, descripcion, precio, stock, sku, estado || 'disponible', imagen_url || null], (err, result) => {
        if (err) {
            console.error('Error al crear producto:', err)
            return res.status(500).json({ error: 'Error en la consulta SQL', detail: err.message })
        }
        res.status(201).json({ success: true, message: 'Producto agregado correctamente', productId: result.insertId })
    })
})

// PUT editar producto (con imagen_url)
router.put('/api/productos/:id', (req, res) => {
    const { categoria_id, nombre, descripcion, precio, stock, sku, estado, imagen_url } = req.body
    const sql = `
        UPDATE productos 
        SET categoria_id=?, nombre=?, descripcion=?, precio=?, stock=?, sku=?, estado=?, imagen_url=?
        WHERE id=?
    `
    db.query(sql, [categoria_id, nombre, descripcion, precio, stock, sku, estado, imagen_url || null, req.params.id], (err, result) => {
        if (err) {
            console.error('Error al editar producto:', err)
            return res.status(500).json({ error: 'Error al actualizar', detail: err.message })
        }
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Producto no encontrado' })
        res.json({ success: true, message: 'Producto actualizado correctamente' })
    })
})

// DELETE eliminar producto
router.delete('/api/productos/:id', (req, res) => {
    const sql = 'DELETE FROM productos WHERE id = ?'
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error en consulta SQL' })
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Producto no encontrado' })
        res.json({ success: true, message: 'Producto eliminado correctamente' })
    })
})

module.exports = router