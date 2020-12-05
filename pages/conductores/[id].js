import React, { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';
import { FirebaseContext } from '../../firebase';
import Layout from '../../components/layout/Layout';
import Error404 from '../../components/layout/404';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { Campo, InputSubmit } from '../../components/ui/Formulario';
import Boton from '../../components/ui/Boton';

const ContenidoConductor = styled.div`
    @media (min-width:768px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }
`;

const CreadorConductor = styled.p`
    padding: .5rem 2rem;
    background-color: #374151;
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`;

const Conductor = () => {

    // State del componente
    const [conductor, guardarConductor] = useState({});
    const [error, guardarError] = useState(false);
    const [comentario, guardarComentario] = useState({});
    const [consultarDB, guardarConsultarDB] = useState(true);

    // Routing para obtener el id actual
    const router = useRouter();
    const { query: { id } } = router;

    // context de firebase
    const { firebase, usuario } = useContext(FirebaseContext);

    useEffect(() => {

        if (id && consultarDB) {
            const obtenerConductor = async () => {
                const conductoruery = await firebase.db.collection('conductores').doc(id);
                const conductor = await conductoruery.get();
                if (conductor.exists) {
                    guardarConductor(conductor.data());
                    guardarConsultarDB(false);
                } else {
                    guardarError(true);
                    guardarConsultarDB(false);
                }

            }
            obtenerConductor();
        }
    }, [id]);

    if (Object.keys(conductor).length === 0 && !error) return 'Cargando...';

    const { comentarios, creado, descripcion, apellido, nombre, edad, urlimagen, votos, creador, haVotado } = conductor;

    // Administrar y validar los votos
    const votarConductor = () => {
        if (!usuario) {
            return router.push('/login')
        }

        // obtener y sumar un nuevo voto
        const nuevoTotal = votos + 1;

        // Verificar si el usuario actual ha votado
        if (haVotado.includes(usuario.uid)) return;

        // guardar el ID del usuario que ha votado
        const nuevoHaVotado = [...haVotado, usuario.uid];

        // Actualizar en la BD
        firebase.db.collection('conductores').doc(id).update({
            votos: nuevoTotal,
            haVotado: nuevoHaVotado
        })

        // Actualizar el state
        guardarConductor({
            ...conductor,
            votos: nuevoTotal
        })
        guardarConsultarDB(true); // hay un votos, por lo tanto consultar a la BD
    }


    // Funciones para crear comentarios
    const comentarioChange = e => {
        guardarComentario({
            ...comentario,
            [e.target.name]: e.target.value
        })
    }

    // Identifica si el comentario es del creador del conductor
    const esCreador = id => {
        if (creador.id == id) {
            return true;
        }
    }

    const agregarComentario = e => {
        e.preventDefault();
        if (!usuario) {
            return router.push('/login')
        }

        // Información extra al comentario
        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;

        // Tomar copia de comentarios y agregarlos al areglo
        const nuevosComentarios = [...comentarios, comentario];

        // Actualizar la BD
        firebase.db.collection('conductores').doc(id).update({
            comentarios: nuevosComentarios
        })

        // Actualizar el state
        guardarConductor({
            ...conductor,
            comentarios: nuevosComentarios
        })
        guardarConsultarDB(false); // hay un comentario, por lo tanto consultar a la BD
    }

    // función que revisa que el creador del produtcto sea el mismo que está autenticado
    const puedeBorrar = () => {
        if (!usuario) return false;

        if (creador.id === usuario.uid) {
            return true;
        }
    }

    // elimina un Conductor de la BD
    const eliminarConductor = async () => {
        if (!usuario) {
            return router.push('/login')
        }

        if (creador.id !== usuario.uid) {
            return router.push('/')
        }

        try {
            await firebase.db.collection('conductores').doc(id).delete();
            router.push('/')
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Layout>
            <>
                { error ? <Error404 /> : (

                    <div className="contenedor">
                        <h1 css={css`
                        text-align: center;
                        margin-top: 2rem;
                        `}>{nombre}</h1>
                        <ContenidoConductor>
                            <div>
                                <p>Publicado hace: {formatDistanceToNow(new Date(creado), { locale: es })}</p>
                                <p>Por: {creador.nombre} {apellido} </p>
                                <img src={urlimagen} />
                                <p>{descripcion}</p>

                                {usuario && (
                                    <>
                                        <h2>Agrega tu comentario</h2>
                                        <form
                                            onSubmit={agregarComentario}
                                        >
                                            <Campo>
                                                <input
                                                    type="text"
                                                    name="mensaje"
                                                    onChange={comentarioChange}
                                                />
                                            </Campo>
                                            <InputSubmit
                                                type="submit"
                                                value="Agregar Comentario"
                                            />
                                        </form>
                                    </>
                                )}

                                <h2 css={css`
                                margin: 2rem 0;
                            `}>Comentarios</h2>

                                {comentarios.length === 0 ? "Aún no hay comentarios" : (
                                    <ul>
                                        {comentarios.map((comentario, i) => (
                                            <li
                                                key={`${comentario.usuarioId}-${i}`}
                                                css={css`
                                                border: 1px solid #e1e1e1;
                                                padding: 2rem;
                                            `}
                                            >
                                                <p>{comentario.mensaje}</p>
                                                <p>Escrito por:
                                                <span
                                                        css={css`
                                                    font-weight:bold;
                                                `}
                                                    >
                                                        {' '}{comentario.usuarioNombre}
                                                    </span>
                                                </p>
                                                { esCreador(comentario.usuarioId) &&
                                                    <CreadorConductor>Es Creador</CreadorConductor>
                                                }
                                            </li>
                                        ))}
                                    </ul>
                                )}


                            </div>

                            <aside>
                                {/* <Boton
                                    target="_blank"
                                    bgColor="true"
                                    href={edad}
                                >Visitar URL</Boton> */}



                                <div
                                    css={css`
                                    margin-top: 5rem;
                                `}
                                >
                                    <p css={css`
                                text-align: center;
                                `}>{votos} Votos</p>

                                    {usuario && (
                                        <Boton
                                            onClick={votarConductor}
                                        >
                                            Votar
                                        </Boton>
                                    )}
                                </div>
                            </aside>
                        </ContenidoConductor>

                        { puedeBorrar() &&
                            <Boton
                                onClick={eliminarConductor}
                            >Eliminar Conductor</Boton>
                        }
                    </div>

                )}

            </>
        </Layout>
    );
}

export default Conductor