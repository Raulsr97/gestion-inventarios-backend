const express = require('express');
const clienteRoutes = require('./cliente.router');
const proyectoRoutes = require('./proyecto.router')
const impresoraRoutes = require('./impresora.router')
const tonerRoutes = require('./toner.router')
const refaccionRoutes = require('./refaccion.router')
const unidadImagenRoutes = require('./unidadImagen.router')
const marcaRoutes = require('./marca.router')
const proveedorRoutes = require('./proveedor.router')

function routerApi(app) {
    const router = express.Router();
    app.use('/api', router);
    router.use('/clientes', clienteRoutes);
    router.use('/proyectos', proyectoRoutes);
    router.use('/impresoras', impresoraRoutes);
    router.use('/toners', tonerRoutes);
    router.use('/refacciones', refaccionRoutes);
    router.use('/unidades-imagen', unidadImagenRoutes);
    router.use('/marcas',marcaRoutes)
    router.use('/proveedores', proveedorRoutes)
}

module.exports = routerApi;
