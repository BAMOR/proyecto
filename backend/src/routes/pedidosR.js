const express = require('express')
const router = express.Router()
const pedidosController = require('../controllers/pedidos.controller')
const { verificarToken, verificarRol } = require('../middlewares/auth')

router.get('/api/pedidos', verificarToken, pedidosController.listar)
router.post('/api/pedidos', verificarToken, verificarRol('admin', 'vendedor'), pedidosController.crear)
router.patch('/api/pedidos/:id/anular', verificarToken, verificarRol('admin'), pedidosController.anular)

module.exports = router
