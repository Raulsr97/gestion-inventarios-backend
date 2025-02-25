const { DataTypes, Model } = require('sequelize');

const IMPRESORA_TABLE = 'impresoras';

const ImpresoraSchema = {
    serie: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
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
        allowNull: false,
    },
    estado: {
        type: DataTypes.ENUM('Nueva', 'Usada'),
        allowNull: false,
        defaultValue: 'Nueva'
    },
    tipo: {
        type: DataTypes.ENUM('Propia', 'Proyecto'),
        allowNull: false
    },
    ubicacion: {
        type: DataTypes.ENUM('Almacén', 'Cliente', 'Devuelto al fabricante'),
        allowNull: false,
        defaultValue: 'Almacén'
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
            model: 'proyectos', // Asegúrate de que la tabla `proyectos` exista
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    tiene_accesorios: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
    }
};

class Impresora extends Model {
    static associate(models) {
        // Relación con clientes (si aplica)
        this.belongsTo(models.Cliente, { foreignKey: 'cliente_id', as: 'cliente' });

        // Relación con proyectos (si aplica)
        this.belongsTo(models.Proyecto, { foreignKey: 'proyecto_id', as: 'proyecto' });

        // Relacion con marcas (si aplica)
        this.belongsTo(models.Empresa, {foreignKey: 'empresa_id', as: 'empresa'})

        // Relacion con marcas
        this.belongsTo(models.Marca, { foreignKey: 'marca_id', as: 'marca' });

        // Relacion con remisiones a traves de la tabla intermedia
        this.belongsToMany(models.Remision, {
            through: 'remision_impresoras',
            foreignKey: 'serie',
            otherKey: 'numero_remision',
            as: 'remisiones'
        })
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: IMPRESORA_TABLE,
            modelName: 'Impresora',
            timestamps: false
        };
    }
}

module.exports = { Impresora, ImpresoraSchema, IMPRESORA_TABLE };
