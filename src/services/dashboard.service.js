const { Op } = require("sequelize");
const { models } = require('../config/db')

class dashboardService {
  async obtenerStockDesglosado() {
    const resultado = {
      Compra: {
        impresoras: {},
        toners: {},
        unidad_imagen: {},
        refacciones: {},
      },
      Distribucion: {
        impresoras: {},
        toners: {},
        unidad_imagen: {},
        refacciones: {},
      }
    };

    // 🔹 Impresoras
    const impresoras = await models.Impresora.findAll({
      where: { ubicacion: 'Almacen' },
      attributes: ['tipo', 'modelo'],
      raw: true
    });

    for (const imp of impresoras) {
      const tipo = imp.tipo || 'Compra';
      const modelo = imp.modelo || 'Sin modelo';
      if (!resultado[tipo].impresoras[modelo]) {
        resultado[tipo].impresoras[modelo] = 0;
      }
      resultado[tipo].impresoras[modelo] += 1;
    }

    // 🔹 Tóners
    const toners = await models.Toner.findAll({
      where: { ubicacion: 'Almacen' },
      attributes: ['tipo', 'modelo'],
      raw: true
    });

    for (const toner of toners) {
      const tipo = toner.tipo || 'Compra';
      const modelo = toner.modelo || 'Sin modelo';
      if (!resultado[tipo].toners[modelo]) {
        resultado[tipo].toners[modelo] = 0;
      }
      resultado[tipo].toners[modelo] += 1;
    }

    // 🔹 Unidades de Imagen
    const unidades = await models.UnidadImagen.findAll({
      where: { ubicacion: 'Almacen' },
      attributes: ['tipo', 'modelo'],
      raw: true
    });

    for (const unidad of unidades) {
      const tipo = unidad.tipo || 'Compra';
      const modelo = unidad.modelo || 'Sin modelo';
      if (!resultado[tipo].unidad_imagen[modelo]) {
        resultado[tipo].unidad_imagen[modelo] = 0;
      }
      resultado[tipo].unidad_imagen[modelo] += 1;
    }

    // 🔹 Refacciones
    const refacciones = await models.Refaccion.findAll({
      where: { fecha_salida: null },
      attributes: ['tipo', 'numero_parte'],
      raw: true
    });

    for (const ref of refacciones) {
      const tipo = ref.tipo || 'Compra';
      const parte = ref.numero_parte || 'Sin número';
      if (!resultado[tipo].refacciones[parte]) {
        resultado[tipo].refacciones[parte] = 0;
      }
      resultado[tipo].refacciones[parte] += 1;
    }

    return resultado;
  }

  async obtenerProductosVendidosDetalle() {
    const hoy = new Date();
    const anioActual = hoy.getFullYear();
  
    const fechaInicio = new Date(`${anioActual}-01-01T00:00:00`);
    const fechaFin = new Date(`${anioActual}-12-31T23:59:59`);
  
    const conteo = {};
  
    // 🔹 Impresoras
    const impresoras = await models.Impresora.findAll({
      where: {
        tipo: 'Compra',
        ubicacion: 'Entregado',
        fecha_entrega_final: {
          [Op.gte]: fechaInicio,
          [Op.lte]: fechaFin
        }
      },
      include: [
        { model: models.Marca, as: 'marca', attributes: ['nombre'] }
      ],
      raw: true,
      nest: true
    });
  
    for (const imp of impresoras) {
      const clave = `impresora-${imp.modelo}-${imp.marca?.nombre || 'Sin marca'}`;
      if (!conteo[clave]) {
        conteo[clave] = {
          tipo: 'impresora',
          modelo: imp.modelo,
          marca: imp.marca?.nombre || 'Sin marca',
          cantidad: 0,
          fechas: []
        };
      }
      conteo[clave].cantidad += 1;
      conteo[clave].fechas.push(imp.fecha_entrega_final);
    }
  
    // 🔹 Toners
    const toners = await models.Toner.findAll({
      where: {
        tipo: 'Compra',
        ubicacion: 'Entregado',
        fecha_entrega_final: {
          [Op.gte]: fechaInicio,
          [Op.lte]: fechaFin
        }
      },
      include: [
        { model: models.Marca, as: 'marca', attributes: ['nombre'] }
      ],
      raw: true,
      nest: true
    });
  
    for (const toner of toners) {
      const clave = `toner-${toner.modelo}-${toner.marca?.nombre || 'Sin marca'}`;
      if (!conteo[clave]) {
        conteo[clave] = {
          tipo: 'toner',
          modelo: toner.modelo,
          marca: toner.marca?.nombre || 'Sin marca',
          cantidad: 0,
          fechas: []
        };
      }
      conteo[clave].cantidad += 1;
      conteo[clave].fechas.push(toner.fecha_entrega_final);
    }
  
    // 🔹 Unidades de Imagen
    const unidades = await models.UnidadImagen.findAll({
      where: {
        tipo: 'Compra',
        ubicacion: 'Entregado',
        fecha_entrega_final: {
          [Op.gte]: fechaInicio,
          [Op.lte]: fechaFin
        }
      },
      include: [
        { model: models.Marca, as: 'marca', attributes: ['nombre'] }
      ],
      raw: true,
      nest: true
    });
  
    for (const unidad of unidades) {
      const clave = `unidad_imagen-${unidad.modelo}-${unidad.marca?.nombre || 'Sin marca'}`;
      if (!conteo[clave]) {
        conteo[clave] = {
          tipo: 'unidad_imagen',
          modelo: unidad.modelo,
          marca: unidad.marca?.nombre || 'Sin marca',
          cantidad: 0,
          fechas: []
        };
      }
      conteo[clave].cantidad += 1;
      conteo[clave].fechas.push(unidad.fecha_entrega_final);
    }
  
    // 🔹 Refacciones
    const refacciones = await models.Refaccion.findAll({
      where: {
        tipo: 'Compra',
        cliente_id: { [Op.ne]: null },
        fecha_salida: {
          [Op.gte]: fechaInicio,
          [Op.lte]: fechaFin
        }
      },
      include: [
        { model: models.Marca, as: 'marca', attributes: ['nombre'] }
      ],
      raw: true,
      nest: true
    });
  
    for (const ref of refacciones) {
      const clave = `refaccion-${ref.numero_parte}-${ref.marca?.nombre || 'Sin marca'}`;
      if (!conteo[clave]) {
        conteo[clave] = {
          tipo: 'refaccion',
          modelo: ref.numero_parte,
          marca: ref.marca?.nombre || 'Sin marca',
          cantidad: 0,
          fechas: []
        };
      }
      conteo[clave].cantidad += 1;
      conteo[clave].fechas.push(ref.fecha_salida);
    }
  
    // Tomamos una fecha representativa (la primera, o podrías usar la más reciente si prefieres)
    for (const clave in conteo) {
      const fechas = conteo[clave].fechas;
      conteo[clave].fecha = fechas?.[0] || null;
      delete conteo[clave].fechas;
    }
  
    return Object.values(conteo);
  }
  
