'use strict';
const { PRODUCT_TABLE, ProductSchema } = require('../src/models/Product.model')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.createTable(PRODUCT_TABLE, ProductSchema)
  },

  async down (queryInterface) {
    await queryInterface.dropTable(PRODUCT_TABLE)
  }
};
