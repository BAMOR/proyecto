const express = require('express')
const router = express.Router()
const historialController = require('../controllers/historial.controller')
const { verificarToken } = require('../middlewares/auth')

// El historial se genera automáticamente al registrar o anular una venta
// (ver pedidos.controller.js), no se escribe manualmente.
router.get('/api/historial/:pedido_id', verificarToken, historialController.listarPorPedido)

module.exports = router
