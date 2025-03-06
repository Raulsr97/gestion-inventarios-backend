'use strict';

const { IMPRESORA_TABLE } = require('../src/models/Impresora.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn(IMPRESORA_TABLE, 'ubicacion', {
      type: Sequelize.ENUM('Almacen', 'En Tránsito', 'Entregado', 'Devuelto al proveedor'),
      allowNull: false,
      defaultValue: 'Almacen',
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn(IMPRESORA_TABLE, 'ubicacion', {
      type: Sequelize.ENUM('Almacen', 'Entregado', 'Devuelto al proveedor'),
      allowNull: false,
      defaultValue: 'Almacen',
    })
  }
};
