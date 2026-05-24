const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/api/pedidos', (req, res) => {
    const sql = 'SELECT * FROM vista_pedidos_completo';
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, pedidos: result });
    });
});


router.post('/api/pedidos', (req, res) => {
    const { 
        cliente_id, usuario_id, subtotal, impuesto, envio, 
        total, metodo_pago, direccion_envio, ciudad_envio, telefono_envio 
    } = req.body;

    const numero_pedido = 'ORD-' + Date.now(); 

    const sql = `INSERT INTO pedidos 
        (cliente_id, usuario_id, numero_pedido, subtotal, impuesto, envio, total, metodo_pago, direccion_envio, ciudad_envio, telefono_envio) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [cliente_id, usuario_id, numero_pedido, subtotal, impuesto, envio, total, metodo_pago, direccion_envio, ciudad_envio, telefono_envio], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({
            success: true,
            message: 'Pedido creado',
            pedidoId: result.insertId,
            numero_pedido
        });
    });
});


router.delete('/api/pedidos/:id', (req, res) => {
    const sql = 'DELETE FROM pedidos WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Pedido no encontrado' });
        res.json({ message: 'Pedido eliminado correctamente' });
    });
});

module.exports = router;