  async obtenerVentasTotalesAnioActual() {
    const anioActual = new Date().getFullYear()

    const [ impresoras, toners, unidades, refacciones] = await Promise.all([
      models.Impresora.count({
        where: {
          tipo: 'Compra',
          ubicacion: 'Entregado',
          fecha_entrega_final: {
            [Op.gte]: new Date(`${anioActual}-01-01`),
            [Op.lte]: new Date(`${anioActual}-12-31`)
          }
        }
      }),
      models.Toner.count({
        where: {
          tipo: 'Compra',
          ubicacion: 'Entregado',
          fecha_entrega_final: {
            [Op.gte]: new Date(`${anioActual}-01-01`),
            [Op.lte]: new Date(`${anioActual}-12-31`)
          }
        }
      }),
      models.UnidadImagen.count({
        where: {
          tipo: 'Compra',
          ubicacion: 'Entregado',
          fecha_entrega_final: {
            [Op.gte]: new Date(`${anioActual}-01-01`),
            [Op.lte]: new Date(`${anioActual}-12-31`)
          }
        }
      }),
      models.Refaccion.count({
        where: {
          tipo: 'Compra',
          fecha_salida: { [Op.ne]: null },
          fecha_salida: {
            [Op.gte]: new Date(`${anioActual}-01-01`),
            [Op.lte]: new Date(`${anioActual}-12-31`)
          }
        }
      }),
    ])

    return {
      anio: anioActual,
      total: impresoras + toners + unidades + refacciones
    }
  }

  async obtenerMesesDisponiblesVentas() {
    const fechas = [];
  
    // 🔹 Extraer fechas de impresoras, toners y unidades de imagen
    const [impresoras, toners, unidades] = await Promise.all([
      models.Impresora.findAll({
        where: {
          tipo: 'Compra',
          ubicacion: 'Entregado',
          fecha_entrega_final: { [Op.ne]: null }
        },
        attributes: ['fecha_entrega_final'],
        raw: true
      }),
      models.Toner.findAll({
        where: {
          tipo: 'Compra',
          ubicacion: 'Entregado',
          fecha_entrega_final: { [Op.ne]: null }
        },
        attributes: ['fecha_entrega_final'],
        raw: true
      }),
      models.UnidadImagen.findAll({
        where: {
          tipo: 'Compra',
          ubicacion: 'Entregado',
          fecha_entrega_final: { [Op.ne]: null }
        },
        attributes: ['fecha_entrega_final'],
        raw: true
      })
    ]);
  
    // 🔹 Extraer fechas de refacciones
    const refacciones = await models.Refaccion.findAll({
      where: {
        tipo: 'Compra',
        fecha_salida: { [Op.ne]: null }
      },
      attributes: ['fecha_salida'],
      raw: true
    });
  
    // 🔸 Unificar todas las fechas
    fechas.push(
      ...impresoras.map((i) => i.fecha_entrega_final),
      ...toners.map((t) => t.fecha_entrega_final),
      ...unidades.map((u) => u.fecha_entrega_final),
      ...refacciones.map((r) => r.fecha_salida)
    );
  
    // 🔸 Agrupar por año-mes
    const meses = new Set();
    fechas.forEach((fecha) => {
      const f = new Date(fecha);
      const mes = (f.getMonth() + 1).toString().padStart(2, '0');
      const anio = f.getFullYear();
      meses.add(`${anio}-${mes}`);
    });
  
    return Array.from(meses).sort((a, b) => new Date(b) - new Date(a));
  }

