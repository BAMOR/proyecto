const express = require('express')
const router = express.Router()
const db = require('../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// ========================================================
// 🔐 ENDPOINTS DE AUTENTICACIÓN (LOGIN Y REGISTRO)
// ========================================================

// 📝 1. Registro de Usuarios (Encriptando Contraseña)
router.post('/api/auth/register', async (req, res) => {
    const { nombre, email, password, rol, estado } = req.body

    // Validar datos básicos requeridos
    if (!nombre || !email || !password) {
        return res.status(400).json({ 
            success: false, 
            error: 'Nombre, email y contraseña son obligatorios' 
        })
    }

    try {
        // Encriptar la contraseña (genera un hash seguro)
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const sql = 'INSERT INTO usuarios (nombre, email, password, rol, estado) VALUES (?, ?, ?, ?, ?)'
        
        // El rol por defecto será 'cliente' y estado 'activo' si no se envían
        const userRol = rol || 'cliente'
        const userEstado = estado || 'activo'

        db.query(sql, [nombre, email, hashedPassword, userRol, userEstado], (err, result) => {
            if (err) {
                console.error('Error al registrar usuario:', err.message)
                // Si el email ya existe lanzará un error de duplicado (código ER_DUP_ENTRY)
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ 
                        success: false, 
                        error: 'El correo electrónico ya está registrado' 
                    })
                }
                return res.status(500).json({ 
                    success: false, 
                    error: 'Error interno en la base de datos' 
                })
            }

            res.status(201).json({
                success: true,
                message: 'Usuario registrado correctamente',
                userId: result.insertId
            })
        })
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error al procesar la contraseña' })
    }
})

// 🔑 2. Inicio de Sesión (Generando Token JWT)
router.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            error: 'Email y contraseña requeridos' 
        })
    }

    // Buscar al usuario por el correo electrónico
    const sql = 'SELECT * FROM usuarios WHERE email = ?'
    
    db.query(sql, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, error: 'Error en la consulta a la BD' })
        }

        // Si no se encuentra el usuario
        if (results.length === 0) {
            return res.status(401).json({ 
                success: false, 
                error: 'Credenciales inválidas (Correo o contraseña incorrectos)' 
            })
        }

        const usuario = results[0]

        // Verificar si el usuario está activo (si manejas estados)
        if (usuario.estado === 'inactivo') {
            return res.status(403).json({ 
                success: false, 
                error: 'Tu usuario se encuentra deshabilitado' 
            })
        }

        try {
            // Comparar la contraseña ingresada con el Hash guardado en la base de datos
            const isMatch = await bcrypt.compare(password, usuario.password)
            
            if (!isMatch) {
                return res.status(401).json({ 
                    success: false, 
                    error: 'Credenciales inválidas (Correo o contraseña incorrectos)' 
                })
            }

            // Crear el Payload del Token con los datos esenciales
            const payload = {
                id: usuario.id,
                nombre: usuario.nombre,
                rol: usuario.rol
            }

            // Firmar el Token JWT usando tu palabra secreta del archivo .env (Expira en 8 horas)
            const token = jwt.sign(payload, process.env.JWT_SECRET || 'ClaveSecretaDeRespaldoPorSiAcaso123!', { expiresIn: '8h' })

            // Enviar respuesta exitosa con el token y datos del usuario (menos el password)
            res.json({
                success: true,
                message: 'Inicio de sesión exitoso',
                token,
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    rol: usuario.rol
                }
            })

        } catch (error) {
            res.status(500).json({ success: false, error: 'Error al validar las credenciales' })
        }
    })
})

// ========================================================
// 👥 ENDPOINTS MANTENIMIENTO (TUS RUTAS ANTERIORES)
// ========================================================

router.get('/api/usuarios', (req, res) => {
    const sql = 'SELECT id, nombre, email, rol, estado, created_at FROM usuarios'
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la consulta a la BD' })
        }
        res.json({
            usuarios: result,
            total: result.length
        })
    })
})

router.get('/api/usuarios/:id', (req, res) => {
    const id = req.params.id 
    const sql = 'SELECT id, nombre, email, rol, estado, created_at FROM usuarios WHERE id = ?'

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la consulta a la DB' })
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' })
        }
        res.json(result[0])
    })
})

// Mantenemos tu post original por compatibilidad, pero encriptando el password
router.post('/api/usuarios', async (req, res) => {
    const { nombre, email, password, rol, estado } = req.body
    
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        
        const sql = 'INSERT INTO usuarios (nombre, email, password, rol, estado) VALUES (?, ?, ?, ?, ?)'
        db.query(sql, [nombre, email, hashedPassword, rol, estado], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error en la consulta a la DB' })
            }
            res.status(201).json({
                success: true,
                message: 'Usuario agregado correctamente',
                userId: result.insertId
            })
        })
    } catch (e) {
        res.status(500).json({ error: 'Error al procesar la contraseña' })
    }
})

router.delete('/api/usuarios/:id', (req, res) => {
    const id = req.params.id
    const sql = 'DELETE FROM usuarios WHERE id = ?'

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la consulta DB' })
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' })
        }
        res.json({ success: true, message: 'Usuario eliminado correctamente' })
    })
})

module.exports = router