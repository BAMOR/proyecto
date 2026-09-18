// Devuelve la lista de campos requeridos que faltan (vacíos, null o undefined) en el body
function camposFaltantes(body, campos) {
    return campos.filter((campo) => {
        const valor = body[campo]
        return valor === undefined || valor === null || valor === ''
    })
}

module.exports = { camposFaltantes }