  async obtenerTotalClientesAtendidos() {
    const clientesSet = new Set();
  
    // Impresoras
    const impresoras = await models.Impresora.findAll({
      where: {
        tipo: 'Compra',
        ubicacion: 'Entregado',
        cliente_id: { [Op.ne]: null }
      },
      attributes: ['cliente_id'],
      raw: true
    });
  
    impresoras.forEach(i => clientesSet.add(i.cliente_id));
  
    // Toners
    const toners = await models.Toner.findAll({
      where: {
        tipo: 'Compra',
        ubicacion: 'Entregado',
        cliente_id: { [Op.ne]: null }
      },
      attributes: ['cliente_id'],
      raw: true
    });
  
    toners.forEach(t => clientesSet.add(t.cliente_id));
  
    // 📸 Unidades de Imagen
    const unidades = await models.UnidadImagen.findAll({
      where: {
        tipo: 'Compra',
        ubicacion: 'Entregado',
        cliente_id: { [Op.ne]: null }
      },
      attributes: ['cliente_id'],
      raw: true
    });
  
    unidades.forEach(u => clientesSet.add(u.cliente_id));
  
    //  Refacciones
    const refacciones = await models.Refaccion.findAll({
      where: {
        tipo: 'Compra',
        cliente_id: { [Op.ne]: null },
        fecha_salida: { [Op.ne]: null }
      },
      attributes: ['cliente_id'],
      raw: true
    });
  
    refacciones.forEach(r => clientesSet.add(r.cliente_id));
  
    return clientesSet.size;
  }

