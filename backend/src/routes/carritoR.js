const express = require('express')
const router = express.Router()

const db = require('../config/db')

router.get('/api/carrito',(req,res)=>{
    const sql = 'SELECT * FROM carrito'
    db.query(sql,(err,result)=>{
        if(err){
            return res.status(500).json({error: 'Error en la consulta a la bd'})
        }

        res.json({
            succes: true,
            carrito: result,
            total: result.length
        })
    })
})


router.get('/api/carrito/:id',(req,res)=>{
    const id = req.params.id
    const sql = 'SELECT * FROM carrito WHERE id = ?'
    db.query(sql,(err,result)=>{
        if(err){
            return res.status(500).json({error: 'Error en la consulta a la bd'})
        }
        if(result === 0){
            return res.status(404).json({error: 'No se encontro elemento'})
        }
        res.json(result[0])

    })
})


router.post('/api/carrito',(req,res)=>{
    const {cliente_id, producto_id, cantidad} = req.body
    const sql = 'INSERT INTO carrito (cliente_id,producto,cantidad)VALUES(?,?,?)'
    db.query(sql,[cliente_id,producto_id,cantidad],(err,result)=>{
        if(err){
            return res.status(500).json({error: 'Error en la consulta a la bd'})
        }
        res.json({
            succes: true,
            message: 'Carrito agreado exitosamente',
            total: result.length
        })

    })
})

router.delete('/api/clientes/:id',(req,res)=>{
    const id = req.params.id
    const sql = 'DELETE FROM clientes WHERE id =?'
    db.query(sql,[id],(err,result)=>{
        if(err){
            return res.status(500).json({error: 'Error en la consulta a la bd'})
        }

        if(result === 0 ){
            return res.status(404).json({erro: 'Carrito no encontrado'})
        }

        res.json(result[0])

    })

})

module.exports = router