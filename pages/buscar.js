import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { useRouter } from 'next/router';
import DetallesConductor from '../components/layout/DetallesConductor';
import useConductores from '../hooks/useConductores';
import { css } from '@emotion/core';

const Buscar = () => {

    const router = useRouter();
    const { query: { q } } = router;

    // Todos los conductores
    const { conductores } = useConductores('creado');
    const [resultado, guardarResultado] = useState([]);

    useEffect(() => {
        if (q) {
            const busqueda = q.toLowerCase();
            const filtro = conductores.filter(conductor => {
                return (
                    conductor.nombre.toLowerCase().includes(busqueda) ||
                    conductor.descripcion.toLowerCase().includes(busqueda)
                )
            });
            guardarResultado(filtro);
        }

    }, [q, conductores]);

    return (
        <Layout>
            <div className="listado-conductores">
                <div className="contenedor">

                    {resultado.length === 0 ? (
                        <h1
                            css={css`
                                    font-size: 2rem;
                                    margin-top: 5rem;
                                    text-align: center;
                                `}
                        >No se encontraron resultados para esta búsqueda</h1>
                    ) : (
                            <ul className="bg-white">
                                {resultado.map(conductor => (
                                    <DetallesConductor
                                        key={conductor.id}
                                        conductor={conductor}
                                    />
                                ))}
                            </ul>
                        )}

                </div>
            </div>
        </Layout>
    )
}


export default Buscar