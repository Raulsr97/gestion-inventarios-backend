const { Product, ProductSchema} = require('./Product.model')

function setupModels(sequelize) {
    Product.init(ProductSchema, Product.config(sequelize))

    Product.associate(sequelize.models)
}

module.exports = setupModels