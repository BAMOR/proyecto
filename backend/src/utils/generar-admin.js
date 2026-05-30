const bcrypt = require('bcrypt');
// Si usas otro paquete como bcryptjs cambia el require anterior

const passwordPlana = 'TuContrasenaSegura123'; // La contraseña que usarás para loguearte
const saltRounds = 10;

bcrypt.hash(passwordPlana, saltRounds, function(err, hash) {
    if (err) {
        console.error("Error cifrando:", err);
        return;
    }
    console.log("\n==================================================");
    console.log("CONTRASENA CIFRADA LISTA PARA TU BASE DE DATOS:");
    console.log("==================================================");
    console.log(hash); 
    console.log("==================================================\n");
});