const express = require('express');
const router = express.Router();

const dashboardService = require('../services/dashboard.service');

router.get('/stock', async (req, res) => {
  try {
    const resultado = await dashboardService.obtenerStockDesglosado();
    res.json(resultado);
  } catch (error) {
    console.error("Error en /dashboard/stock:", error);
    res.status(500).json({ message: 'Error al obtener el stock desglosado' });
  }
});

// Endpoint para obtener el desglose de productos vendidos en el año actual
router.get('/productos-vendidos', async (req, res) => {
  try {
    const data = await dashboardService.obtenerProductosVendidosDetalle();
    res.json(data);
  } catch (error) {
    console.error('Error al obtener productos vendidos:', error);
    res.status(500).json({ message: 'Error al obtener productos vendidos' });
  }
});

// Total de ventas del año actual
router.get('/ventas-totales', async (req, res) => {
  const data = await dashboardService.obtenerVentasTotalesAnioActual();
  res.json(data);
});

// Lista de meses disponibles en el año actual con ventas
router.get('/ventas-meses', async (req, res) => {
  const data = await dashboardService.obtenerMesesDisponiblesVentas();
  res.json(data);
});

// Total de clientes con productos tipo "Compra" entregados
router.get('/clientes-con-compras/total', async (req, res) => {
  try {
    const total = await dashboardService.obtenerTotalClientesAtendidos();
    res.json({ total });
  } catch (error) {
    console.error('Error al obtener total de clientes:', error);
    res.status(500).json({ message: 'Error al obtener total de clientes' });
  }
});

// Detalle de productos entregados por cliente
router.get('/clientes-con-compras/detalle', async (req, res) => {
  try {
    const data = await dashboardService.obtenerClientesConProductosEntregados();
    res.json(data);
  } catch (error) {
    console.error('Error al obtener detalle de clientes:', error);
    res.status(500).json({ message: 'Error al obtener detalle de clientes' });
  }
});

router.get('/proveedores-activos/detalle', async (req, res, next) => {
  try {
    const resultado = await dashboardService.obtenerProveedoresConProductosIngresados();
    res.json(resultado);
  } catch (error) {
    next(error);
  }
});


router.get('/proyectos-realizados/detalle', async (req, res) => {
  try {
    const resultado = await dashboardService.obtenerProyectosConMovimientos();
      res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener proyectos' });
  }
});

// Metricas de Ventas
router.get('/ventas-por-mes', async (req, res) => {
  try {
    const resultado = await dashboardService.obtenerVentasPorMes();
    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener ventas por mes' });
  }
});

// Metricas de proveedores
router.get('/proveedores-porcentaje', async (req, res) => {
  try {
    const resultado = await dashboardService.obtenerProductosPorProveedor();
    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener productos por proveedor' });
  }
});

// Metricas por clientes
router.get('/clientes-porcentaje', async (req, res) => {
  try {
    const resultado = await dashboardService.obtenerProductosPorCliente();
    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener productos por cliente' });
  }
});

// Metricas consumibles mas vendidos
router.get('/consumibles-mas-vendidos', async (req, res) => {
  try {
    const resultado = await dashboardService.obtenerConsumiblesMasVendidos();
    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener consumibles más vendidos' });
  }
});



module.exports = router;
