const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/api/historial', (req, res) => {
    const { pedido_id, estado_anterior, estado_nuevo, usuario_id, notas } = req.body;
    
    const sql = 'INSERT INTO historial_estados (pedido_id, estado_anterior, estado_nuevo, usuario_id, notas) VALUES (?, ?, ?, ?, ?)';
    
    db.query(sql, [pedido_id, estado_anterior, estado_nuevo, usuario_id, notas], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ success: true, message: 'Estado actualizado en el historial' });
    });
});

router.get('/api/historial/:pedido_id', (req, res) => {
    const sql = 'SELECT * FROM historial_estados WHERE pedido_id = ?';
    db.query(sql, [req.params.pedido_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

module.exports = router;