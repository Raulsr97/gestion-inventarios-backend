const { Model, DataTypes } = require('sequelize')

const EMPRESA_CLIENTE_TABLE = 'empresa_clientes'

const EmpresaClienteSchema = {
    empresa_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'empresas',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    cliente_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'clientes',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
};

class EmpresaCliente extends Model {
    static associate(models) {
        this.belongsTo(models.Empresa, { foreignKey: 'empresa_id', as: 'empresa' });
        this.belongsTo(models.Cliente, { foreignKey: 'cliente_id', as: 'cliente' });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: EMPRESA_CLIENTE_TABLE,
            modelName: 'EmpresaCliente',
            timestamps: false,
        };
    }
}

module.exports = { EmpresaCliente, EMPRESA_CLIENTE_TABLE, EmpresaClienteSchema };
