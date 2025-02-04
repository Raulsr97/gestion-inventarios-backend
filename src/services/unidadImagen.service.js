const { models } = require('../config/db');

class UnidadImagenService {
    async obtenerUnidadesImagen() {
        return await models.UnidadImagen.findAll();
    }

    async crearUnidadImagen(data) {
        return await models.UnidadImagen.create(data);
    }

    async registrarLote(data) {
        const { modelo, cliente_id, series } = data;

        const unidadesImagen = series.map(serie => ({
            numero_serie: serie,
            modelo,
            cliente_id: cliente_id || null,
            fecha_ingreso: new Date()
        }));

        await models.UnidadImagen.bulkCreate(unidadesImagen);

        return {
            mensaje: "Unidades de imagen registradas exitosamente",
            total: series.length
        };
    }
}

module.exports = new UnidadImagenService();
