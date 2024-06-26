import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import DataTable from "react-data-table-component";
import { ExpandedComponent, paginationOptions, noData } from './columns'
import Loading from "../Loading/Loading";
import apiFeco from "../../Services/apiServices";
import UserContext from "../../context/userContext";
import Cookies from "js-cookie";
import { getDataFormat } from './Helpers'
import dayjs from "dayjs";
import { CheckSquareFill } from "react-bootstrap-icons";
import { Modal } from "react-bootstrap"

const INITIAL_STATE = {
    dateDesde: '',
    dateHasta: '',
}

export default function TablaPedidosDelivery() {
    const { user } = useContext(UserContext)
    const [loading, setLoading] = useState(false)
    const [dataTable, setDataTable] = useState([])
    const navigate = useRouter()
    const [formData, setFormData] = useState(INITIAL_STATE)
    const [disabledSend, setDisabledSend] = useState(true)
    const [open, setOpen] = useState(false)
    const [dataRow, setDataRow] = useState()

    useEffect(async () => {
        handleLoad()
    }, [])

    async function handleLoad() {
        setLoading(true)
        try {
            const { data: pedidos } = await apiFeco.post('vinos/tomarPedidoDelivery', { dateDesde: formData.dateDesde, dateHasta: formData.dateHasta })
            console.log(pedidos.data)
            const dataFormat = getDataFormat(pedidos.data)
            console.log(dataFormat)
            setDataTable(dataFormat)
            setLoading(false)
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    async function handlePago(row) {
        const idPedido = row.idPedido
        if (window.confirm('¿Desea marcar el pedido ' + idPedido + ' como entregado?')) {
            const { data: pedidoEntregado } = await apiFeco.post('vinos/pedidoEntregado', { idPedido })
            handleLoad()
        }
    }

    async function handleDetalle(row) {
        setOpen(true)
        setDataRow(row)
    }

    function handleChangeForm(event) {
        const { name, value } = event.target;
        let newFormData;
        newFormData = { ...formData, [name]: value };
        setFormData(newFormData);
    }
    useEffect(() => {
        handleCheck()
    }, [formData])
    function handleCheck() {

        /*if (formData.dateDesde === '' || formData.dateHasta === '') {
            setDisabledSend(true)
            return
        }*/
        setDisabledSend(false)
    }

    const columnsTable = [
        {
            name: 'N° Pedido',
            selector: row => row.idPedido,
            center: true,
        },
        {
            name: 'Fecha',
            selector: row => row.FECHA,
            center: true,
            format: (row) => {
                const fecha = dayjs(row.FECHA).format('DD/MM/YYYY')
                return fecha
            }
        },
        {
            name: 'Nombre',
            selector: row => row.NOMBRE,
            center: true,
        },
        {
            name: 'Telefono',
            selector: row => row.TELEFONO,
            center: true,
        },
        {
            name: 'Domicilio',
            left: true,
            selector: row => row.DOMICILIO,
            center: true,
        },
        {
            name: 'Localidad',
            selector: row => row.LOCALIDAD,
            center: true,
        },
        {
            name: 'Importe Facturado',
            selector: row => row.TOTALPEDIDO,
            right: true,
            format: (row) => {
                const TOTALPEDIDO = (row.TOTALPEDIDO)
                return '$' + TOTALPEDIDO.toFixed(2)
            }
        },
        {
            name: 'Estado',
            selector: row => row.ESTADO,
            center: true,

            format: (row) => {
                if (row.ESTADO === 0) {
                    return 'Pendiente'
                }
                if (row.ESTADO === 1) {
                    return 'Confirmado/En Preparacion'
                }
                if (row.ESTADO === 2) {
                    return 'Finalizado'
                }
                if (row.ESTADO === 3) {
                    return 'Cancelado'
                }
                if (row.ESTADO === 4) {
                    return 'Entregado'
                }
            }
        },
        {
            name: 'Pagado',
            selector: row => row.PAGADO,
            center: true,

            format: (row) => {
                if (row.PAGADO === 0) {
                    return 'NO'
                }
                if (row.PAGADO === 1) {
                    return 'SI'
                }
            }
        },
        {
            name: 'Entregado',
            selector: row => row.PAGADO,

            center: true,
            format: (row) => {
                if (row.PAGADO === 1 && row.ESTADO === 2) {
                    return <div onClick={() => handlePago(row)}>
                        <CheckSquareFill style={{ color: 'green', width: '25px', height: '25px', cursor: 'pointer' }} />
                    </div>
                } else if (row.ESTADO === 4) {
                    return 'SI'
                }
                else {
                    return 'NO'
                }
            }
        },
        {
            name: '',
            center: true,
            cell: (row) => {
                return (
                    <div onClick={() => handleDetalle(row)}>
                        <button>Domicilio</button>
                        <style jsx>{`
                            button {
                                background-color: #E11919;
                                color: white;
                                border: none;
                                border-radius: 10px;
                                font-size: 14px;
                                transition: 0.3s;
                                padding: 5px 10px;
                                cursor: pointer;
                                display: inline-block;
                                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); 
                            }

                            button:hover {
                                color: black;
                                background-color: #FF0000;
                            }
                    `}</style>
                    </div>
                );
            }
        },
    ]

    return (
        <>
            <Modal
                show={open}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >

                <div className="modaldiv">
                    <h3 className="titulomodal">Domicilio Pedido: {dataRow ? dataRow.idPedido : ''}</h3>
                    <div>
                        <button className="botonModal" onClick={() => setOpen(false)}>X</button>
                    </div>
                </div>

                <Modal.Body>
                    <p>Direccion: {dataRow ? dataRow.DOMICILIO : ''}</p>
                    <p>Localidad: {dataRow ? dataRow.LOCALIDAD : ''}</p>
                </Modal.Body>
            </Modal>

            {<>
                <div className="barraNav">
                    <header>
                        <h1>Pedidos Delivery</h1>
                        {/*<label>Desde</label>
                        <input onChange={handleChangeForm} value={formData.dateDesde} type="date" name="dateDesde" />

                        <label>Hasta</label>
                        <input onChange={handleChangeForm} value={formData.dateHasta} type="date" name="dateHasta" />*/}

                        <button onClick={handleLoad} disabled={disabledSend} className={disabledSend || loading ? 'button_disabled' : 'button'}>Actualizar</button>
                    </header>
                </div>
                <div className="divTable">
                    <DataTable
                        data={dataTable}
                        columns={columnsTable}
                        noDataComponent={noData}
                        expandableRows
                        expandableRowsComponent={ExpandedComponent}
                        pagination
                        paginationComponentOptions={paginationOptions}
                        progressPending={loading}
                        progressComponent={<Loading message='Cargando pedidos...' fontSize='20' />}
                    />
                </div>
            </>
            }
            <style jsx>{`
                .botonModal {
                    margin: 5px;
                    background-color: #E11919;
                    color: white;
                    border: none;
                    border-radius: 10px; 
                    font-size: 14px; 
                    transition: 0.3s;
                    padding: 5px 10px;
                    cursor: pointer;
                    display: inline-block;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    width: 30px;
                    text-transform:uppercase;
                }
                .botonModal:hover {
                    color: black;
                    background-color: #FF0000;
                }
                .modaldiv{
                    display:flex;
                    justify-content: space-between;
                    border-bottom: 1px solid gray;
                    padding: 10px;
                }
                .titulomodal{
                    margin: 5px;
                }
                .divTable{
                    margin: 40px 15px 5px 15px;
                    box-shadow: 1px 1px 4px black;
                    border-top-left-radius: 15px;
                    border-top-right-radius: 15px;
                }
                header {
                    display:flex;
                    justify-content: space-between;
                }
                .barraNav {
                    border: 2px solid #cecaca;
                    border-radius: 10px;
                    background-color: #fff;
                    margin: 50px 10px 0 10px;
                    box-shadow: 1px 2px 1px grey;
                }
                h1 {
                    margin:15px;
                }
                button {
                    margin: 15px;
                    background-color: #E11919;
                    color: white;
                    border-radius: 20px;
                    font-size: 17px;
                    transition: 0.5s;
                    padding: 5px;
                    border: none;
                    width: 150px;
                    text-transform:uppercase;
                }
                button:hover {
                    color: black;
                    background-color: #FF0000;
                }
                .button_disabled{
                    margin: 15px;
                    transition: 0.5s;
                    background-color:grey;
                    color: white;
                    border-radius: 20px;
                    font-size: 17px;
                    transition: 0.5s;
                    padding: 5px;
                    border: none;
                    width: auto;
                    min-width: 120px;
                    text-transform:uppercase;
                }
                .button_disabled:hover{
                    color: black;
                }
                input, select{
                    margin: 15px;
                    width: auto; /* Cambiado de un ancho fijo a auto para adaptarse a diferentes tamaños de pantalla */
                    border-radius: 10px;
                    border: 2px solid #cecaca;
                    padding: 3px;
                }
                label{
                    margin: 25px;
                    font-size: 15px;
                    font-weight: bold;
                    text-transform:uppercase;
                }
                @media (max-width: 700px) {
                    header {
                        flex-direction: column;
                        align-items: center;
                    }
                    .divBtn{
                        flex-direction: column;
                        align-items: center;
                    }
                    input, select{
                     margin: 5px;
                     }
                    label{
                     margin: 0px;
                     font-size: 15px;
                     }
                    button {
                      margin-top:12px; /* Añadido margen superior para evitar que los elementos estén demasiado juntos en pantallas pequeñas */
                      margin-bottom:12px; /* Añadido margen inferior para evitar que los elementos estén demasiado juntos en pantallas pequeñas */
                      background-color: rgb(138, 13, 111);
                      color: white;
                      border-radius:20px; 
                      font-size:17px; 
                      transition:.5s; 
                      padding :5px; 
                      border:none; 
                      /* Cambiado de un ancho fijo a auto para adaptarse a diferentes tamaños de pantalla */
                      text-transform :uppercase; 
                    }
                 }
            `}</style>
        </>
    )
}
