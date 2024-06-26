import { useContext, useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import dayjs from "dayjs"
import { Trash3, PencilSquare, X, Check } from "react-bootstrap-icons"
import RubroIngredientesForm from "./RubroIngredientesForm"
import RubroIngredientesEdit from "./RubroIngredientesEdit"
import UserContext from "../../context/userContext"
import api from "../../Services/apiServices"
import Loading from "../Loading/Loading"
const Columns = (handleDelete, handleEdit) => (
    [
        {
            name: 'Nro Ingrediente',
            selector: row => row.subrubro,
            wrap: true,
            sortable: true,
            center: true,
        },
        {
            name: 'Denominacion',
            selector: row => row.denominacion,
            wrap: true,
            sortable: true,
            center: true,
        },
        {
            name: 'Estado',
            selector: row => {
                if (row.habilitado === 1) {
                    return "Habilitado"
                }
                else if (row.habilitado === 0) {
                    return "Deshabilitado"
                }
                else {
                    return ""
                }
            },
            wrap: true,
            sortable: true,
            center: true,
        },
        {
            name: 'EDITAR',
            center: true,
            cell: (row) => {
                return (
                    <div onClick={() => handleEdit(row)}>
                        <PencilSquare
                            style={{ color: 'black', cursor: 'pointer' }}
                            width={30}
                            height={30}
                        />
                    </div>
                );
            }
        },
        /*{
            name: 'Eliminar',
            center: true,
            cell: (row) => {
                if (row.authrrhh) {
                    return ''
                }
                return <div onClick={() => handleDelete(row)}>
                    <Trash3
                        style={{ color: 'red', cursor: 'pointer' }}
                        width={30}
                        height={30}
                    />
                </div>
            }
        },*/
    ]
)

export default function RubroIngredientesTable() {
    const { user } = useContext(UserContext)
    const [dataTable, setDataTable] = useState([])
    const [show, setShow] = useState(false)
    const [showEdit, setEdit] = useState(false)
    const [loading, setLoading] = useState(false)
    const [datoRow, setdatoRow] = useState()

    useEffect(() => {
        if (Object.keys(user).length) {
            handleLoad()
        }
    }, [user])

    async function handleLoad() {
        setLoading(true)
        try {
            const { data: getIngredientes } = await api.post('rubroIngredientes/getRubroIngredientes')
            setDataTable(getIngredientes.data)
        } catch (error) {
            setDataTable([])
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(row) {
        try {
            if (window.confirm('¿Desea borrar el ingrediente ' + row.denominacion + '?')) {
                const { data: deleteIngredientes } = await api.post('rubroIngredientes/deleteRubroIngredientes', { idRubro: row.idRubro })
            }
        } catch (error) {

        } finally {
            handleLoad()
        }
    }

    function handleShow() {
        setShow(!show)
        if (show) {
            handleLoad()
        }
    }

    async function handleEdit(row) {
        setdatoRow(row)
        setEdit(!showEdit)
        if (showEdit) {
            handleLoad()
        }
    }

    const noData = <strong style={{ color: 'red', textAlign: 'center' }}>No se encontraron ingredientes</strong>

    const customStyles = {
        table: {
            style: {
                maxHeight: "500px",
                overflow: "auto",
            },
        },
    };
    return (
        <>
            {
                show
                    ? <RubroIngredientesForm
                        handleShow={handleShow}
                    /> : showEdit
                        ? <RubroIngredientesEdit
                            handleShow={handleEdit}
                            datoRow={datoRow}
                        />
                        : <>
                            <div>
                                <header>
                                    <h1>Rubro Ingredientes</h1>
                                    <button onClick={handleShow}>Nuevo</button>
                                </header>
                            </div>
                            <div>
                                <DataTable
                                    columns={Columns(handleDelete, handleEdit)}
                                    data={dataTable}
                                    progressPending={loading}
                                    progressComponent={<Loading message='Cargando datos...' marginLeft={20} />}
                                    noDataComponent={noData}
                                    highlightOnHover
                                    fixedHeader={true}
                                    resizable={true}
                                    customStyles={customStyles}
                                />
                            </div>
                        </>
            }
            <style jsx>{`
                header {
                    display:flex;
                    justify-content: space-between;
                }
                div {
                    border: 2px solid #cecaca;
                    border-radius: 10px;
                    background-color: #fff;
                    margin: 20px 10px 10px 10px;
                    box-shadow: 1px 2px 1px grey;
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
                h1 {
                    margin:15px;
                }
            `}</style>
        </>
    )
}
