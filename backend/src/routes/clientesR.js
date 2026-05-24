const express = require('express')
const router = express.Router()
const db = require('../config/db')


router.get('/api/clientes',(req,res)=>{
    const sql = 'SELECT * FROM clientes'
    db.query(sql,(err,result)=>{
        if(err){
            return res.status(500).json({error: 'Error en la consulta a la db'})
        }
        res.json({
            succes: true,
            cliente: result,
            total: result.length
        })
    })
})

router.get('/api/clientes/:id',(req,res)=>{
    const id = req.params.id
    const sql = 'SELECT * FROM clientes WHERE id = ?'
    db.query(sql,[id],(err,result)=>{
        if(err){
            return res.status(500).json({error: 'Error en la consulta a la db'})
        }
        if(result === 0){
            return res.status(404).json({error: 'Cliente no encontrado'})
        }
        res.json(result[0])
    })
})


router.post('/api/clientes',(req,res)=>{
    const {usuario_id, nombre, email, telefono, direccion, ciudad, codigo_postal} = req.body
    const sql = 'INSERT INTO clientes (usuario_id, nombre, email, telefono, direccion, ciudad,codigo_postal) VALUES (?,?,?,?,?,?,?)'
    db.query(sql,[usuario_id, nombre, email, telefono,direccion, ciudad, codigo_postal],(err,result)=>{
        if(err){
            return res.status(500).json({error: 'Error en la consulta a la bd'})
        }
        res.json({
            succes:true,
            clientes: result,
            total: result.length
        })
    })
})

router.delete('/api/clientes/:id',(req,res)=>{
    const id = req.params.id
    const sql = 'DELETE FROM clientes WHERE id = ?'
    db.query(sql,[id],(err, result)=>{
        if(err){
            return res.status(500).json({error:' Error en la consulta a la bd'})
        }
        if(result === 0){
            return res.status(404).json({error: 'Cliente no encontrado'})
        }
        res.json(result[0])

    })
})

module.exports = router