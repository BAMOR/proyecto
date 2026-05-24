
const mysql = require('mysql2')


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

pool.getConnection((err,conecction)=>{
    if(err){
        console.error('Error al conectarse a la BD', err.message)
        return
    }

    console.log('conectado a la BD')
    conecction.release()

})

module.exports = pool


