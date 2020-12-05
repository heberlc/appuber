import React, { useState, useContext } from 'react';
import { css } from '@emotion/core';
import Router, { useRouter } from 'next/router';
import FileUploader from 'react-firebase-file-uploader';
import Layout from '../components/layout/Layout';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';

import { FirebaseContext } from '../firebase';

import Error404 from '../components/layout/404';

//validaciones
import useValidacion from '../hooks/useValidacion';
import validarCrearProducto from '../validacion/validarCrearProducto';

const STATE_INICIAL = {
    nombre: '',
    apellido: '',
    //imagen: '',
    edad: '',
    descripcion: ''
}

const NuevoConductor = () => {

    // state  de las imagenes
    const [nombreimagen, guardarNombre] = useState('');
    const [subiendo, guardarSubiendo] = useState(false);
    const [progreso, guardarProgreso] = useState(0);
    const [urlimagen, guardarUrlImagen] = useState('');

    const [error, guardarError] = useState(false);

    const { valores, errores, handleSubmit, handleChange, handleBlur }
        = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);

    const { nombre, apellido, imagen, edad, descripcion } = valores;

    // hook de routing para redireccionar
    const router = useRouter();

    // context con las operaciones CRUD de firebase
    const { usuario, firebase } = useContext(FirebaseContext);

    //console.log(usuario);

    async function crearProducto() {

        // si el usuario no está autenticado, llevar al login
        if (!usuario) {
            return router.push('/login');
        }

        // crear objeto de nuevo producto
        const conductor = {
            nombre,
            apellido,
            edad,
            urlimagen,
            descripcion,
            votos: 0,
            comentarios: [],
            creado: Date.now(),
            creador: {
                id: usuario.uid,
                nombre: usuario.displayName
            },
            haVotado: []
        }

        // insertando en la base de datos
        firebase.db.collection('conductores').add(conductor);

        return router.push('/');

    }

    const handleUploadStart = () => {
        guardarProgreso(0);
        guardarSubiendo(true);
    }

    const handleProgress = progreso => guardarProgreso({ progreso });

    const handleUploadError = error => {
        guardarSubiendo(error);
        console.error(error);
    };

    const handleUploadSuccess = nombre => {
        guardarProgreso(100);
        guardarSubiendo(false);
        guardarNombre(nombre)
        firebase
            .storage
            .ref("conductores")
            .child(nombre)
            .getDownloadURL()
            .then(url => {
                console.log(url);
                guardarUrlImagen(url);
            });
    };

    return (

        <div>
            <Layout>
                {!usuario ? <Error404 /> : (
                    <>
                        <h1
                            css={css`
                             text-align: center;
                             margin-top: 5rem;
                         `}
                        >Nuevo Conductor</h1>
                        <Formulario
                            onSubmit={handleSubmit}
                            noValidate
                        >
                            <fieldset>
                                <legend>Información General </legend>

                                <Campo>
                                    <label htmlFor="nombre">Nombre</label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        placeholder="Nombre del Conductor"
                                        name="nombre"
                                        value={nombre}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Campo>

                                {errores.nombre && <Error>{errores.nombre}</Error>}

                                <Campo>
                                    <label htmlFor="apellido">Apellido</label>
                                    <input
                                        type="text"
                                        id="apellido"
                                        placeholder="Apellido del conductor"
                                        name="apellido"
                                        value={apellido}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Campo>

                                {errores.apellido && <Error>{errores.apellido}</Error>}

                                <Campo>
                                    <label htmlFor="imagen">Imagen</label>
                                    <FileUploader
                                        accept="image/*"
                                        id="imagen"
                                        name="imagen"
                                        randomizeFilename
                                        storageRef={firebase.storage.ref("conductores")}
                                        onUploadStart={handleUploadStart}
                                        onUploadError={handleUploadError}
                                        onUploadSuccess={handleUploadSuccess}
                                        onProgress={handleProgress}
                                    />
                                </Campo>
                                <Campo>
                                    <label htmlFor="edad">Edad</label>
                                    <input
                                        type="number"
                                        id="edad"
                                        name="edad"
                                        placeholder="Edad del conductor"
                                        value={edad}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Campo>

                                {errores.edad && <Error>{errores.edad}</Error>}

                            </fieldset>

                            <fieldset>
                                <legend>Sobre el Conductor</legend>

                                <Campo>
                                    <label htmlFor="descripcion">Descripción</label>
                                    <textarea
                                        id="descripcion"
                                        name="descripcion"
                                        value={descripcion}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Campo>

                                {errores.descripcion && <Error>{errores.descripcion}</Error>}

                            </fieldset>

                            {error && <Error>{error}</Error>}

                            <InputSubmit type="submit" value="Agregar Conductor" />
                        </Formulario>
                    </>
                )};

                </Layout>
        </div>
    );
}


export default NuevoConductor