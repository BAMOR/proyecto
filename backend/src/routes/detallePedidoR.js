const express = require('express')
const router = express.Router()
const detallePedidoController = require('../controllers/detallePedido.controller')
const { verificarToken } = require('../middlewares/auth')

// El detalle se genera automáticamente al registrar una venta (ver pedidos.controller.js),
// no se escribe manualmente para no romper la consistencia con el stock.
router.get('/api/detalle-pedido/:pedido_id', verificarToken, detallePedidoController.listarPorPedido)

module.exports = router
