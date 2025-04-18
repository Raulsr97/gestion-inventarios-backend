const { DataTypes, Model } = require('sequelize');

const TONER_TABLE = 'toners';

const TonerSchema = {
   serie: {
        primaryKey: true,
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
    tipo: {
        type: DataTypes.ENUM('Compra', 'Distribucion'),
        allowNull: false
    },
    ubicacion: {
        type: DataTypes.ENUM('Almacen', 'Cliente', 'Devuelto al proveedor'),
        allowNull: false,
        defaultValue: 'Almacen'
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
    fecha_entrada: {
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

class Toner extends Model {
    static associate(models) {
        this.belongsTo(models.Cliente, { foreignKey: 'cliente_id', as: 'cliente' })
        this.belongsTo(models.Proyecto, { foreignKey: 'proyecto_id', as: 'proyecto'})
        this.belongsTo(models.Marca, { foreignKey: 'marca_id', as: 'marca' })
        this.belongsTo(models.Empresa, { foreignKey: 'empresa_id', as: 'empresa'})
        this.belongsTo(models.Proveedor, {foreignKey: 'proveedor_id', as: 'proveedor'})

        this.belongsToMany(models.Remision, {
            through: 'remision_toners', 
            foreignKey: 'serie',
            otherKey: 'numero_remision',
            as: 'remisiones'
        })
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
