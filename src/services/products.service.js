const boom = require('@hapi/boom')
const { models } = require('../config/db')
const { Op } = require('sequelize')

class ProductsService {
  constructor() {

  }

  async create(data) {
    const newProduct = await models.Product.create(data)
    return newProduct
  }

  async find() {
    const products = await models.Product.findAll()
    return products
  }

  async findOne(serie) {
    const product = await models.Product.findByPk(serie)
    return product
  }

  async update(serie, changes) {
    const product = await models.Product.findByPk(serie)
    const updatedProduct = await product.update({
      ...changes,
      disponible: false,
      fecha_salida: new Date()
    })
    return updatedProduct
  }

  async countByModel(modelo) {
    const count = await models.Product.count({
      where: {
        modelo,
        disponible: true
      }
    })

    return { modelo, disponibles: count }
  }

  async offProducts() {
    const products = await models.Product.findAll({
      where: {
        fecha_salida: {
          [Op.not]: null // Filtrar donde fecha de salida no sea NULL
        }
      }
    })
    console.log('Productos encontrados:', JSON.stringify(products, null, 2)); // Mostrar los productos como JSON bien formateado
    return products
  }

  
}

module.exports = ProductsService