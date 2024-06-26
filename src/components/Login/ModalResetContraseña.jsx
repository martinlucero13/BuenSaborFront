import dayjs from "dayjs"
import { useContext, useState } from "react"
import { Modal } from "react-bootstrap"
import apiFeco from "../../Services/apiServices"
import Loading from '../Loading/Loading'


export default function ModalResetContraseña({ show, setShow }) {
    const [datos, setDatos] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()
        if (Object.keys(datos).length < 3) {
            setError('Los campos no pueden estar vacios')
            return
        }
        setError('')
        setLoading(true)
        verificarDatos()
    }

    async function verificarDatos() {
        const { data: datosUser } = await apiFeco.post('user/dataUser', { usuario: datos.usuario })
        const { usuario, email, telefono } = datosUser.data[0]

        if (String(usuario) === datos.usuario && String(email) === datos.mail && Number(telefono) == datos.telefono) {
            reestablecerContraseña(usuario, telefono)
        } else {
            setError('datos incorrectos')
            setLoading(false)
        }
    }

    async function reestablecerContraseña(usuario, telefono) {
        try {
            const { data: cambioContraseña } = await apiFeco.post('user/resetClave', { usuario, telefono })
            console.log(cambioContraseña.data)
            if (cambioContraseña.statusCode === 200) {
                alert('Se establecio la contraseña, la nueva clave es: ' + cambioContraseña.data)
            } else {
                alert('No se pudo reestablecer la contraseña, intente nuevamente mas tarde')
            }
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
        setShow(false)
    }

    function cancel() {
        setShow(false)
        setError('')
    }

    function handleChange(e) {
        const { value, name } = e.target
        setDatos({ ...datos, [name]: value })
    }

    return (
        <>
            <Modal
                show={show}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body>
                    <h1>Reestablecer contraseña</h1>
                    <main className='formulario'>
                        <div className="form-floating">
                            <input
                                type="text"
                                className="form-control mb-1"
                                placeholder="Usuario"
                                name='usuario'
                                onChange={handleChange}
                            />
                            <label htmlFor="usuario">Usuario</label>
                        </div>
                        <div className="form-floating">
                            <input
                                type="text"
                                className="form-control mb-1"
                                placeholder="Mail"
                                name='mail'
                                onChange={handleChange}
                            />
                            <label htmlFor="mail">Mail</label>
                        </div>
                        <div className="form-floating">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Telefono"
                                name='telefono'
                                onChange={handleChange}
                            />
                            <label htmlFor="telefono">Telefono</label>
                        </div>

                        {/*<div className="form-floating">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nombre"
                                name='nombre'
                                onChange={handleChange}
                            />
                            <label htmlFor="nombre">Nombre</label>
                        </div>

                        <div className="form-floating">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Apellido"
                                name='apellido'
                                onChange={handleChange}
                            />
                            <label htmlFor="apellido">Apellido</label>
                        </div>
                        <div className="form-floating">
                            <input
                                type="date"
                                className="form-control"
                                placeholder="Fecha"
                                name='fecha'
                                onChange={handleChange}
                            />
                            <label htmlFor="repcontraseña">Fecha nacimiento</label>
                        </div>*/}
                        <button disabled={loading} onClick={handleSubmit} className="w-100 btn btn-lg btn-light mt-2" id='buttonLogin'>
                            REESTABLECER
                        </button>
                        <button onClick={cancel} className="w-100 btn btn-lg btn-light mt-2" id='buttonLogin'>
                            CANCELAR
                        </button>
                        {error && <strong>{error}</strong>}
                    </main>
                    {
                        loading &&
                        <div>
                            <Loading message='Cambiando Contraseña...' />
                        </div>
                    }
                </Modal.Body>
            </Modal>
            <style jsx>{`
                main{
                    display:flex;
                    flex-direction:column;
                    text-align: center;
                    align-items:center;
                }
                button{
                    background-color: rgb(189, 15, 151);
                    color: white;
                    max-width: 200px;
                    transition: 0.2s;
                }
                button:hover{
                    background-color: rgb(189, 15, 151);
                    color: #000;;
                    max-width: 210px;
                    font-size: 19px;
                }
                h1{
                    align-items:center;
                    text-align: center;
                    margin-bottom: 30px;
                }
                strong{
                    color:red;
                    margin-top: 10px;
                    font-size: 17px;
                    text-transform: uppercase;
                }
                div{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-top: 5px;
                }
                input{
                    width: 200px;
                    transition: 0.2s;
                }
            `}</style>
        </>
    )
}
