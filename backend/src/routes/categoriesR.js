const express = require('express')
const router = express.Router()
const db = require('../config/db')

router.get('/api/categories',(req,res)=>{
    const sql = 'SELECT * FROM categorias'
    db.query(sql,(err,result)=>{
        if(err){
            return res.status(500).json({err: 'Error en la consulta a la bd'})
        }

        res.json({
            succes: true,
            categories: result,
            total: result.length
        })
    })

})


router.get('/api/categories/:id',(req,res)=>{
    const sql = 'SELECT * FROM categorias WHERE id =?'
    const id = req.params.id

    db.query(sql,[id],(err,result)=>{
        if(err){
            return res.status(500).json({error: 'Error en la consulta a la bd'})
        }
        if(result === 0){
            return res.status(404).json({error: 'categoria no encontrada'})
        }

        res.json(result[0])

    })
})

router.post('/api/categories',(req,res)=>{
    const {nombre,descripcion,estado} = req.body
    const sql = 'INSERT INTO categorias (nombre,descripcion,estado) VALUES (?,?,?)'
    db.query(sql,[nombre,descripcion,estado],(err,result)=>{
        if(err){
            return res.status(500).json({error: 'Error en la consulta a la bd'})
        }
        res.json({
            succes:true,
            message: 'Categoria agregada exitosamente',
            total: result.length
        })

    })
})


router.delete('/api/categories/:id',(req,res)=>{
    const id = req.params.id
    const sql = 'DELETE FROM categorias WHERE id =?'
    db.query(sql,[id],(err,result)=>{
        if(err){
            return res.status(500).json({error: 'Error en la consulta a la bd'})
        }
        if(result === 0){
            return res.status(404).json({error:'Categoria no encontrada'})
        }
        res.json(result[0])

    })
})

module.exports = router