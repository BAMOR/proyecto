const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')
const usuariosController = require('../controllers/usuarios.controller')
const { verificarToken, verificarRol } = require('../middlewares/auth')

// ========================================================
// 🔐 AUTENTICACIÓN (público)
// ========================================================
router.post('/api/auth/login', authController.login)

// ========================================================
// 👥 CRUD USUARIOS (solo admin)
// ========================================================
router.get('/api/usuarios', verificarToken, verificarRol('admin'), usuariosController.listar)
router.get('/api/usuarios/:id', verificarToken, verificarRol('admin'), usuariosController.obtenerPorId)
router.post('/api/usuarios', verificarToken, verificarRol('admin'), usuariosController.crear)
router.put('/api/usuarios/:id', verificarToken, verificarRol('admin'), usuariosController.actualizar)
router.delete('/api/usuarios/:id', verificarToken, verificarRol('admin'), usuariosController.eliminar)

module.exports = router
