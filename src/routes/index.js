const express = require('express');
const clienteRoutes = require('./cliente.router');
const proyectoRoutes = require('./proyecto.router')
const impresoraRoutes = require('./impresora.router')
const tonerRoutes = require('./toner.router')
const refaccionRoutes = require('./refaccion.router')
const unidadImagenRoutes = require('./unidadImagen.router')
const marcaRoutes = require('./marca.router')
const proveedorRoutes = require('./proveedor.router')
const accesorioRoutes = require('./accesorio.router')
const remisionRoutes = require('./remision.router')
const remisionTonerRoutes = require('./remisionToner.router')
const remisionUnidadImgRoutes = require('./remisionUnidadImg.router')
const remisionRefaccionRoutes = require('../routes/remisionRefaccion.router')
const empresaRouter = require('./empresa.router')
const remisionRecoleccionRoutes = require('./remisionRecoleccion.router')
const remisionConsultaRouter = require('./remisionConsulta.router');
const dashboardRoutes = require('./dashboard.router')



function routerApi(app) {
    const router = express.Router();
    app.use('/api', router);
    router.use('/dashboard', dashboardRoutes);
    router.use('/clientes', clienteRoutes);
    router.use('/proyectos', proyectoRoutes);
    router.use('/impresoras', impresoraRoutes);
    router.use('/toners', tonerRoutes);
    router.use('/refacciones', refaccionRoutes);
    router.use('/unidades-imagen', unidadImagenRoutes);
    router.use('/marcas',marcaRoutes)
    router.use('/proveedores', proveedorRoutes)
    router.use('/accesorios', accesorioRoutes)
    router.use('/remisiones', remisionRoutes)
    router.use('/remisiones-toner', remisionTonerRoutes)
    router.use('/remisiones-unidad-imagen', remisionUnidadImgRoutes)
    router.use('/remisiones-refaccion', remisionRefaccionRoutes)
    router.use('/empresas', empresaRouter)
    router.use('/remisiones-recoleccion', remisionRecoleccionRoutes)
    router.use('/remisiones-consulta', remisionConsultaRouter)
}

module.exports = routerApi;
