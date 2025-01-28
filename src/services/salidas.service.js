const { models } = require('../config/db')
const { Op } = require('sequelize')

// Servicio para obtener productos por fecha de salida
const obtenerProductosPorFechaSalida = async (fecha) => {
    const inicioDia = `${fecha} 00:00:00`
    const finDia = `${fecha} 23:59:59`

    return await models.Product.findAll({
        where: {
            fecha_salida: {
                [Op.between]: [inicioDia, finDia]
            }
        }
    })
}

module.exports = { obtenerProductosPorFechaSalida }