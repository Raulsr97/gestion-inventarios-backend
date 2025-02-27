'use strict';

const { ACCESORIO_TABLE, AccesorioSchema } = require('../src/models/Accesorio.model');
const { CLIENTE_TABLE, ClienteSchema } = require('../src/models/Cliente.model');
const { EMPRESA_TABLE, EmpresaSchema } = require('../src/models/Empresa.model');
const { EMPRESA_CLIENTE_TABLE, EmpresaClienteSchema } = require('../src/models/EmpresaCliente.model');
const { IMPRESORA_TABLE, ImpresoraSchema } = require('../src/models/Impresora.model');
const { IMPRESORA_ACCESORIO_TABLE, ImpresoraAccesorioSchema } = require('../src/models/ImpresoraAccesorio.model');
const { MARCA_TABLE, MarcaSchema } = require('../src/models/Marca.model');
const { PROVEEDOR_TABLE, ProveedorSchema } = require('../src/models/Proveedor.model');
const { ProyectoSchema, PROYECTO_TABLE } = require('../src/models/Proyecto.model');
const { REFACCION_TABLE, RefaccionSchema } = require('../src/models/Refaccion.model');
const { REMISION_TABLE, RemisionSchema } = require('../src/models/Remision.model');
const { REMISION_IMPRESORA_TABLE, RemisionImpresoraSchema } = require('../src/models/RemisionImpresora.model');
const { REMISION_REFACCION_TABLE, RemisionRefaccionSchema } = require('../src/models/RemisionRefaccion.model');
const { REMISION_TONER_TABLE, RemisionTonerSchema } = require('../src/models/RemisionToner.model');
const { REMISION_UNIDADIMG_TABLE, RemisionUnidadImgSchema } = require('../src/models/RemisionUnidadImagen.model');
const { TONER_TABLE, TonerSchema } = require('../src/models/Toner.model');
const { UNIDAD_IMAGEN_TABLE, UnidadImagenSchema } = require('../src/models/UnidadImagen.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(EMPRESA_TABLE, EmpresaSchema)
    await queryInterface.createTable(CLIENTE_TABLE, ClienteSchema)
    await queryInterface.createTable(PROYECTO_TABLE, ProyectoSchema)
    await queryInterface.createTable(IMPRESORA_TABLE, ImpresoraSchema)
    await queryInterface.createTable(TONER_TABLE, TonerSchema)
    await queryInterface.createTable(UNIDAD_IMAGEN_TABLE, UnidadImagenSchema)
    await queryInterface.createTable(REFACCION_TABLE, RefaccionSchema)
    await queryInterface.createTable(PROVEEDOR_TABLE, ProveedorSchema)
    await queryInterface.createTable(MARCA_TABLE, MarcaSchema)
    await queryInterface.createTable(ACCESORIO_TABLE, AccesorioSchema)
    await queryInterface.createTable(REMISION_TABLE, RemisionSchema)
    await queryInterface.createTable(EMPRESA_CLIENTE_TABLE, EmpresaClienteSchema)
    await queryInterface.createTable(IMPRESORA_ACCESORIO_TABLE, ImpresoraAccesorioSchema)
    await queryInterface.createTable(REMISION_IMPRESORA_TABLE, RemisionImpresoraSchema)
    await queryInterface.createTable(REMISION_TONER_TABLE, RemisionTonerSchema)
    await queryInterface.createTable(REMISION_UNIDADIMG_TABLE, RemisionUnidadImgSchema)
    await queryInterface.createTable(REMISION_REFACCION_TABLE, RemisionRefaccionSchema)
    

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable(EMPRESA_TABLE)
    await queryInterface.dropTable(CLIENTE_TABLE)
    await queryInterface.dropTable(PROYECTO_TABLE)
    await queryInterface.dropTable(IMPRESORA_TABLE)
    await queryInterface.dropTable(TONER_TABLE)
    await queryInterface.dropTable(UNIDAD_IMAGEN_TABLE)
    await queryInterface.dropTable(REFACCION_TABLE)
    await queryInterface.dropTable(PROVEEDOR_TABLE)
    await queryInterface.dropTable(MARCA_TABLE)
    await queryInterface.dropTable(ACCESORIO_TABLE)
    await queryInterface.dropTable(REMISION_TABLE)
    await queryInterface.dropTable(EMPRESA_CLIENTE_TABLE)
    await queryInterface.dropTable(IMPRESORA_ACCESORIO_TABLE)
    await queryInterface.dropTable(REMISION_IMPRESORA_TABLE)
    await queryInterface.dropTable(REMISION_TONER_TABLE)
    await queryInterface.dropTable(REMISION_UNIDADIMG_TABLE)
    await queryInterface.dropTable(REMISION_REFACCION_TABLE)
  }
};
