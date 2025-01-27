const { DataTypes, Model } = require('sequelize')

const PRODUCT_TABLE = 'productos'

const ProductSchema = {
    serie: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true
    },
    modelo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tipo: {
        type: DataTypes.STRING,
    },
    proveedor: {
        type: DataTypes.STRING,
    },
    cliente: {
        type: DataTypes.STRING,
    },
    fecha_entrada: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    fecha_salida: {
        type: DataTypes.DATE,
    },
    disponible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
}


class Product extends Model {
    static associate() {

    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: PRODUCT_TABLE,
            modelName: 'Product',
            timestamps: false
        }
    }
}

module.exports = { PRODUCT_TABLE, ProductSchema, Product}