  async obtenerClientesConProductosEntregados() {
    const resultados = {};
  
    // 🔹 Impresoras
    const impresoras = await models.Impresora.findAll({
      where: {
        tipo: 'Compra',
        ubicacion: 'Entregado',
        cliente_id: { [Op.ne]: null },
        fecha_entrega_final: { [Op.ne]: null }
      },
      include: [
        { model: models.Cliente, as: 'cliente', attributes: ['id', 'nombre'] },
        { model: models.Marca, as: 'marca', attributes: ['nombre'] },
        { model: models.Empresa, as: 'empresa', attributes: ['nombre'] }
      ],
      raw: true,
      nest: true
    });
  
    for (const imp of impresoras) {
      const cliente = imp.cliente?.nombre || 'Sin cliente';
      if (!resultados[cliente]) resultados[cliente] = [];
  
      const existente = resultados[cliente].find(p =>
        p.tipo === 'impresora' &&
        p.modelo === imp.modelo &&
        p.marca === (imp.marca?.nombre || 'Sin marca') &&
        p.empresa === (imp.empresa?.nombre || 'Sin empresa') &&
        p.fecha === new Date(imp.fecha_entrega_final).toISOString().split('T')[0]
      );
  
      if (existente) {
        existente.cantidad += 1;
      } else {
        resultados[cliente].push({
          tipo: 'impresora',
          modelo: imp.modelo,
          marca: imp.marca?.nombre || 'Sin marca',
          empresa: imp.empresa?.nombre || 'Sin empresa',
          fecha: new Date(imp.fecha_entrega_final).toISOString().split('T')[0],
          cantidad: 1
        });
      }
    }
  
    // 🔸 Toners
    const toners = await models.Toner.findAll({
      where: {
        tipo: 'Compra',
        ubicacion: 'Entregado',
        cliente_id: { [Op.ne]: null },
        fecha_entrega_final: { [Op.ne]: null }
      },
      include: [
        { model: models.Cliente, as: 'cliente', attributes: ['id', 'nombre'] },
        { model: models.Marca, as: 'marca', attributes: ['nombre'] },
        { model: models.Empresa, as: 'empresa', attributes: ['nombre'] }
      ],
      raw: true,
      nest: true
    });
  
    for (const toner of toners) {
      const cliente = toner.cliente?.nombre || 'Sin cliente';
      if (!resultados[cliente]) resultados[cliente] = [];
  
      const existente = resultados[cliente].find(p =>
        p.tipo === 'toner' &&
        p.modelo === toner.modelo &&
        p.marca === (toner.marca?.nombre || 'Sin marca') &&
        p.empresa === (toner.empresa?.nombre || 'Sin empresa') &&
        p.fecha === new Date(toner.fecha_entrega_final).toISOString().split('T')[0]
      );
  
      if (existente) {
        existente.cantidad += 1;
      } else {
        resultados[cliente].push({
          tipo: 'toner',
          modelo: toner.modelo,
          marca: toner.marca?.nombre || 'Sin marca',
          empresa: toner.empresa?.nombre || 'Sin empresa',
          fecha: new Date(toner.fecha_entrega_final).toISOString().split('T')[0],
          cantidad: 1
        });
      }
    }
  
    // 🟡 Unidades de Imagen
    const unidades = await models.UnidadImagen.findAll({
      where: {
        tipo: 'Compra',
        ubicacion: 'Entregado',
        cliente_id: { [Op.ne]: null },
        fecha_entrega_final: { [Op.ne]: null }
      },
      include: [
        { model: models.Cliente, as: 'cliente', attributes: ['id', 'nombre'] },
        { model: models.Marca, as: 'marca', attributes: ['nombre'] },
        { model: models.Empresa, as: 'empresa', attributes: ['nombre'] }
      ],
      raw: true,
      nest: true
    });
  
    for (const unidad of unidades) {
      const cliente = unidad.cliente?.nombre || 'Sin cliente';
      if (!resultados[cliente]) resultados[cliente] = [];
  
      const existente = resultados[cliente].find(p =>
        p.tipo === 'unidad_imagen' &&
        p.modelo === unidad.modelo &&
        p.marca === (unidad.marca?.nombre || 'Sin marca') &&
        p.empresa === (unidad.empresa?.nombre || 'Sin empresa') &&
        p.fecha === new Date(unidad.fecha_entrega_final).toISOString().split('T')[0]
      );
  
      if (existente) {
        existente.cantidad += 1;
      } else {
        resultados[cliente].push({
          tipo: 'unidad_imagen',
          modelo: unidad.modelo,
          marca: unidad.marca?.nombre || 'Sin marca',
          empresa: unidad.empresa?.nombre || 'Sin empresa',
          fecha: new Date(unidad.fecha_entrega_final).toISOString().split('T')[0],
          cantidad: 1
        });
      }
    }
  
    // ⚙️ Refacciones
    const refacciones = await models.Refaccion.findAll({
      where: {
        tipo: 'Compra',
        cliente_id: { [Op.ne]: null },
        fecha_salida: { [Op.ne]: null }
      },
      include: [
        { model: models.Cliente, as: 'cliente', attributes: ['id', 'nombre'] },
        { model: models.Marca, as: 'marca', attributes: ['nombre'] },
        { model: models.Empresa, as: 'empresa', attributes: ['nombre'] }
      ],
      raw: true,
      nest: true
    });
  
    for (const ref of refacciones) {
      const cliente = ref.cliente?.nombre || 'Sin cliente';
      if (!resultados[cliente]) resultados[cliente] = [];
  
      const existente = resultados[cliente].find(p =>
        p.tipo === 'refaccion' &&
        p.modelo === ref.numero_parte &&
        p.marca === (ref.marca?.nombre || 'Sin marca') &&
        p.empresa === (ref.empresa?.nombre || 'Sin empresa') &&
        p.fecha === new Date(ref.fecha_salida).toISOString().split('T')[0]
      );
  
      if (existente) {
        existente.cantidad += 1;
      } else {
        resultados[cliente].push({
          tipo: 'refaccion',
          modelo: ref.numero_parte,
          marca: ref.marca?.nombre || 'Sin marca',
          empresa: ref.empresa?.nombre || 'Sin empresa',
          fecha: new Date(ref.fecha_salida).toISOString().split('T')[0],
          cantidad: 1
        });
      }
    }
  
    // Convertimos a array
    return Object.entries(resultados).map(([cliente, productos]) => ({
      cliente,
      productos
    }));
  }

