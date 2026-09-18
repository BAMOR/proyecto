const mysql = require('mysql2/promise')

// DB_PASSWORD se valida por separado: puede ser una cadena vacía en desarrollo (usuario sin contraseña)
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_NAME', 'JWT_SECRET']
const missing = requiredEnvVars.filter((key) => !process.env[key])
if (process.env.DB_PASSWORD === undefined) missing.push('DB_PASSWORD')

if (missing.length > 0) {
    console.error(`Faltan variables de entorno obligatorias: ${missing.join(', ')}`)
    process.exit(1)
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

pool.getConnection()
    .then((connection) => {
        console.log('conectado a la BD')
        connection.release()
    })
    .catch((err) => {
        console.error('Error al conectarse a la BD', err.message)
    })

module.exports = pool
