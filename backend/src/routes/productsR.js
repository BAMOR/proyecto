const express = require('express')
const router = express.Router()
const productosController = require('../controllers/productos.controller')
const { verificarToken, verificarRol } = require('../middlewares/auth')

// Público
router.get('/api/productos/buscar', productosController.buscar)
router.get('/api/productos', productosController.listar)
router.get('/api/productos/:id', productosController.obtenerPorId)

// Solo admin
router.post('/api/productos', verificarToken, verificarRol('admin'), productosController.crear)
router.put('/api/productos/:id', verificarToken, verificarRol('admin'), productosController.actualizar)
router.delete('/api/productos/:id', verificarToken, verificarRol('admin'), productosController.eliminar)

module.exports = router
