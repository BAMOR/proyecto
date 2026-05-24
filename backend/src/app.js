const express = require('express')

const cors = require('cors')

require('dotenv').config()

const productosRouter = require('./routes/productsR')
const usuariosRouter = require('./routes/usersR')
const carritoRouter = require('./routes/carritoR')
const categoriesRouter = require('./routes/categoriesR')
const clientesRouter = require('./routes/clientesR')
const detallePedidoRouter = require('./routes/detallePedidoR')
const historialRouter = require('./routes/historialR')
const pedidosRouter = require('./routes/pedidosR')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())

app.use(express.json())


app.use(productosRouter)
app.use(usuariosRouter)
app.use(carritoRouter)
app.use(categoriesRouter)
app.use(clientesRouter)
app.use(detallePedidoRouter)
app.use(historialRouter)
app.use(pedidosRouter)

app.get('/health',(req,res)=>{

    res.json({status:'ok', message: 'servidor funcionando'})
    
})


app.use((req,res)=>{

    res.status(404).json({error: 'ruta no encontrada'})

})

app.listen(PORT,()=>{
    console.log(`servidor corriendo en https://localhost:${PORT}`)
})