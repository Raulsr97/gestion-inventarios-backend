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

  
}

module.exports = ProductsService