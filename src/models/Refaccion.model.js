const { DataTypes, Model } = require('sequelize');

const REFACCION_TABLE = 'refacciones';

const RefaccionSchema = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    numero_parte: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    fecha_ingreso: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
};

class Refaccion extends Model {
    static associate(models) {
        // No está vinculada directamente con clientes, pero podría relacionarse con pedidos en el futuro.
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: REFACCION_TABLE,
            modelName: 'Refaccion',
            timestamps: false
        };
    }
}

module.exports = { Refaccion, RefaccionSchema, REFACCION_TABLE };
