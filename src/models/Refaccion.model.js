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
    proyecto_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'proyectos', 
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    fecha_ingreso: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    fecha_salida: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    fecha_entrega_final: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    empresa_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'empresas', 
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    proveedor_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'proveedores', 
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    }
};

class Refaccion extends Model {
    static associate(models) {
        this.belongsTo(models.Cliente, { foreignKey: 'cliente_id', as: 'cliente' })
        this.belongsTo(models.Proyecto, { foreignKey: 'proyecto_id', as: 'proyecto'})
        this.belongsTo(models.Marca, { foreignKey: 'marca_id', as: 'marca' })
        this.belongsTo(models.Empresa, { foreignKey: 'empresa_id', as: 'empresa'})
        this.belongsTo(models.Proveedor, {foreignKey: 'proveedor_id', as: 'proveedor'})

        this.belongsToMany(models.Remision, {
            through: 'remision_refacciones',
            foreignKey: 'refaccion_id',
            otherKey: 'numero_remision',
            as: 'remisiones'
        })
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
