const express = require('express')
const router = express.Router()
const historialController = require('../controllers/historial.controller')
const { verificarToken } = require('../middlewares/auth')

router.post('/api/historial', verificarToken, historialController.crear)
router.get('/api/historial/:pedido_id', verificarToken, historialController.listarPorPedido)

module.exports = router
