import React, { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../firebase';

const useConductores = orden => {

    const [conductores, guardarConductores] = useState([]);

    const { firebase } = useContext(FirebaseContext);

    useEffect(() => {
        const obtenerConductores = () => {
            firebase.db.collection('conductores').orderBy(orden, 'desc').onSnapshot(manejarSnapshot)
        }
        obtenerConductores();
    }, []);

    function manejarSnapshot(snapshot) {
        const conductores = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            }
        });

        guardarConductores(conductores);
    }

    return {
        conductores
    }

}

export default useConductores;