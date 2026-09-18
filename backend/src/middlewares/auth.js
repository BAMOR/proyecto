const jwt = require('jsonwebtoken')

function verificarToken(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, error: 'Token no proporcionado' })
    }

    const token = authHeader.slice('Bearer '.length)

    try {
        req.usuario = jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch (error) {
        return res.status(401).json({ success: false, error: 'Token inválido o expirado' })
    }
}

function verificarRol(...rolesPermitidos) {
    return (req, res, next) => {
        if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({ success: false, error: 'No tienes permisos para realizar esta acción' })
        }
        next()
    }
}

module.exports = { verificarToken, verificarRol }
