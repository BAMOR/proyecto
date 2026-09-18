const express = require('express')
const router = express.Router()
const categoriasController = require('../controllers/categorias.controller')
const { verificarToken, verificarRol } = require('../middlewares/auth')

// Público
router.get('/api/categories', categoriasController.listar)
router.get('/api/categories/:id', categoriasController.obtenerPorId)

// Solo admin
router.post('/api/categories', verificarToken, verificarRol('admin'), categoriasController.crear)
router.delete('/api/categories/:id', verificarToken, verificarRol('admin'), categoriasController.eliminar)

module.exports = router
