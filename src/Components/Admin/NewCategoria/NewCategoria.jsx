import React, { useState, useEffect } from 'react';
import './NewCategoria.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import baseURL from '../../url';
import Swal from 'sweetalert2';
import { fetchUsuario, getUsuario } from '../../user';
export default function NewCategoria() {
    const [mensaje, setMensaje] = useState('');
    const [categoria, setCategoria] = useState('');
    const [modalOpen, setModalOpen] = useState(false);

    const toggleModal = () => {
        setCategoria('');
        setMensaje('');
        setModalOpen(!modalOpen);
    };


    const crear = async () => {
        const formData = new FormData();
        formData.append('categoria', categoria);

        setMensaje('Procesando...');

        try {
            const response = await fetch(`${baseURL}/categoriasPost.php`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.mensaje) {
                setMensaje('');
                toast.success(data.mensaje);
                toggleModal();
                window.location.reload();
            } else if (data.error) {
                setMensaje('');
                toast.error(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            setMensaje('');
            toast.error('Error de conexión. Por favor, inténtelo de nuevo.');
        }
    };
    //Trae usuario logueado-----------------------------
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            await fetchUsuario();
            setLoading(false);
        };

        fetchData();
    }, []);
    const usuarioLegued = getUsuario();
    const alertPermiso = () => {
        Swal.fire(
            '¡Error!',
            '¡No tienes permisos!',
            'error'
        );
    }
    return (
        <div className='NewContain'>
            <ToastContainer />
            {loading ? (
                <></>
            ) : usuarioLegued?.idUsuario ? (
                <>
                    {usuarioLegued?.rol === 'admin' ? (
                        <button onClick={toggleModal} className='btnSave'>
                            <span>+</span> Categoria
                        </button>
                    ) : usuarioLegued?.rol === 'colaborador' ? (
                        <button onClick={toggleModal} className='btnSave'>
                            <span>+</span> Categoria
                        </button>
                    ) : (
                        <></>
                    )}
                </>
            ) : (
                <button onClick={toggleModal} className='btnSave'>
                    <span>+</span> Categoria
                </button>
            )}
            {modalOpen && (
                <div className='modal'>
                    <div className='modal-content'>
                        <div className='deFlexBtnsModal'>
                            <button className='selected'>Agregar Categoria</button>
                            <span className="close" onClick={toggleModal}>&times;</span>
                        </div>
                        <form id="crearForm">
                            <fieldset>
                                <legend>Categoría</legend>
                                <input
                                    type='text'
                                    name='categoria'
                                    value={categoria}
                                    onChange={(e) => setCategoria(e.target.value)}
                                />
                            </fieldset>
                            {mensaje ? (
                                <button type='button' className='btnLoading' disabled>
                                    {mensaje}
                                </button>
                            ) : (
                                <button type='button' onClick={crear} className='btnPost'>
                                    Agregar
                                </button>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