  async obtenerProveedoresConProductosIngresados() {
    const resultados = {};

    const añoActual = new Date().getFullYear();
    const fechaInicio = new Date(`${añoActual}-01-01`);
    const fechaFin = new Date(`${añoActual}-12-31`);
  
    // 🔹 Impresoras
    const impresoras = await models.Impresora.findAll({
      where: {
        tipo: 'Compra',
        proveedor_id: { [Op.ne]: null },
        fecha_entrada: { [Op.between]: [fechaInicio, fechaFin] }
      },
      include: [
        { model: models.Proveedor, as: 'proveedor', attributes: ['id', 'nombre'] },
        { model: models.Marca, as: 'marca', attributes: ['nombre'] },
        { model: models.Empresa, as: 'empresa', attributes: ['nombre'] }
      ],
      raw: true,
      nest: true
    });
  
    for (const imp of impresoras) {
      const proveedor = imp.proveedor?.nombre || 'Sin proveedor';
      if (!resultados[proveedor]) resultados[proveedor] = [];
  
      const existente = resultados[proveedor].find(p =>
        p.tipo === 'impresora' &&
        p.modelo === imp.modelo &&
        p.marca === (imp.marca?.nombre || 'Sin marca') &&
        p.empresa === (imp.empresa?.nombre || 'Sin empresa') &&
        p.fecha === new Date(imp.fecha_entrada).toISOString().split('T')[0]
      );
  
      if (existente) {
        existente.cantidad += 1;
      } else {
        resultados[proveedor].push({
          tipo: 'impresora',
          modelo: imp.modelo,
          marca: imp.marca?.nombre || 'Sin marca',
          empresa: imp.empresa?.nombre || 'Sin empresa',
          fecha: new Date(imp.fecha_entrada).toISOString().split('T')[0],
          cantidad: 1
        });
      }
    }
  
    // 🔸 Toners
    const toners = await models.Toner.findAll({
      where: {
        tipo: 'Compra',
        proveedor_id: { [Op.ne]: null },
        fecha_entrada: { [Op.between]: [fechaInicio, fechaFin] }
      },
      include: [
        { model: models.Proveedor, as: 'proveedor', attributes: ['id', 'nombre'] },
        { model: models.Marca, as: 'marca', attributes: ['nombre'] },
        { model: models.Empresa, as: 'empresa', attributes: ['nombre'] }
      ],
      raw: true,
      nest: true
    });
  
    for (const toner of toners) {
      const proveedor = toner.proveedor?.nombre || 'Sin proveedor';
      if (!resultados[proveedor]) resultados[proveedor] = [];
  
      const existente = resultados[proveedor].find(p =>
        p.tipo === 'toner' &&
        p.modelo === toner.modelo &&
        p.marca === (toner.marca?.nombre || 'Sin marca') &&
        p.empresa === (toner.empresa?.nombre || 'Sin empresa') &&
        p.fecha === new Date(toner.fecha_entrada).toISOString().split('T')[0]
      );
  
      if (existente) {
        existente.cantidad += 1;
      } else {
        resultados[proveedor].push({
          tipo: 'toner',
          modelo: toner.modelo,
          marca: toner.marca?.nombre || 'Sin marca',
          empresa: toner.empresa?.nombre || 'Sin empresa',
          fecha: new Date(toner.fecha_entrada).toISOString().split('T')[0],
          cantidad: 1
        });
      }
    }
  
    // 🟡 Unidades de Imagen
    const unidades = await models.UnidadImagen.findAll({
      where: {
        tipo: 'Compra',
        proveedor_id: { [Op.ne]: null },
        fecha_entrada: { [Op.between]: [fechaInicio, fechaFin] }
      },
      include: [
        { model: models.Proveedor, as: 'proveedor', attributes: ['id', 'nombre'] },
        { model: models.Marca, as: 'marca', attributes: ['nombre'] },
        { model: models.Empresa, as: 'empresa', attributes: ['nombre'] }
      ],
      raw: true,
      nest: true
    });
  
    for (const unidad of unidades) {
      const proveedor = unidad.proveedor?.nombre || 'Sin proveedor';
      if (!resultados[proveedor]) resultados[proveedor] = [];
  
      const existente = resultados[proveedor].find(p =>
        p.tipo === 'unidad_imagen' &&
        p.modelo === unidad.modelo &&
        p.marca === (unidad.marca?.nombre || 'Sin marca') &&
        p.empresa === (unidad.empresa?.nombre || 'Sin empresa') &&
        p.fecha === new Date(unidad.fecha_entrada).toISOString().split('T')[0]
      );
  
      if (existente) {
        existente.cantidad += 1;
      } else {
        resultados[proveedor].push({
          tipo: 'unidad_imagen',
          modelo: unidad.modelo,
          marca: unidad.marca?.nombre || 'Sin marca',
          empresa: unidad.empresa?.nombre || 'Sin empresa',
          fecha: new Date(unidad.fecha_entrada).toISOString().split('T')[0],
          cantidad: 1
        });
      }
    }
  
    // ⚙️ Refacciones
    const refacciones = await models.Refaccion.findAll({
      where: {
        tipo: 'Compra',
        proveedor_id: { [Op.ne]: null },
        fecha_entrada: { [Op.between]: [fechaInicio, fechaFin] }
      },
      include: [
        { model: models.Proveedor, as: 'proveedor', attributes: ['id', 'nombre'] },
        { model: models.Marca, as: 'marca', attributes: ['nombre'] },
        { model: models.Empresa, as: 'empresa', attributes: ['nombre'] }
      ],
      raw: true,
      nest: true
    });
  
    for (const ref of refacciones) {
      const proveedor = ref.proveedor?.nombre || 'Sin proveedor';
      if (!resultados[proveedor]) resultados[proveedor] = [];
  
      const existente = resultados[proveedor].find(p =>
        p.tipo === 'refaccion' &&
        p.modelo === ref.numero_parte &&
        p.marca === (ref.marca?.nombre || 'Sin marca') &&
        p.empresa === (ref.empresa?.nombre || 'Sin empresa') &&
        p.fecha === new Date(ref.fecha_entrada).toISOString().split('T')[0]
      );
  
      if (existente) {
        existente.cantidad += 1;
      } else {
        resultados[proveedor].push({
          tipo: 'refaccion',
          modelo: ref.numero_parte,
          marca: ref.marca?.nombre || 'Sin marca',
          empresa: ref.empresa?.nombre || 'Sin empresa',
          fecha: new Date(ref.fecha_entrada).toISOString().split('T')[0],
          cantidad: 1
        });
      }
    }
  
    // 🔥 Convertimos resultados a array
    return Object.entries(resultados).map(([proveedor, productos]) => ({
      proveedor,
      productos
    }));
  }
  
