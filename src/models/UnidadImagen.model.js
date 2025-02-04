const { DataTypes, Model } = require('sequelize');

const UNIDAD_IMAGEN_TABLE = 'unidades_imagen';

const UnidadImagenSchema = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    numero_serie: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    modelo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'clientes',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    fecha_ingreso: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
};

class UnidadImagen extends Model {
    static associate(models) {
        this.belongsTo(models.Cliente, { foreignKey: 'cliente_id', as: 'cliente' });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: UNIDAD_IMAGEN_TABLE,
            modelName: 'UnidadImagen',
            timestamps: false
        };
    }
}

module.exports = { UnidadImagen, UnidadImagenSchema, UNIDAD_IMAGEN_TABLE };
