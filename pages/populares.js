import React from 'react';
import Layout from '../components/layout/Layout';
import DetallesConductor from '../components/layout/DetallesConductor';
import useConductores from '../hooks/useConductores';

const Populares = () => {

    const { conductores } = useConductores('votos');

    return (
        <div>
            <Layout>
                <div className="listado-conductores">
                    <div className="contenedor">
                        <ul className="bg-white">
                            {conductores.map(conductor => (
                                <DetallesConductor
                                    key={conductor.id}
                                    conductor={conductor}
                                />
                            ))}
                        </ul>
                    </div>
                </div>
            </Layout>
        </div>
    )
}

export default Populares;