const db = require('../config/db')

const STATS_QUERIES = {
    totalUsuarios: 'SELECT COUNT(*) as total FROM usuarios',
    totalProductos: 'SELECT COUNT(*) as total FROM productos WHERE estado != "inactivo"',
    totalPedidos: 'SELECT COUNT(*) as total FROM pedidos',
    ingresoTotal: 'SELECT COALESCE(SUM(total), 0) as total FROM pedidos WHERE estado != "cancelado"',
    pedidosHoy: 'SELECT COUNT(*) as total FROM pedidos WHERE DATE(fecha_pedido) = CURDATE()',
    stockBajo: 'SELECT COUNT(*) as total FROM productos WHERE stock <= 5 AND estado != "inactivo"'
}

async function stats(req, res) {
    const claves = Object.keys(STATS_QUERIES)
    const filas = await Promise.all(claves.map((clave) => db.query(STATS_QUERIES[clave])))

    const resultados = {}
    claves.forEach((clave, i) => {
        const [rows] = filas[i]
        resultados[clave] = clave === 'ingresoTotal' ? parseFloat(rows[0].total) : rows[0].total
    })

    res.json({ success: true, stats: resultados })
}

async function usuarios(req, res) {
    const sql = `
        SELECT
            u.id, u.nombre, u.email, u.rol, u.estado, u.fecha_creacion,
            COUNT(p.id) as total_pedidos
        FROM usuarios u
        LEFT JOIN pedidos p ON p.usuario_id = u.id
        GROUP BY u.id
        ORDER BY u.fecha_creacion DESC
    `
    const [rows] = await db.query(sql)
    res.json({ success: true, usuarios: rows })
}

async function productos(req, res) {
    const sql = `
        SELECT
            p.id, p.sku, p.nombre, p.precio, p.stock, p.estado,
            c.nombre as categoria
        FROM productos p
        LEFT JOIN categorias c ON c.id = p.categoria_id
        ORDER BY p.fecha_creacion DESC
    `
    const [rows] = await db.query(sql)
    res.json({ success: true, productos: rows })
}

async function pedidos(req, res) {
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
    const [rows] = await db.query(sql)
    res.json({ success: true, pedidos: rows })
}

module.exports = { stats, usuarios, productos, pedidos }
