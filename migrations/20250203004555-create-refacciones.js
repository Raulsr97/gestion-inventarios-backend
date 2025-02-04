'use strict';

const { REFACCION_TABLE, RefaccionSchema } = require('../src/models/Refaccion.model')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(REFACCION_TABLE, RefaccionSchema)
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.dropTable(REFACCION_TABLE)
  }
};


