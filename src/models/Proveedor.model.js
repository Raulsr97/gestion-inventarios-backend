const { DataTypes, Model} = require('sequelize')

const PROVEEDOR_TABLE = 'proveedores'

const ProveedorSchema = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true 
    } 
}

class Proveedor extends Model {
    static associate(models) {
      this.hasMany(models.Impresora, {foreignKey: 'proveedor_id',  as: 'impresoras' })
      this.hasMany(models.Toner, {foreignKey: 'proveedor_id', as: 'toners'})
      this.hasMany(models.UnidadImagen, {foreignKey: 'proveedor_id', as: 'unidades_imagen'})
      this.hasMany(models.Refaccion, {foreignKey: 'proveedor_id', as: 'refacciones'})
    }

    static config(sequelize) {
        return{
            sequelize,
            tableName: PROVEEDOR_TABLE,
            modelName: 'Proveedor',
            timestamps: false
        }
    }
}

module.exports = { PROVEEDOR_TABLE, ProveedorSchema, Proveedor}