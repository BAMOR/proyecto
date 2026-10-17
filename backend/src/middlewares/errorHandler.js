function notFound(req, res) {
    res.status(404).json({ success: false, error: 'Ruta no encontrada' })
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
    console.error(err)

    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ success: false, error: 'El registro ya existe' })
    }

    if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.code === 'ER_ROW_IS_REFERENCED') {
        return res.status(400).json({ success: false, error: 'No se puede eliminar: hay otros registros que dependen de este' })
    }

    if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_NO_REFERENCED_ROW') {
        return res.status(400).json({ success: false, error: 'Referencia inválida: el registro relacionado no existe' })
    }

    const status = err.status || 500
    const message = err.status ? err.message : 'Error interno del servidor'

    res.status(status).json({ success: false, error: message })
}

module.exports = { notFound, errorHandler }
