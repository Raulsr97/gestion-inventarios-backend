'use strict';
const { DataTypes } = require('sequelize')
const { IMPRESORA_TABLE } = require('../src/models/Impresora.model');
const { REMISION_TABLE } = require('../src/models/Remision.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(REMISION_TABLE, 'estado', {
       type: DataTypes.ENUM('Pendiente', 'Cancelada', 'Confirmada'),
       allowNull: false,
       defaultValue: 'Pendiente'
    })

    await queryInterface.addColumn(REMISION_TABLE, 'remision_firmada', {
      type: DataTypes.STRING,
      allowNull: true,
    })

   await queryInterface.addColumn(REMISION_TABLE, 'observaciones_entrega', {
    type: DataTypes.TEXT,
    allowNull: true,
   })

   await queryInterface.addColumn(REMISION_TABLE, 'usuario_creador', {
    type: DataTypes.STRING,
    allowNull: true,
   })

   await queryInterface.addColumn(REMISION_TABLE, 'usuario_entrega', {
    type: DataTypes.STRING,
    allowNull: true,
   })

   await queryInterface.addColumn(REMISION_TABLE, 'fecha_entrega', {
    type: DataTypes.DATE,
    allowNull: true,
   })

   await queryInterface.addColumn(REMISION_TABLE, 'cancelada_por', {
    type: DataTypes.STRING,
    allowNull: true,
   })

   await queryInterface.addColumn(REMISION_TABLE, 'fecha_cancelacion', {
    type: DataTypes.DATE,
    allowNull: true,
   })

   
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(REMISION_TABLE, 'estado')
    await queryInterface.removeColumn(REMISION_TABLE, 'remision_firmada')
    await queryInterface.removeColumn(REMISION_TABLE, 'observaciones_entrega')
    await queryInterface.removeColumn(REMISION_TABLE, 'usuario_creador')
    await queryInterface.removeColumn(REMISION_TABLE, 'usuario_entrega')
    await queryInterface.removeColumn(REMISION_TABLE, 'fecha_entrega')
    await queryInterface.removeColumn(REMISION_TABLE, 'cancelada_por')
    await queryInterface.removeColumn(REMISION_TABLE, 'fecha_cancelacion')
  }
};
