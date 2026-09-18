const express = require('express')
const router = express.Router()
const detallePedidoController = require('../controllers/detallePedido.controller')
const { verificarToken } = require('../middlewares/auth')

router.post('/api/detalle-pedido', verificarToken, detallePedidoController.crear)
router.get('/api/detalle-pedido/:pedido_id', verificarToken, detallePedidoController.listarPorPedido)

module.exports = router
