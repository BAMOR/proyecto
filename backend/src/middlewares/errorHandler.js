function notFound(req, res) {
    res.status(404).json({ success: false, error: 'Ruta no encontrada' })
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
    console.error(err)

    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ success: false, error: 'El registro ya existe' })
    }

    const status = err.status || 500
    const message = err.status ? err.message : 'Error interno del servidor'

    res.status(status).json({ success: false, error: message })
}

module.exports = { notFound, errorHandler }
