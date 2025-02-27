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
const { RemisionToner, RemisionTonerSchema } = require('./RemisionToner.model')
const { RemisionUnidadImg, RemisionUnidadImgSchema } = require('./RemisionUnidadImagen.model')
const { RemisionRefaccion, RemisionRefaccionSchema } = require('./RemisionRefaccion.model')
const { Accesorio, AccesorioSchema } = require('./Accesorio.model')
const { EmpresaCliente, EmpresaClienteSchema } = require('./EmpresaCliente.model')
const { ImpresoraAccesorio, ImpresoraAccesorioSchema} = require('./ImpresoraAccesorio.model')
const { Proveedor, ProveedorSchema} = require('./Proveedor.model')

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
    Accesorio.init(AccesorioSchema, Accesorio.config(sequelize))
    Proveedor.init(ProveedorSchema, Proveedor.config(sequelize))

    RemisionImpresora.init(RemisionImpresoraSchema, RemisionImpresora.config(sequelize))
    RemisionToner.init(RemisionTonerSchema, RemisionToner.config(sequelize))
    RemisionUnidadImg.init(RemisionUnidadImgSchema, RemisionUnidadImg.config(sequelize))
    RemisionRefaccion.init(RemisionRefaccionSchema, RemisionRefaccion.config(sequelize))
    EmpresaCliente.init(EmpresaClienteSchema, EmpresaCliente.config(sequelize))
    ImpresoraAccesorio.init(ImpresoraAccesorioSchema, ImpresoraAccesorio.config(sequelize))

    // Establecer relaciones en todos los modelos
    const modelsWithAssociations = [
        Impresora, Cliente, Proyecto, Toner, Refaccion, UnidadImagen, 
        Marca, Empresa, Remision, Proveedor, Accesorio,
        RemisionImpresora, RemisionToner, RemisionUnidadImg, 
        RemisionRefaccion, EmpresaCliente, ImpresoraAccesorio
    ]
    
    modelsWithAssociations.forEach((model) => {
        if(typeof model.associate === 'function') {
            model.associate(sequelize.models)
        }
    })

   
}

module.exports = setupModels