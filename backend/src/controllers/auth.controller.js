const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../config/db')
const AppError = require('../utils/AppError')

async function login(req, res) {
    const { email, password } = req.body
    if (!email || !password) throw new AppError(400, 'Email y contraseña requeridos')

    const [results] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email])
    if (results.length === 0) throw new AppError(401, 'Credenciales inválidas (Correo o contraseña incorrectos)')

    const usuario = results[0]
    if (usuario.estado === 'inactivo') throw new AppError(403, 'Tu usuario se encuentra deshabilitado')
    if (usuario.rol === 'cliente') throw new AppError(403, 'Tu cuenta no tiene acceso a este sistema. Contacta a un administrador.')

    const isMatch = await bcrypt.compare(password, usuario.password)
    if (!isMatch) throw new AppError(401, 'Credenciales inválidas (Correo o contraseña incorrectos)')

    const token = jwt.sign(
        { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
    )

    res.json({
        success: true,
        message: 'Inicio de sesión exitoso',
        token,
        usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
    })
}

module.exports = { login }
