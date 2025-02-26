const { DataTypes, Model } = require('sequelize')

const ACCESORIO_TABLE = 'accesorios'

const AccesorioSchema = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numero_parte: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false
    }
};

class Accesorio extends Model {
    static associate(models) {
        this.belongsToMany(models.Impresora, {
            through: 'impresora_accesorios',
            foreignKey: 'accesorio_id',
            otherKey: 'serie',
            as: 'impresoras'
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: ACCESORIO_TABLE,
            modelName: 'Accesorio',
            timestamps: false
        };
    }
}

module.exports = { Accesorio, AccesorioSchema, ACCESORIO_TABLE }
