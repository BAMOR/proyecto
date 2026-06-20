// backend/src/routes/dashboardR.js
const express = require('express')
const router = express.Router()
const db = require('../config/db')

// GET /api/dashboard/stats — Tarjetas de resumen
router.get('/api/dashboard/stats', (req, res) => {
    const queries = {
        totalUsuarios:   'SELECT COUNT(*) as total FROM usuarios',
        totalProductos:  'SELECT COUNT(*) as total FROM productos WHERE estado != "inactivo"',
        totalPedidos:    'SELECT COUNT(*) as total FROM pedidos',
        ingresoTotal:    'SELECT COALESCE(SUM(total), 0) as total FROM pedidos WHERE estado != "cancelado"',
        pedidosHoy:      'SELECT COUNT(*) as total FROM pedidos WHERE DATE(fecha_pedido) = CURDATE()',
        stockBajo:       'SELECT COUNT(*) as total FROM productos WHERE stock <= 5 AND estado != "inactivo"',
    }

    const results = {}
    const keys = Object.keys(queries)
    let completed = 0

    keys.forEach(key => {
        db.query(queries[key], (err, rows) => {
            if (err) return res.status(500).json({ error: 'Error en stats: ' + key })
            results[key] = key === 'ingresoTotal'
                ? parseFloat(rows[0].total)
                : rows[0].total
            completed++
            if (completed === keys.length) res.json({ success: true, stats: results })
        })
    })
})

// GET /api/dashboard/usuarios — Tabla usuarios
router.get('/api/dashboard/usuarios', (req, res) => {
    const sql = `
        SELECT 
            u.id, u.nombre, u.email, u.rol, u.estado, u.fecha_creacion,
            COUNT(p.id) as total_pedidos
        FROM usuarios u
        LEFT JOIN pedidos p ON p.usuario_id = u.id
        GROUP BY u.id
        ORDER BY u.fecha_creacion DESC
    `
    db.query(sql, (err, rows) => {
        if (err) return res.status(500).json({ error: 'Error al obtener usuarios' })
        res.json({ success: true, usuarios: rows })
    })
})

// GET /api/dashboard/productos — Tabla productos
router.get('/api/dashboard/productos', (req, res) => {
    const sql = `
        SELECT 
            p.id, p.sku, p.nombre, p.precio, p.stock, p.estado,
            c.nombre as categoria
        FROM productos p
        LEFT JOIN categorias c ON c.id = p.categoria_id
        ORDER BY p.fecha_creacion DESC
    `
    db.query(sql, (err, rows) => {
        if (err) return res.status(500).json({ error: 'Error al obtener productos' })
        res.json({ success: true, productos: rows })
    })
})

// GET /api/dashboard/pedidos — Tabla pedidos
router.get('/api/dashboard/pedidos', (req, res) => {
    const sql = `
        SELECT 
            p.id, p.numero_pedido, p.estado, p.total,
            p.metodo_pago, p.estado_pago, p.fecha_pedido,
            cl.nombre as cliente
        FROM pedidos p
        LEFT JOIN clientes cl ON cl.id = p.cliente_id
        ORDER BY p.fecha_pedido DESC
        LIMIT 50
    `
    db.query(sql, (err, rows) => {
        if (err) return res.status(500).json({ error: 'Error al obtener pedidos' })
        res.json({ success: true, pedidos: rows })
    })
})

module.exports = router