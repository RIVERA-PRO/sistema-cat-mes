import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './MiPedido.css';
import 'jspdf-autotable';
import baseURL from '../url';
import moneda from '../moneda';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
export default function MiPedido() {
    const [pedidos, setPedidos] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const [idPedido, setIdPedido] = useState('');
    const [pedidoDetalle, setPedidoDetalle] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    useEffect(() => {
        cargarPedidos();
    }, []);

    const cargarPedidos = () => {
        fetch(`${baseURL}/pedidoGet.php`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                setPedidos(data.pedidos.reverse() || []);
                console.log(data.pedidos);
            })
            .catch(error => console.error('Error al cargar pedidos:', error));
    };




    const openModal = () => {
        setModalIsOpen(true);
        setIsFocused(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setIsFocused(false);
        setIdPedido('');
        setPedidoDetalle(null);
    };

    const handleInputChange = (e) => {
        setIdPedido(e.target.value);
    };

    const buscarPedido = () => {
        const idPedidoInt = parseInt(idPedido, 10);
        const pedidoEncontrado = pedidos.find(pedido => pedido.idPedido === idPedidoInt);

        if (pedidoEncontrado) {
            setPedidoDetalle(pedidoEncontrado);
            Swal.fire({
                title: 'Pedido encontrado',
                text: `ID Pedido: ${pedidoEncontrado.idPedido}, Nombre: ${pedidoEncontrado.nombre}`,
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
        } else {
            Swal.fire({
                title: 'Pedido no encontrado',
                text: 'El ID del pedido no corresponde a ningún pedido existente.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            setPedidoDetalle(null);
        }
    };


    return (
        <div>
            <button onClick={openModal}>Ver mi pedido</button>
            <ToastContainer />
            <Modal
                isOpen={modalIsOpen}
                className="modal-cart"
                overlayClassName="overlay-cart"
                onRequestClose={closeModal}
            >
                <div className='deFLex'>
                    <button onClick={closeModal}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <button className='deleteToCart'>Mi pedido</button>
                </div>
                <div className='paddingConten'>
                    <fieldset className='inputSearch'>
                        <input
                            type="number"
                            placeholder="Ingrese N° de Pedido"
                            value={idPedido}
                            onChange={handleInputChange}
                            className="input"
                        />

                        <FontAwesomeIcon icon={faSearch} onClick={buscarPedido} className="search-icon" />
                    </fieldset>
                </div>

                {pedidoDetalle && (
                    <div className='MiPedidoContain'>


                        <div className="modal-content-cart">

                            <div className='deFlexSpanPedido'>
                                <span>{pedidoDetalle.nombre}</span>
                                <span>{pedidoDetalle.estado}</span>
                                <span>Pedido: {pedidoDetalle.idPedido}</span>
                                <span>{pedidoDetalle.entrega}</span>
                                <span>{new Date(pedidoDetalle?.createdAt)?.toLocaleString('es-ES', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                })}</span>
                            </div>
                            <div className='cardsProductData'>
                                {JSON.parse(pedidoDetalle.productos).map(producto => (
                                    <div key={producto.titulo} className='cardProductData'>
                                        <img src={producto.imagen} alt="imagen" />
                                        <div className='cardProductDataText'>
                                            <h3>{producto.titulo}</h3>
                                            <strong>{moneda} {producto.precio} <span>x{producto.cantidad}</span></strong>
                                            <span>
                                                {producto?.items?.map((sabor, index) => (
                                                    <span key={index}>{sabor}, </span>
                                                ))}
                                            </span>

                                        </div>
                                    </div>
                                ))}
                            </div>


                        </div>
                        <div className='deColumnCart'>
                            <h4>Total: {moneda} {pedidoDetalle && (
                                pedidoDetalle?.total
                            )}
                            </h4>
                        </div>
                    </div>
                )
                }



            </Modal >
        </div >
    );
}
