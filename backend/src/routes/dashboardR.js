const express = require('express')
const router = express.Router()
const dashboardController = require('../controllers/dashboard.controller')
const { verificarToken, verificarRol } = require('../middlewares/auth')

router.get('/api/dashboard/stats', verificarToken, verificarRol('admin'), dashboardController.stats)
router.get('/api/dashboard/usuarios', verificarToken, verificarRol('admin'), dashboardController.usuarios)
router.get('/api/dashboard/productos', verificarToken, verificarRol('admin'), dashboardController.productos)
router.get('/api/dashboard/pedidos', verificarToken, verificarRol('admin'), dashboardController.pedidos)

module.exports = router
