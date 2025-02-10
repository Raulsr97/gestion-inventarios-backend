const { DataTypes, Model } = require('sequelize');

const TONER_TABLE = 'toners';

const TonerSchema = {
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
    marca_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'marcas', 
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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

class Toner extends Model {
    static associate(models) {
        this.belongsTo(models.Cliente, { foreignKey: 'cliente_id', as: 'cliente' });
        this.belongsTo(models.Marca, { foreignKey: 'marca_id', as: 'marca' });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: TONER_TABLE,
            modelName: 'Toner',
            timestamps: false
        };
    }
}

module.exports = { Toner, TonerSchema, TONER_TABLE };
