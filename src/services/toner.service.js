const { models } = require('../config/db');

class TonerService {
    async obtenerToners() {
        return await models.Toner.findAll({
           include: [
            {
                model: models.Marca,
                as: 'marca',
                attributes: ['nombre']
            },
            {
                model: models.Cliente,
                as: 'cliente',
                attributes: ['nombre']
            },
            {
                model: models.Proyecto, 
                as: 'proyecto',
                attributes: ['nombre']
            },
            {
                model: models.Proveedor,
                as: 'proveedor',
                attributes: ['nombre']
            },
           ] 
        })
    }

    async registrarLote(data) {
        const { 
            modelo, 
            marca_id,
            ubicacion,
            cliente_id, 
            proyecto_id,
            series,
            proveedor_id
        } = data;

        // Buscar o crear la marca antes de registrar el toner
        let marca = null
        if (marca_id) {
            marca = await models.Marca.findOne({ where: { id: marca_id }})
            if(!marca) {
                throw new Error('La marca seleccionada no existe.');
            }
        }

        // 🔍 Verificar si el cliente existe o crearlo
        let cliente = null;
        if (cliente_id) {
            cliente = await models.Cliente.findOne({ where: { id: cliente_id } });
            if (!cliente) {
                throw new Error('El cliente seleccionado no existe.');
            }
        }
    
        // 🔍 Verificar si el proyecto existe o crearlo
        let proyecto = null;
        if (proyecto_id) {
            if (!cliente_id) {
                throw new Error("No se puede registrar un proyecto sin un cliente asociado.");
            }
            proyecto = await models.Proyecto.findOne({ where: { id : proyecto_id }})
            if (!proyecto) {
            throw new Error('El Proyecto seleccionado no existe')
            }
        }

        // 🔍 Verificar si el proveedor existe o crearlo
        let proveedor = null;
        if (proveedor_id) {
            proveedor = await models.Proveedor.findOne({ where: { id: proveedor_id } });
            if (!proveedor) {
                throw new Error('El proveedor seleccionado no existe.');
            }
        }

        const toners = series.map(serie => ({
            serie,
            modelo,
            marca_id: marca ? marca.id: null,
            tipo,
            ubicacion: ubicacion || 'Almacén',
            cliente_id: cliente ? cliente.id : null,
            proyecto_id: proyecto ? proyecto.id : null,
            fecha_entrada: new Date(),
            proveedor_id: proveedor ? proveedor.id : null,
        }));

        await models.Toner.bulkCreate(toners);

        return {
            mensaje: "Tóneres registrados exitosamente",
            total: series.length
        };
    }

}

module.exports = new TonerService();
