'use strict';

const { REFACCION_TABLE } = require('../src/models/Refaccion.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn(REFACCION_TABLE, 'fecha_entrega_final')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn(REFACCION_TABLE, 'fecha_entrega_final', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  }
};