  async obtenerProyectosConMovimientos() {
    const resultados = {};

  const añoActual = new Date().getFullYear();
  const fechaInicio = new Date(`${añoActual}-01-01`);
  const fechaFin = new Date(`${añoActual}-12-31`);

  // 🔹 Impresoras (controlamos flujo)
  const impresoras = await models.Impresora.findAll({
    where: {
      tipo: 'Distribucion',
      flujo: { [Op.in]: ['Distribución', 'Recolección'] },
      proyecto_id: { [Op.ne]: null },
      fecha_entrada: { [Op.between]: [fechaInicio, fechaFin] }
    },
    include: [
      { model: models.Proyecto, as: 'proyecto', attributes: ['id', 'nombre'] }
    ],
    raw: true,
    nest: true
  });

  for (const imp of impresoras) {
    const proyecto = imp.proyecto?.nombre || 'Sin proyecto';
    if (!resultados[proyecto]) resultados[proyecto] = { distribuciones: 0, recolecciones: 0 };

    if (imp.flujo === 'Distribución') {
      resultados[proyecto].distribuciones += 1;
    } else if (imp.flujo === 'Recolección') {
      resultados[proyecto].recolecciones += 1;
    }
  }

  // 🔸 Toners (solo sumamos en distribución)
  const toners = await models.Toner.findAll({
    where: {
      tipo: 'Distribución',
      proyecto_id: { [Op.ne]: null },
      fecha_entrada: { [Op.between]: [fechaInicio, fechaFin] }
    },
    include: [
      { model: models.Proyecto, as: 'proyecto', attributes: ['id', 'nombre'] }
    ],
    raw: true,
    nest: true
  });

  for (const toner of toners) {
    const proyecto = toner.proyecto?.nombre || 'Sin proyecto';
    if (!resultados[proyecto]) resultados[proyecto] = { distribuciones: 0, recolecciones: 0 };

    resultados[proyecto].distribuciones += 1;
  }

  // 🟡 Unidades de Imagen (solo sumamos en distribución)
  const unidades = await models.UnidadImagen.findAll({
    where: {
      tipo: 'Distribución',
      proyecto_id: { [Op.ne]: null },
      fecha_entrada: { [Op.between]: [fechaInicio, fechaFin] }
    },
    include: [
      { model: models.Proyecto, as: 'proyecto', attributes: ['id', 'nombre'] }
    ],
    raw: true,
    nest: true
  });

  for (const unidad of unidades) {
    const proyecto = unidad.proyecto?.nombre || 'Sin proyecto';
    if (!resultados[proyecto]) resultados[proyecto] = { distribuciones: 0, recolecciones: 0 };

    resultados[proyecto].distribuciones += 1;
  }

  // ⚙️ Refacciones (solo sumamos en distribución)
  const refacciones = await models.Refaccion.findAll({
    where: {
      tipo: 'Distribución',
      proyecto_id: { [Op.ne]: null },
      fecha_entrada: { [Op.between]: [fechaInicio, fechaFin] }
    },
    include: [
      { model: models.Proyecto, as: 'proyecto', attributes: ['id', 'nombre'] }
    ],
    raw: true,
    nest: true
  });

  for (const ref of refacciones) {
    const proyecto = ref.proyecto?.nombre || 'Sin proyecto';
    if (!resultados[proyecto]) resultados[proyecto] = { distribuciones: 0, recolecciones: 0 };

    resultados[proyecto].distribuciones += 1;
  }

  // 🔥 Convertimos resultados a array
  return Object.entries(resultados).map(([proyecto, movimientos]) => ({
    proyecto,
    distribuciones: movimientos.distribuciones,
    recolecciones: movimientos.recolecciones
  }));
  }

