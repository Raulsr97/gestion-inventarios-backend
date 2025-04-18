'use strict';

const { DataTypes } = require('sequelize')
const { REFACCION_TABLE } = require('../src/models/Refaccion.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(REFACCION_TABLE, 'tipo', {
      type: DataTypes.ENUM('Compra', 'Distribucion'),
      allowNull: false
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(REFACCION_TABLE, 'tipo')
  }
};
