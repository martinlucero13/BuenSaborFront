import api from "../../../src/Services/api"

export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { dateDesde } = req.body;
        const { dateHasta } = req.body;
        const { data: getEstadisticasClientes } = await api.get(`/estadisticas/getEstadisticasClientes?dateDesde=${dateDesde}&dateHasta=${dateHasta}`);
        res.statusCode = 200;
        res.json(getEstadisticasClientes);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}
