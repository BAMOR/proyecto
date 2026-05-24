const express = require('express')
const router = express.Router()
const db = require('../config/db')

router.get('/api/productos/buscar', (req, res) => {
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
        return res.status(400).json({ 
            success: false,
            error: 'Término de búsqueda requerido' 
        });
    }
    

    const sql = `
        SELECT 
            id,
            categoria_id,
            nombre,
            descripcion,
            precio,
            stock,
            sku,
            estado,
            imagen_url
        FROM productos
        WHERE nombre LIKE ? 
           OR descripcion LIKE ? 
           OR sku LIKE ?
        ORDER BY nombre ASC
    `;
    
    const searchTerm = `%${q.trim()}%`; 
    
    db.query(sql, [searchTerm, searchTerm, searchTerm], (err, results) => {
        if (err) {
            // Esto imprimirá el error real en tu terminal (ej: "Unknown column...")
            console.error('Error detallado en MySQL:', err.message);
            return res.status(500).json({ 
                success: false,
                error: 'Error al buscar productos',
                sqlError: err.message 
            });
        }
        
        res.json({ 
            success: true,
            productos: results,
            total: results.length,
            termino: q
        });
    });
});

router.get('/api/productos',(req,res)=>{

    const sql = 'SELECT * FROM productos'

    db.query(sql,(err,result)=>{
        if(err){
            console.error('Error en colsulta SQL')
            return res.status(500).json({error: 'Error al Consultar la base de datos'})
        }

        res.json({
            success: true,
            productos: result,
            total: result.length
        })
    })

})


router.get('/api/productos/:id', (req, res) => {
    const sql = 'SELECT * FROM productos WHERE id = ?'
    const id = req.params.id

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error en la consulta:', err)
            return res.status(500).json({ error: 'Error en la consulta' })
        }
        
        // 2. Para ver si no hay resultados, checa el largo del array (result.length)
        if (result.length === 0) {
            return res.status(404).json({ error: 'producto no encontrado' })
        }

        // 3. Devuelve el primer (y único) resultado
        res.json(result[0])
    })
})


router.post('/api/productos', (req, res) => {
    // 1. Extraer datos del body (¡ESTO TE FALTA!)
    const { categoria_id, nombre, descripcion, precio, stock, sku, estado } = req.body;

    // 2. Tu query (está bien)
    const sql = 'INSERT INTO productos (categoria_id, nombre, descripcion, precio, stock, sku, estado) VALUES (?,?,?,?,?,?,?)';

    
    db.query(sql, [categoria_id, nombre, descripcion, precio, stock, sku, estado], (err, result) => {
        if (err) {
            console.error(' Error detallado:', err);  
            return res.status(500).json({ error: 'Error en la consulta SQL' });
        }

        res.status(201).json({
            success: true,
            message: 'Producto agregado correctamente',
            productId: result.insertId
        });
    });
});


router.delete('/api/productos/:id',(req,res)=>{
    const id = req.params.id
    const sql = 'DELETE FROM productos WHERE id = ?'

    db.query(sql,[id],(err,result)=>{
        if(err){
            return res.status(500).json({error:'Error en consulta SQL'})
        }
        if(result === 0){
            return res.status(404).json({error: 'producto no encontrado'})
        }

        res.json({message: 'Producto eliminado correctamente'})
    })
})

module.exports = router

