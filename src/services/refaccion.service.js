const { models } = require('../config/db');

class RefaccionService {
  async obtenerRefacciones() {
    return await models.Refaccion.findAll();
  }

  async crearRefaccion(data) {
    return await models.Refaccion.create(data);
  }

  async registrarLoteRefacciones(data) {
    const {
      tipo, 
      marca_id,
      proveedor_id,
      cliente_id,
      proyecto_id,
      empresa_id,
      refacciones
    } = data;
  
    // Validación básica
    if (!Array.isArray(refacciones) || refacciones.length === 0) {
      throw new Error('La lista de refacciones no puede estar vacía.');
    }
  
    // Validar marca si aplica
    let marca = null;
    if (marca_id) {
      marca = await models.Marca.findOne({ where: { id: marca_id } });
      if (!marca) throw new Error('La marca seleccionada no existe.');
    }
  
    // Validar cliente
    let cliente = null;
    if (cliente_id) {
      cliente = await models.Cliente.findOne({ where: { id: cliente_id } });
      if (!cliente) throw new Error('El cliente seleccionado no existe.');
    }
  
    // Validar proyecto
    let proyecto = null;
    if (proyecto_id) {
      if (!cliente_id) throw new Error('No se puede registrar un proyecto sin cliente.');
      proyecto = await models.Proyecto.findOne({ where: { id: proyecto_id } });
      if (!proyecto) throw new Error('El proyecto seleccionado no existe.');
    }
  
    // Validar proveedor
    let proveedor = null;
    if (proveedor_id) {
      proveedor = await models.Proveedor.findOne({ where: { id: proveedor_id } });
      if (!proveedor) throw new Error('El proveedor seleccionado no existe.');
    }
  
    // Registrar refacciones (cada una como fila nueva)
    for (const ref of refacciones) {
      const numero_parte = ref.numero_parte.toUpperCase().trim();
      const cantidad = parseInt(ref.cantidad);
  
      if (!numero_parte || isNaN(cantidad) || cantidad <= 0) {
        throw new Error(`Datos inválidos para número de parte: "${numero_parte}"`);
      }
  
      await models.Refaccion.create({
        numero_parte,
        cantidad,
        tipo,
        marca_id: marca?.id || null,
        proveedor_id: proveedor?.id || null,
        cliente_id: cliente?.id || null,
        proyecto_id: proyecto?.id || null,
        empresa_id: empresa_id || null,
        fecha_ingreso: new Date()
      });
    }
  
    return {
      mensaje: 'Refacciones registradas correctamente.',
      total: refacciones.length
    };
  }

  async obtenerStockAgrupado() {
    const refacciones = await models.Refaccion.findAll({
      where: {
        fecha_salida: null
      },
      include: [
        { model: models.Marca, as: 'marca', attributes: ['id', 'nombre'] },
        { model: models.Proveedor, as: 'proveedor', attributes: ['id', 'nombre'] }
      ],
      raw: true,
      nest: true
    })

    // Agrupar por numero_parte
    const agrupadas = {}

    for (const ref of refacciones) {
      const clave = `${ref.numero_parte}-${ref.tipo}-${ref.marca?.id || 'null'}-${ref.proveedor?.id || 'null'}`

      if (!agrupadas[clave]) {
        agrupadas[clave] = {
          numero_parte: ref.numero_parte,
          tipo: ref.tipo,
          marca: ref.marca,
          proveedor: ref.proveedor || { nombre: 'Sin proveedor' },
          cantidad_total: 0
        }
      }

      agrupadas[clave].cantidad_total += ref.cantidad
    }

    return Object.values(agrupadas)
  }
}

module.exports = new RefaccionService();
