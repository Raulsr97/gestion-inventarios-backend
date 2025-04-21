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
        allowNull: false,
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
    tipo: {
        type: DataTypes.ENUM('Compra', 'Distribucion'),
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

        // Relacion con remisiones a traves de la tabla intermedia
        this.belongsToMany(models.Remision, {
            through: 'remision_refacciones',
            foreignKey: 'refaccion_id',
            otherKey: 'numero_remision',
            as: 'remisiones'
        })

        this.hasMany(models.RemisionRefaccion, {
            foreignKey: 'refaccion_id',
            as: 'relacion_refacciones'
        });
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
