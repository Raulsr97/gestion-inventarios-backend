'use strict';

const { REFACCION_TABLE } = require('../src/models/Refaccion.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn(REFACCION_TABLE, 'cantidad',)

    await queryInterface.renameColumn(REFACCION_TABLE, 'fecha_ingreso', 'fecha_entrada')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn(REFACCION_TABLE, 'cantidad', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    });

    await queryInterface.renameColumn(REFACCION_TABLE, 'fecha_entrada', 'fecha_ingreso');
  }
};
