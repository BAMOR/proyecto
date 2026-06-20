const express = require('express')
const router = express.Router()
const db = require('../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// ========================================================
// 🔐 AUTENTICACIÓN
// ========================================================

router.post('/api/auth/register', async (req, res) => {
    const { nombre, email, password, rol, estado } = req.body
    if (!nombre || !email || !password) {
        return res.status(400).json({ success: false, error: 'Nombre, email y contraseña son obligatorios' })
    }
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const sql = 'INSERT INTO usuarios (nombre, email, password, rol, estado) VALUES (?, ?, ?, ?, ?)'
        db.query(sql, [nombre, email, hashedPassword, rol || 'cliente', estado || 'activo'], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ success: false, error: 'El correo electrónico ya está registrado' })
                return res.status(500).json({ success: false, error: 'Error interno en la base de datos' })
            }
            res.status(201).json({ success: true, message: 'Usuario registrado correctamente', userId: result.insertId })
        })
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error al procesar la contraseña' })
    }
})

router.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ success: false, error: 'Email y contraseña requeridos' })

    db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ success: false, error: 'Error en la consulta a la BD' })
        if (results.length === 0) return res.status(401).json({ success: false, error: 'Credenciales inválidas (Correo o contraseña incorrectos)' })

        const usuario = results[0]
        if (usuario.estado === 'inactivo') return res.status(403).json({ success: false, error: 'Tu usuario se encuentra deshabilitado' })

        try {
            const isMatch = await bcrypt.compare(password, usuario.password)
            if (!isMatch) return res.status(401).json({ success: false, error: 'Credenciales inválidas (Correo o contraseña incorrectos)' })

            const token = jwt.sign(
                { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
                process.env.JWT_SECRET || 'ClaveSecretaDeRespaldoPorSiAcaso123!',
                { expiresIn: '8h' }
            )
            res.json({
                success: true,
                message: 'Inicio de sesión exitoso',
                token,
                usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
            })
        } catch (error) {
            res.status(500).json({ success: false, error: 'Error al validar las credenciales' })
        }
    })
})

// ========================================================
// 👥 CRUD USUARIOS
// ========================================================

// GET todos
router.get('/api/usuarios', (req, res) => {
    const sql = 'SELECT id, nombre, email, rol, estado, fecha_creacion FROM usuarios ORDER BY fecha_creacion DESC'
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: 'Error en la consulta a la BD' })
        res.json({ success: true, usuarios: result, total: result.length })
    })
})

// GET por id
router.get('/api/usuarios/:id', (req, res) => {
    db.query('SELECT id, nombre, email, rol, estado, fecha_creacion FROM usuarios WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error en la consulta a la DB' })
        if (result.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' })
        res.json(result[0])
    })
})

// POST crear usuario desde el dashboard (admin crea usuarios manualmente)
router.post('/api/usuarios', async (req, res) => {
    const { nombre, email, password, rol, estado } = req.body
    if (!nombre || !email || !password) {
        return res.status(400).json({ success: false, error: 'Nombre, email y contraseña son obligatorios' })
    }
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const sql = 'INSERT INTO usuarios (nombre, email, password, rol, estado) VALUES (?, ?, ?, ?, ?)'
        db.query(sql, [nombre, email, hashedPassword, rol || 'cliente', estado || 'activo'], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ success: false, error: 'El correo electrónico ya está registrado' })
                return res.status(500).json({ error: 'Error en la consulta a la DB' })
            }
            res.status(201).json({ success: true, message: 'Usuario agregado correctamente', userId: result.insertId })
        })
    } catch (e) {
        res.status(500).json({ error: 'Error al procesar la contraseña' })
    }
})

// PUT editar usuario (sin tocar password si no se envía)
router.put('/api/usuarios/:id', async (req, res) => {
    const { nombre, email, password, rol, estado } = req.body
    if (!nombre || !email) {
        return res.status(400).json({ success: false, error: 'Nombre y email son obligatorios' })
    }
    try {
        // Si mandan nueva contraseña la encriptamos, si no la dejamos como está
        if (password && password.trim() !== '') {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            const sql = 'UPDATE usuarios SET nombre=?, email=?, password=?, rol=?, estado=? WHERE id=?'
            db.query(sql, [nombre, email, hashedPassword, rol || 'cliente', estado || 'activo', req.params.id], (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ success: false, error: 'El correo electrónico ya está en uso' })
                    return res.status(500).json({ error: 'Error al actualizar usuario', detail: err.message })
                }
                if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' })
                res.json({ success: true, message: 'Usuario actualizado correctamente' })
            })
        } else {
            // Sin cambiar contraseña
            const sql = 'UPDATE usuarios SET nombre=?, email=?, rol=?, estado=? WHERE id=?'
            db.query(sql, [nombre, email, rol || 'cliente', estado || 'activo', req.params.id], (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ success: false, error: 'El correo electrónico ya está en uso' })
                    return res.status(500).json({ error: 'Error al actualizar usuario', detail: err.message })
                }
                if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' })
                res.json({ success: true, message: 'Usuario actualizado correctamente' })
            })
        }
    } catch (e) {
        res.status(500).json({ error: 'Error al procesar la contraseña' })
    }
})

// DELETE eliminar usuario
router.delete('/api/usuarios/:id', (req, res) => {
    db.query('DELETE FROM usuarios WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error en la consulta DB' })
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' })
        res.json({ success: true, message: 'Usuario eliminado correctamente' })
    })
})

module.exports = router