  async obtenerVentasPorMes() {
    const resultados = {
      1: 0,  // Enero
      2: 0,  // Febrero
      3: 0,  // Marzo
      4: 0,  // Abril
      5: 0,  // Mayo
      6: 0,  // Junio
      7: 0,  // Julio
      8: 0,  // Agosto
      9: 0,  // Septiembre
      10: 0, // Octubre
      11: 0, // Noviembre
      12: 0  // Diciembre
    };
  
    const añoActual = new Date().getFullYear();
    const fechaInicio = new Date(`${añoActual}-01-01`);
    const fechaFin = new Date(`${añoActual}-12-31`);
  
    // 🔹 Impresoras
    const impresoras = await models.Impresora.findAll({
      where: {
        tipo: 'Compra',
        ubicacion: 'Entregado',
        fecha_entrega_final: { [Op.between]: [fechaInicio, fechaFin] }
      },
      attributes: ['fecha_entrega_final'],
      raw: true
    });
  
    impresoras.forEach(imp => {
      if (imp.fecha_entrega_final) {
        const mes = new Date(imp.fecha_entrega_final).getMonth() + 1;
        resultados[mes]++;
      }
    });
  
    // 🔸 Toners
    const toners = await models.Toner.findAll({
      where: {
        tipo: 'Compra',
        ubicacion: 'Entregado',
        fecha_entrega_final: { [Op.between]: [fechaInicio, fechaFin] }
      },
      attributes: ['fecha_entrega_final'],
      raw: true
    });
  
    toners.forEach(toner => {
      if (toner.fecha_entrega_final) {
        const mes = new Date(toner.fecha_entrega_final).getMonth() + 1;
        resultados[mes]++;
      }
    });
  
    // 🟡 Unidades de Imagen
    const unidades = await models.UnidadImagen.findAll({
      where: {
        tipo: 'Compra',
        ubicacion: 'Entregado',
        fecha_entrega_final: { [Op.between]: [fechaInicio, fechaFin] }
      },
      attributes: ['fecha_entrega_final'],
      raw: true
    });
  
    unidades.forEach(unidad => {
      if (unidad.fecha_entrega_final) {
        const mes = new Date(unidad.fecha_entrega_final).getMonth() + 1;
        resultados[mes]++;
      }
    });
  
    // ⚙️ Refacciones
    const refacciones = await models.Refaccion.findAll({
      where: {
        tipo: 'Compra',
        fecha_salida: { [Op.between]: [fechaInicio, fechaFin] }
      },
      attributes: ['fecha_salida'],
      raw: true
    });
  
    refacciones.forEach(ref => {
      if (ref.fecha_salida) {
        const mes = new Date(ref.fecha_salida).getMonth() + 1;
        resultados[mes]++;
      }
    });
  
    // Formateamos la respuesta final
    const mesesNombre = [
      '', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];
  
    const respuesta = Object.keys(resultados).map(mesNum => ({
      mes: mesesNombre[parseInt(mesNum)],
      cantidad: resultados[mesNum]
    }));
  
    return respuesta;
  }

  async obtenerProductosPorProveedor() {
    const resultados = {};

    const añoActual = new Date().getFullYear();
    const fechaInicio = new Date(`${añoActual}-01-01`);
    const fechaFin = new Date(`${añoActual}-12-31`);

    // 🔹 Impresoras
    const impresoras = await models.Impresora.findAll({
      where: {
        tipo: 'Compra',
        proveedor_id: { [Op.ne]: null },
        fecha_entrada: { [Op.between]: [fechaInicio, fechaFin] }
      },
      include: [
        { model: models.Proveedor, as: 'proveedor', attributes: ['id', 'nombre'] }
      ],
      raw: true,
      nest: true
    });

    impresoras.forEach(imp => {
      const proveedor = imp.proveedor?.nombre || 'Sin proveedor';
      if (!resultados[proveedor]) resultados[proveedor] = 0;
      resultados[proveedor]++;
    });

    // 🔸 Toners
    const toners = await models.Toner.findAll({
      where: {
        tipo: 'Compra',
        proveedor_id: { [Op.ne]: null },
        fecha_entrada: { [Op.between]: [fechaInicio, fechaFin] }
      },
      include: [
        { model: models.Proveedor, as: 'proveedor', attributes: ['id', 'nombre'] }
      ],
      raw: true,
      nest: true
    });

    toners.forEach(toner => {
      const proveedor = toner.proveedor?.nombre || 'Sin proveedor';
      if (!resultados[proveedor]) resultados[proveedor] = 0;
      resultados[proveedor]++;
    });

    // 🟡 Unidades de Imagen
    const unidades = await models.UnidadImagen.findAll({
      where: {
        tipo: 'Compra',
        proveedor_id: { [Op.ne]: null },
        fecha_entrada: { [Op.between]: [fechaInicio, fechaFin] }
      },
      include: [
        { model: models.Proveedor, as: 'proveedor', attributes: ['id', 'nombre'] }
      ],
      raw: true,
      nest: true
    });

    unidades.forEach(unidad => {
      const proveedor = unidad.proveedor?.nombre || 'Sin proveedor';
      if (!resultados[proveedor]) resultados[proveedor] = 0;
      resultados[proveedor]++;
    });

    // ⚙️ Refacciones
    const refacciones = await models.Refaccion.findAll({
      where: {
        tipo: 'Compra',
        proveedor_id: { [Op.ne]: null },
        fecha_entrada: { [Op.between]: [fechaInicio, fechaFin] }
      },
      include: [
        { model: models.Proveedor, as: 'proveedor', attributes: ['id', 'nombre'] }
      ],
      raw: true,
      nest: true
    });

    refacciones.forEach(ref => {
      const proveedor = ref.proveedor?.nombre || 'Sin proveedor';
      if (!resultados[proveedor]) resultados[proveedor] = 0;
      resultados[proveedor]++;
    });

    // 🔥 Formateamos el resultado final
    const respuesta = Object.entries(resultados).map(([proveedor, cantidad]) => ({
      proveedor,
      cantidad
    }));

    return respuesta;
  }

