const express = require('express');
const router = express.Router();
const db = require('../config/db');

// POST: Agregar productos a un pedido
router.post('/api/detalle-pedido', (req, res) => {
    const { pedido_id, producto_id, cantidad, precio_unitario, subtotal } = req.body;
    
    const sql = 'INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)';
    
    db.query(sql, [pedido_id, producto_id, cantidad, precio_unitario, subtotal], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ success: true, message: 'Producto registrado en el pedido' });
    });
});


router.get('/api/detalle-pedido/:pedido_id', (req, res) => {
    const sql = 'SELECT * FROM detalle_pedido WHERE pedido_id = ?';
    db.query(sql, [req.params.pedido_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

module.exports = router;