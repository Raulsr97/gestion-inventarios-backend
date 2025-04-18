const { DataTypes, Model } = require('sequelize');

const MARCA_TABLE = 'marcas';

const MarcaSchema = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    }
};

class Marca extends Model {
    static associate(models) {
        this.hasMany(models.Impresora, { foreignKey: 'marca_id', as: 'impresoras' })
        this.hasMany(models.Toner, { foreignKey: 'marca_id', as: 'toners' })
        this.hasMany(models.UnidadImagen, { foreignKey: 'marca_id', as: 'unidades_imagen' })
        this.hasMany(models.Refaccion, { foreignKey: 'marca_id', as: 'refacciones' })
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: MARCA_TABLE,
            modelName: 'Marca',
            timestamps: false
        };
    }
}

module.exports = { MarcaSchema, Marca, MARCA_TABLE };