  async obtenerProductosPorCliente() {
    const resultados = {};

    const añoActual = new Date().getFullYear();
    const fechaInicio = new Date(`${añoActual}-01-01`);
    const fechaFin = new Date(`${añoActual}-12-31`);

    // 🔹 Impresoras
    const impresoras = await models.Impresora.findAll({
      where: {
        tipo: 'Compra',
        cliente_id: { [Op.ne]: null },
        ubicacion: 'Entregado',
        fecha_entrega_final: { [Op.between]: [fechaInicio, fechaFin] }
      },
      include: [
        { model: models.Cliente, as: 'cliente', attributes: ['id', 'nombre'] }
      ],
      raw: true,
      nest: true
    });

    impresoras.forEach(imp => {
      const cliente = imp.cliente?.nombre || 'Sin cliente';
      if (!resultados[cliente]) resultados[cliente] = 0;
      resultados[cliente]++;
    });

    // 🔸 Toners
    const toners = await models.Toner.findAll({
      where: {
        tipo: 'Compra',
        cliente_id: { [Op.ne]: null },
        ubicacion: 'Entregado',
        fecha_entrega_final: { [Op.between]: [fechaInicio, fechaFin] }
      },
      include: [
        { model: models.Cliente, as: 'cliente', attributes: ['id', 'nombre'] }
      ],
      raw: true,
      nest: true
    });

    toners.forEach(toner => {
      const cliente = toner.cliente?.nombre || 'Sin cliente';
      if (!resultados[cliente]) resultados[cliente] = 0;
      resultados[cliente]++;
    });

    // 🟡 Unidades de Imagen
    const unidades = await models.UnidadImagen.findAll({
      where: {
        tipo: 'Compra',
        cliente_id: { [Op.ne]: null },
        ubicacion: 'Entregado',
        fecha_entrega_final: { [Op.between]: [fechaInicio, fechaFin] }
      },
      include: [
        { model: models.Cliente, as: 'cliente', attributes: ['id', 'nombre'] }
      ],
      raw: true,
      nest: true
    });

    unidades.forEach(unidad => {
      const cliente = unidad.cliente?.nombre || 'Sin cliente';
      if (!resultados[cliente]) resultados[cliente] = 0;
      resultados[cliente]++;
    });

    // ⚙️ Refacciones
    const refacciones = await models.Refaccion.findAll({
      where: {
        tipo: 'Compra',
        cliente_id: { [Op.ne]: null },
        fecha_salida: { [Op.between]: [fechaInicio, fechaFin] }
      },
      include: [
        { model: models.Cliente, as: 'cliente', attributes: ['id', 'nombre'] }
      ],
      raw: true,
      nest: true
    });

    refacciones.forEach(ref => {
      const cliente = ref.cliente?.nombre || 'Sin cliente';
      if (!resultados[cliente]) resultados[cliente] = 0;
      resultados[cliente]++;
    });

    // 🔥 Formateamos el resultado final
    const respuesta = Object.entries(resultados).map(([cliente, cantidad]) => ({
      cliente,
      cantidad
    }));

    return respuesta;
  }

  async obtenerConsumiblesMasVendidos() {
    const resultados = {};

    const añoActual = new Date().getFullYear();
    const fechaInicio = new Date(`${añoActual}-01-01`);
    const fechaFin = new Date(`${añoActual}-12-31`);

    // 🔹 Toners
    const toners = await models.Toner.findAll({
      where: {
        tipo: 'Compra',
        ubicacion: 'Entregado',
        fecha_entrega_final: { [Op.between]: [fechaInicio, fechaFin] }
      },
      include: [
        { model: models.Marca, as: 'marca', attributes: ['id', 'nombre'] }
      ],
      raw: true,
      nest: true
    });

    toners.forEach(toner => {
      const nombre = `${toner.marca?.nombre || 'Sin marca'} ${toner.modelo}`;
      if (!resultados[nombre]) resultados[nombre] = 0;
      resultados[nombre]++;
    });

    // 🟡 Unidades de Imagen
    const unidades = await models.UnidadImagen.findAll({
      where: {
        tipo: 'Compra',
        ubicacion: 'Entregado',
        fecha_entrega_final: { [Op.between]: [fechaInicio, fechaFin] }
      },
      include: [
        { model: models.Marca, as: 'marca', attributes: ['id', 'nombre'] }
      ],
      raw: true,
      nest: true
    });

    unidades.forEach(unidad => {
      const nombre = `${unidad.marca?.nombre || 'Sin marca'} ${unidad.modelo}`;
      if (!resultados[nombre]) resultados[nombre] = 0;
      resultados[nombre]++;
    });

    // 🔥 Formateamos el resultado final
    const respuesta = Object.entries(resultados).map(([nombre, cantidad]) => ({
      nombre,
      cantidad
    }));

    return respuesta;
  }
}

module.exports = new dashboardService()
