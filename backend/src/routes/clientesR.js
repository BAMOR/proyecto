const express = require('express')
const router = express.Router()
const clientesController = require('../controllers/clientes.controller')
const { verificarToken } = require('../middlewares/auth')

router.get('/api/clientes', verificarToken, clientesController.listar)
router.get('/api/clientes/:id', verificarToken, clientesController.obtenerPorId)
router.post('/api/clientes', verificarToken, clientesController.crear)
router.delete('/api/clientes/:id', verificarToken, clientesController.eliminar)

module.exports = router
