const bcrypt = require('bcryptjs')
const db = require('../config/db')
const AppError = require('../utils/AppError')
const { camposFaltantes } = require('../utils/validate')

async function listar(req, res) {
    const sql = 'SELECT id, nombre, email, rol, estado, fecha_creacion FROM usuarios ORDER BY fecha_creacion DESC'
    const [result] = await db.query(sql)
    res.json({ success: true, usuarios: result, total: result.length })
}

async function obtenerPorId(req, res) {
    const sql = 'SELECT id, nombre, email, rol, estado, fecha_creacion FROM usuarios WHERE id = ?'
    const [result] = await db.query(sql, [req.params.id])
    if (result.length === 0) throw new AppError(404, 'Usuario no encontrado')
    res.json(result[0])
}

async function crear(req, res) {
    const { nombre, email, password, rol, estado } = req.body
    const faltantes = camposFaltantes(req.body, ['nombre', 'email', 'password'])
    if (faltantes.length > 0) {
        throw new AppError(400, 'Nombre, email y contraseña son obligatorios')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const sql = 'INSERT INTO usuarios (nombre, email, password, rol, estado) VALUES (?, ?, ?, ?, ?)'
    const [result] = await db.query(sql, [nombre, email, hashedPassword, rol || 'cliente', estado || 'activo'])

    res.status(201).json({ success: true, message: 'Usuario agregado correctamente', userId: result.insertId })
}

async function actualizar(req, res) {
    const { nombre, email, password, rol, estado } = req.body
    const faltantes = camposFaltantes(req.body, ['nombre', 'email'])
    if (faltantes.length > 0) {
        throw new AppError(400, 'Nombre y email son obligatorios')
    }

    let sql
    let params
    if (password && password.trim() !== '') {
        const hashedPassword = await bcrypt.hash(password, 10)
        sql = 'UPDATE usuarios SET nombre=?, email=?, password=?, rol=?, estado=? WHERE id=?'
        params = [nombre, email, hashedPassword, rol || 'cliente', estado || 'activo', req.params.id]
    } else {
        sql = 'UPDATE usuarios SET nombre=?, email=?, rol=?, estado=? WHERE id=?'
        params = [nombre, email, rol || 'cliente', estado || 'activo', req.params.id]
    }

    const [result] = await db.query(sql, params)
    if (result.affectedRows === 0) throw new AppError(404, 'Usuario no encontrado')
    res.json({ success: true, message: 'Usuario actualizado correctamente' })
}

async function eliminar(req, res) {
    const [result] = await db.query('DELETE FROM usuarios WHERE id = ?', [req.params.id])
    if (result.affectedRows === 0) throw new AppError(404, 'Usuario no encontrado')
    res.json({ success: true, message: 'Usuario eliminado correctamente' })
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar }
