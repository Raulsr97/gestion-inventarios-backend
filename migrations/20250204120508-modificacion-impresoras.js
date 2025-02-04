'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('impresoras', 'proveedor').catch(() => console.log("La columna 'proveedor' ya no existe."))

    await queryInterface.addColumn('impresoras', 'marca', {
      type: Sequelize.STRING,
      allowNull: false,
    }).catch(() => console.log("La columna 'marca' ya existe."));


    await queryInterface.changeColumn('impresoras', 'tipo', {
      type: DataTypes.ENUM('Propia', 'Proyecto'),
      allowNull: false
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('impresoras', 'proveedor', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.removeColumn('impresoras', 'marca');

    await queryInterface.changeColumn('impresoras', 'tipo', { 
      type: DataTypes.ENUM('Propia', 'Proyecto', 'Usada'),
      allowNull: false,
    });
  }
  }

