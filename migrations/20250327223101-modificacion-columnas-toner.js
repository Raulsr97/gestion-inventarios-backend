'use strict';
const { TONER_TABLE } = require('../src/models/Toner.model')
const { DataTypes} = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn(TONER_TABLE, 'ubicacion', {
      type: DataTypes.ENUM('Almacen', 'Entregado', 'En Tránsito', 'Devuelto al proveedor'),
      allowNull: false,
      defaultValue: 'Almacen'
    })

    await queryInterface.addColumn(TONER_TABLE, 'destino_distribucion', {
      type: DataTypes.STRING,
      allowNull: true
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn(TONER_TABLE, 'ubicacion', {
      type: DataTypes.ENUM('Almacen', 'Cliente', 'Devuelto al proveedor'),
      allowNull: false,
      defaultValue: 'Almacen'
    })

    await queryInterface.removeColumn(TONER_TABLE, 'destino_distribucion')
  }

};
