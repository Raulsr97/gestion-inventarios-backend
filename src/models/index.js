const { Impresora, ImpresoraSchema} = require('./Impresora.model')
const { Cliente, ClienteSchema} = require('./Cliente.model')
const { Proyecto, ProyectoSchema} = require('./Proyecto.model')
const { Toner, TonerSchema} = require('./Toner.model')
const { UnidadImagen, UnidadImagenSchema} = require('./UnidadImagen.model')
const { Refaccion, RefaccionSchema} = require('./Refaccion.model')
const { Marca, MarcaSchema} = require('./Marca.model')
const { Empresa, EmpresaSchema } = require('./Empresa.model')
const { Remision, RemisionSchema } = require('./Remision.model')
const { RemisionImpresora, RemisionImpresoraSchema } = require('./RemisionImpresora.model')




function setupModels(sequelize) {
    Impresora.init(ImpresoraSchema, Impresora.config(sequelize))
    Cliente.init(ClienteSchema, Cliente.config(sequelize))
    Proyecto.init(ProyectoSchema, Proyecto.config(sequelize))    
    Toner.init(TonerSchema, Toner.config(sequelize))
    Refaccion.init(RefaccionSchema, Refaccion.config(sequelize))
    UnidadImagen.init(UnidadImagenSchema, UnidadImagen.config(sequelize))
    Marca.init(MarcaSchema, Marca.config(sequelize))
    Empresa.init(EmpresaSchema, Empresa.config(sequelize))
    Remision.init(RemisionSchema, Remision.config(sequelize))
    RemisionImpresora.init(RemisionImpresoraSchema, RemisionImpresora.config(sequelize))

    Impresora.associate(sequelize.models)
    Cliente.associate(sequelize.models)
    Proyecto.associate(sequelize.models)
    Toner.associate(sequelize.models)
    Refaccion.associate(sequelize.models)
    UnidadImagen.associate(sequelize.models)
    Marca.associate(sequelize.models)
    Empresa.associate(sequelize.models)
    Remision.associate(sequelize.models)
    RemisionImpresora.associate(sequelize.models)
}

module.exports = setupModels