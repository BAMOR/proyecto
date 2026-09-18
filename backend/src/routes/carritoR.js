const express = require('express')
const router = express.Router()
const carritoController = require('../controllers/carrito.controller')
const { verificarToken } = require('../middlewares/auth')

router.get('/api/carrito', verificarToken, carritoController.listar)
router.get('/api/carrito/:id', verificarToken, carritoController.obtenerPorId)
router.post('/api/carrito', verificarToken, carritoController.crear)
router.delete('/api/carrito/:id', verificarToken, carritoController.eliminar)

module.exports = router
