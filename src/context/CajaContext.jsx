import { createContext, useContext, useState } from "react";

const CajaContext = createContext();

export default function CajaProvider({children}) {
    const hoy = new Date().toISOString().split('T')[0];

    const [caja, setCaja] = useState({
        fecha: hoy,
        turno: null,
        abierta: false,
    });

    const abrirCaja = (turno) => {
        setCaja({fecha: hoy, turno, abierta: true});
    };

    const cerrarCaja = () => {
        setCaja({fecha: hoy, turno, abierta: false});
    };


  return (
    <CajaContext.Provider value={{ caja, abrirCaja, cerrarCaja }}>
        {children}
    </CajaContext.Provider>
  );
}

export const useCaja = ()=> {
    const context = useContext(CajaContext);
    if (!context) throw new Error('useCaja debe usarse dentro de CajaProvider');
    return context;
};

