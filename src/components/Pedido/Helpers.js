
export function getDataFormat(dataTable) {
    const cabeceraOrdenada = dataTable.sort((a, b) => b.idPedido - a.idPedido);

    let idPedido = 0
    const cabeceraMap = cabeceraOrdenada.map(data => {
        if (data.idPedido !== idPedido) {
            idPedido = data.idPedido
            return data
        }
    })
    const cabeceraFiltro = cabeceraMap.filter((dataMap) => dataMap !== undefined)
    const cabecera = cabeceraFiltro.map(data => {
        return {
            idPedido: data.idPedido,
            nrofac: data.nrofac,
            FECHA: data.fecha,
            HORAFIN: data.horaEstimadaFin,
            RETIRO: data.tipoEnvio,
            DESCUENTO: data.montoDescuento,
            TOTALPEDIDO: data.totalCosto,
            FORMAPAGO: data.formaPago,
            PAGADO: data.pagado,
            ESTADO: data.estado,
            CANCELAR: data.CANCELAR,
            PENDIENTE: data.PENDIENTE,
            FACTURA: data.FACTURA,
        }
    })

    const getGroupDetailsMap = (details) => {
        const detailsMap = {};

        details.forEach((detail) => {
            if (!detailsMap[detail.idPedido]) {
                detailsMap[detail.idPedido] = [detail];
            } else {
                detailsMap[detail.idPedido].push(detail);
            }
        })
        return detailsMap
    }

    const detalle = getGroupDetailsMap(dataTable)

    return cabecera.map((row) => {
        return {
            ...row,
            articulo: detalle[row.idPedido]
        }
    })
}
