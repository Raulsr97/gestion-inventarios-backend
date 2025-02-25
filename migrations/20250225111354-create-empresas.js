'use strict';

const { EMPRESA_TABLE, EmpresaSchema } = require('../src/models/Empresa.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(EMPRESA_TABLE, EmpresaSchema)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable(EMPRESA_TABLE)
  }
};
