const { models } = require('../config/db');

class TonerService {
    async obtenerToners() {
        return await models.Toner.findAll();
    }

    async crearToner(data) {
        return await models.Toner.create(data);
    }

    async registrarLote(data) {
        const { modelo, cliente_id, series } = data;

        const toners = series.map(serie => ({
            numero_serie: serie,
            modelo,
            cliente_id: cliente_id || null,
            fecha_ingreso: new Date()
        }));

        await models.Toner.bulkCreate(toners);

        return {
            mensaje: "Tóneres registrados exitosamente",
            total: series.length
        };
    }

}

module.exports = new TonerService();
