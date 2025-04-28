const { model, models } = require('../config/db')

class RemisionesCombinadasService {
  async buscarRemisionesCombinadas(filtros = {}) {
    const { numero_remision, estado, empresa_id, cliente_id, proyecto_id } = filtros
    
    // Filtros dinamicos para cada tabla
    const filtrosEntrega = {}
    const filtrosRecoleccion = {}

    if (numero_remision) {
      filtrosEntrega.numero_remision = numero_remision
      filtrosRecoleccion.numero_remision = numero_remision
    }

    if (estado) {
      filtrosEntrega.estado = estado
      filtrosRecoleccion.estado = estado
    }

    if (empresa_id) {
      filtrosEntrega.empresa_id = empresa_id
      filtrosRecoleccion.empresa_id = empresa_id
    }

    if (cliente_id) {
      filtrosEntrega.cliente_id = cliente_id
      filtrosRecoleccion.cliente_id = cliente_id
    }

    if (proyecto_id) {
      filtrosEntrega.proyecto_id = proyecto_id
      filtrosRecoleccion.proyecto_id = proyecto_id
    }

    // Consultar remisiones entrega
    const remisionesEntrega = await models.Remision.findAll({
      where: filtrosEntrega,
      include: [
        { model: models.Cliente, as: 'cliente', attributes: ['id', 'nombre']},
        { model: models.Proyecto, as: 'proyecto', attributes: ['id', 'nombre'] },
        { model: models.Empresa, as: 'empresa', attributes: ['id', 'nombre'] },
        { model: models.Impresora, as: 'impresoras', attributes: ['serie'], through: { attributes: []} },
        { model: models.Toner, as: 'toners', attributes: ['serie'], through: { attributes: []}  },
        { model: models.UnidadImagen, as: 'unidadesimg', attributes: ['serie'], through: { attributes: []}  },
        { model: models.Refaccion, as: 'refacciones', attributes: ['id'], through: { attributes: []}}
      ],
      order: [['fecha_emision', 'DESC']]
    })

    // Consultar remisiones de recolección
    const remisionesRecoleccion = await models.RemisionRecoleccion.findAll({
      where: filtrosRecoleccion,
      include: [
        { model: models.Cliente, as: 'cliente', attributes: ['id', 'nombre'] },
        { model: models.Proyecto, as: 'proyecto', attributes: ['id', 'nombre'] },
        { model: models.Empresa, as: 'empresa', attributes: ['id', 'nombre'] },
      ],
      order: [['fecha_emision', 'DESC']]
    })

    // Añadir tipo a cada remision para difereneciarla en el frontend
    const remisionesConTipo = [
      ...remisionesEntrega.map(r => {
        const data = r.toJSON()
        let categoria = null

        if (data.toners?.length > 0) categoria = 'toner'
        else if (data.unidadesimg?.length > 0) categoria = 'unidad_imagen';
        else if (data.impresoras?.length > 0) categoria = 'impresora';
        else if (data.refacciones?.length > 0) categoria = 'refaccion' 

        return { ...data, tipo: 'entrega', categoria }
      }),
      ...remisionesRecoleccion.map(r => ({ ...r.toJSON(), tipo: 'recoleccion' }))
    ]

    // Ordenar todas por fecha de emision (mas reciente primero)
    remisionesConTipo.sort((a, b) => new Date(b.fecha_emision) - new Date(a.fecha_emision))

    return remisionesConTipo
  }
}

module.exports = new RemisionesCombinadasService() 