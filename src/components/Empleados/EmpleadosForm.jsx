import { useContext, useEffect, useState } from "react";
import Loading from '../Loading/Loading'
import api from "../../Services/apiServices";
import UserContext from "../../context/userContext";

const INITIAL_STATE = {
    usuario: '',
    clave: '',
    rol: 0,
    nombre: '',
    apellido: '',
    telefono: 0,
    email: '',
    calle: '',
    numero: 0,
    localidad: '',
}

export default function EmpleadosForm({ handleShow }) {
    const { user } = useContext(UserContext)
    const [formData, setFormData] = useState(INITIAL_STATE)
    const [disabledSend, setDisabledSend] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [transition, setTransition] = useState(false)

    useEffect(() => {
        handleCheck()
    }, [formData])

    useEffect(() => {
        // Después de que se haya realizado la animación, restablecer el estado de newItemAdded
        if (transition) {
            const timeoutId = setTimeout(() => {
                setTransition(false)
            }, 500) // Ajusta el tiempo de espera según la duración de tu transición CSS
            return () => clearTimeout(timeoutId)
        }
    }, [transition])

    function handleChangeForm(event) {
        const { name, value } = event.target
        if (name === 'type') {
            setTransition(true)
            setFormData({ ...INITIAL_STATE, [name]: value })
            return
        }
        setFormData({ ...formData, [name]: value })
    }

    async function handleSubmit() {
        setLoading(true)
        setError('')
        try {
            const dataToSend = {
                ...formData,
            }
            const { data: createEmpleados } = await api.post('empleados/createEmpleados', { fromData: dataToSend })
            if (createEmpleados.statusCode === 200) {
                alert('Se guardaron los datos')
                setFormData(INITIAL_STATE)
                setError('')
                handleShow()
            } else {
                throw new Error()
            }
        } catch (error) {
            setError('Error al guardar datos, intententelo nuevamente')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    function handleCheck() {
        const values = Object.values(formData);
        if (values.includes('') || values.some(value => value < 0)) {
            setDisabledSend(true);
            return;
        }
        setDisabledSend(false);
    }

    return (
        <>
            <main>
                <div>
                    <h2>Nuevo Empleado</h2>
                    <section className={transition ? "element-hidden" : "element"}>
                        <label>Usuario</label>
                        <textarea placeholder="usuario.example" maxLength={200} onChange={handleChangeForm} value={formData.usuario} type="text" name="usuario" />
                    </section>
                    <section className={transition ? "element-hidden" : "element"}>
                        <label>Clave</label>
                        <input placeholder="password" maxLength={200} onChange={handleChangeForm} value={formData.clave} type="password" name="clave" />
                    </section>
                    <section>
                        <label>Rol</label>
                        <select onChange={handleChangeForm} value={formData.rol} type="date" name="rol" >
                            <option value=""></option>
                            <option value="2">Cajero</option>
                            <option value="3">Delivery</option>
                            <option value="4">Cocinero</option>
                            <option value="5">Administrador</option>
                        </select>
                    </section>
                    <section className={transition ? "element-hidden" : "element"}>
                        <label>Nombre</label>
                        <input placeholder="nombre" maxLength={200} onChange={handleChangeForm} value={formData.nombre} type="text" name="nombre" />
                    </section>
                    <section className={transition ? "element-hidden" : "element"}>
                        <label>Apellido</label>
                        <input placeholder="apellido" maxLength={200} onChange={handleChangeForm} value={formData.apellido} type="text" name="apellido" />
                    </section>
                    <section className={transition ? "element-hidden" : "element"}>
                        <label>Telefono</label>
                        <input placeholder="2615983806" onChange={handleChangeForm} value={formData.telefono} type="number" name="telefono" style={{ textAlign: "right" }} />
                    </section>
                    <section className={transition ? "element-hidden" : "element"}>
                        <label>Email</label>
                        <input placeholder="usuario@gmail.com" maxLength={200} onChange={handleChangeForm} value={formData.email} type="email" name="email" />
                    </section>
                    <section className={transition ? "element-hidden" : "element"}>
                        <label>Calle</label>
                        <input placeholder="calle" maxLength={200} onChange={handleChangeForm} value={formData.calle} type="text" name="calle" />
                    </section>
                    <section className={transition ? "element-hidden" : "element"}>
                        <label>Numero</label>
                        <input onChange={handleChangeForm} value={formData.numero} type="number" name="numero" style={{ textAlign: "right" }} />
                    </section>
                    <section className={transition ? "element-hidden" : "element"}>
                        <label>Localidad</label>
                        <input placeholder="localidad" maxLength={200} onChange={handleChangeForm} value={formData.localidad} type="text" name="localidad" />
                    </section>
                    <section>
                        {
                            error &&
                            <strong>{error}</strong>
                        }
                        {
                            loading &&
                            <Loading
                                message='Guardando datos...'
                            />
                        }
                    </section>
                    <button onClick={handleSubmit} disabled={disabledSend} className={disabledSend || loading ? 'button_disabled' : 'button'}>Guardar</button>
                    <button onClick={handleShow} className='button'>Cancelar</button>
                </div>
            </main>
            <style jsx>{`
                main{
                    display: flex;
                    flex-direction:column;
                    justify-content:center;
                    align-items: center;
                    padding:20px;
                }
                div{
                    display: flex;
                    flex-direction:column;
                    justify-content:center;
                    align-items: center;
                    border: 2px solid #cecaca;
                    border-radius: 10px;
                    background-color: #fff;
                    width: 320px;
                    padding: 10px;
                    transition: 0.5 ease;
                }
                label{
                    font-size: 15px;
                    font-weight: bold;
                    text-transform:uppercase;
                    margin-top: 5px;
                }
                .label-receta{
                    font-size: 13px;
                    font-weight: bold;
                    text-transform: uppercase;
                    text-align: center;

                }
                input, select{
                    width: 220px;
                    border-radius: 10px;
                    border: 2px solid #cecaca;
                    padding: 3px;
                }
                textArea{
                    width: 220px;
                    border-radius: 10px;
                    border: 2px solid #cecaca;
                    padding: 3px;
                    resize: none;
                }
                .button{
                    margin-top: 10px;
                    background-color: #E11919;
                    color: white;
                    border-radius: 20px;
                    font-size: 17px;
                    transition: 0.5s;
                    padding: 5px;
                    border: none;
                    width: 220px;
                    text-transform:uppercase;
                }
                .button_disabled{
                    margin-top: 10px;
                    transition: 0.5s;
                    background-color:grey;
                    color: white;
                    border-radius: 20px;
                    font-size: 17px;
                    transition: 0.5s;
                    padding: 5px;
                    border: none;
                    width: 220px;
                    text-transform:uppercase;
                }
                button:hover{
                    color: black;
                }
                .button:hover{
                    color: black;
                    background-color: #FF0000;
                }
                .buttonImage{
                    position: absolute;
                    top: 0;
                    right: 0;
                    border-radius: 50px;
                    background-color: grey;
                    z-index: 1;
                    width: 25px;
                    height: 25px;
                    text-align: center;
                    cursor: pointer;
                    margin: 0;
                    padding: 0;
                }
                section{
                    display:flex;
                    flex-direction: column;
                    text-transform:uppercase;
                    text-align:center;
                    margin: 3px 0;
                }
                p{
                    margin:0;
                    font-size: 15px;
                    color:red;
                    text-transform:uppercase;
                    text-align: center;
                }
                strong{
                    text-transform:uppercase;
                    text-align: center;
                    color:red;
                }
                h2{
                    font-size: 27px;
                }
                article {
                    position: relative;
                    display: flex;
                    flex-direction: row;
                    background-color: rgb(167,167,167);
                    margin: 3px 0;
                }
                .element-hidden{
                    opacity: 0;
                }
                .element{
                    opacity: 1;
                    transition: opacity .7s ease;
                }
            `}
            </style>
        </>
    )
}
