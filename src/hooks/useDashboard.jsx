import { useState, useEffect } from "react";
import { useCaja } from "../context/CajaContext";
import { getTransferencias } from "../api/transferenciasApi";
import {
  filtrarPorTurnoActual,
  calcularTotal,
  validarTransferencia,
} from '../models/transferenciasModel.js';

export const useDashboard = () => {
    const {caja} = useCaja();
    const [resumen, setResumen] = useState({
        transferencias: 0,
        totalTrans: 0,
        cargando: true,
        error: null,
    });

    useEffect(()=> {
        if (!caja.abierta || !caja.fecha || !caja.turno){
        setResumen(prev => ({...prev, cargando:false}));
        console.log("🔵 useDashboard: caja sin abrir", caja);
        return;
    }

    const cargarResumen = async () => {

    try {
        
        setResumen(prev=>({...prev, cargando:true, error: null}));
        const transData = await getTransferencias({fecha: caja.fecha, turno: caja.turno });
        const transTotal = calcularTotal(transData);
        console.log("🔵 useDashboard: entre al try", transData);
        console.log("🔵 useDashboard: entre al try", transTotal);
        setResumen({
            transferencias: transData.length,
            totalTrans: transTotal,
            cargando: false,
            error: null,

        });

    }catch (err){
        console.log("🔵 useDashboard: entre a error", caja);
        setResumen(prev => ({
            ...prev,
            cargando: false,
            error: 'Error al cargar'
        }));

    };
    };

    cargarResumen();
    }, [caja]);

    return resumen;
};
