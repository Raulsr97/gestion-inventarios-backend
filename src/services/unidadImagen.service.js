const { Op } = require('sequelize');
const { models } = require('../config/db');

class UnidadImagenService {
    async obtenerUnidadesImagen() {
        return await models.UnidadImagen.findAll({
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
        });
    }

    async crearUnidadImagen(data) {
        return await models.UnidadImagen.create(data);
    }

    async registrarLoteUnidadesImagen(data) {
        const {
          modelo,
          tipo,
          ubicacion,
          marca_id,
          cliente_id,
          proyecto_id,
          proveedor_id,
          empresa_id,
          series
        } = data;
      
        let marca = null;
        if (marca_id) {
          marca = await models.Marca.findOne({ where: { id: marca_id } });
          if (!marca) throw new Error('La marca seleccionada no existe.');
        }
      
        let cliente = null;
        if (cliente_id) {
          cliente = await models.Cliente.findOne({ where: { id: cliente_id } });
          if (!cliente) throw new Error('El cliente seleccionado no existe.');
        }
      
        let proyecto = null;
        if (proyecto_id) {
          if (!cliente_id) throw new Error('No se puede registrar un proyecto sin un cliente.');
          proyecto = await models.Proyecto.findOne({ where: { id: proyecto_id } });
          if (!proyecto) throw new Error('El proyecto seleccionado no existe.');
        }
      
        let proveedor = null;
        if (proveedor_id) {
          proveedor = await models.Proveedor.findOne({ where: { id: proveedor_id } });
          if (!proveedor) throw new Error('El proveedor seleccionado no existe.');
        }
      
        const unidades = series.map(serie => ({
          serie,
          modelo,
          tipo,
          ubicacion: ubicacion || 'Almacen',
          marca_id: marca?.id || null,
          cliente_id: cliente?.id || null,
          proyecto_id: proyecto?.id || null,
          proveedor_id: proveedor?.id || null,
          empresa_id: empresa_id || null,
          fecha_ingreso: new Date()
        }));
      
        await models.UnidadImagen.bulkCreate(unidades);
      
        return {
          mensaje: 'Unidades de imagen registradas exitosamente',
          total: series.length
        };
    }

    async contarPorTipoEnAlmacen () {
      const resultados = await models.UnidadImagen.findAll({
        attributes: [
          'tipo', 
          [Sequelize.fn('COUNT', Sequelize.col('serie')), 'cantidad']
        ],
        where: { ubicacion: 'Almacen'},
        group: ['tipo'],
      })

      return resultados
        .map(item => ({
        tipo: item.tipo,
        cantidad: item.getDataValue('cantidad')
        }))
    }
    
    async obtenerMovimientosdelMes() {
      const ahora = new Date() // Obtenemos la fecha actual
      const mesActual = ahora.getMonth() + 1 // Los meses en Javascript van de 0 a 11, sumamos 1 para obtener el mes corecto
      const anioActual = ahora.getFullYear() // Obtenemos el año actual

      // Filtrar impresoras con fecha de entrada en este mes
      const entradas = await models.UnidadImagen.count({
        where: {
          fecha_entrada: {
            [Op.gte]: new Date(anioActual, mesActual -1, 1), // Desde el 1 del mes actual
            [Op.lt]: new Date(anioActual, mesActual, 1) // Hasta el 1 del siguiente mes
          }
        }
      })

      // Filtar impresoras con fecha de salida en este mes
      const salidas = await models.UnidadImagen.count({
        where: {
          fecha_salida: {
            [Op.gte]: new Date(anioActual, mesActual - 1, 1),
            [Op.lt]: new Date(anioActual, mesActual, 1)
          }
        }
      })

      return { entradas, salidas }
    }
      
}

module.exports = new UnidadImagenService();
