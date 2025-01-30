const { models } = require('../config/db')
const { Op } = require('sequelize')

class MovimientosService {
    constructor(){}

    async productsIn(fecha) {
        const inicioDia = `${fecha} 00:00:00`
        const finDia = `${fecha} 23:59:59`

        const products = await models.Product.findAll({
            where: {
                fecha_entrada: {
                    [Op.between]: [inicioDia, finDia]
                }
            }
        })

        return products
    }

    async productsOut(fecha) {
        const inicioDia = `${fecha} 00:00:00`
        const finDia = `${fecha} 23:59:59`

        const products = await models.Product.findAll({
            where: {
                fecha_salida: {
                    [Op.between]: [inicioDia, finDia]
                }
            }
        })

        return products
    }
}

module.exports = MovimientosService