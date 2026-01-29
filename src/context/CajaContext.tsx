import { createContext, useContext, useState, useEffect, type ReactNode, } from "react";
import {
    getTransferencias,
    crearTransferencia,
    eliminarTransferenciaApi,
    actualizarTransferencia,
    type Transferencia
} from '../api/transferenciasApi.ts';
import {
    getErroresItems,
    getErrorItemById,
    crearErrorItem,
    actualizarErrorItem,
    eliminarErrorItemApi,
    type ErrorItem
} from '../api/erroresApi.ts';
import {
    getPagos,
    getPagoById,
    crearPago,
    actualizarPago,
    eliminarPagoApi,
    type Pago
} from '../api/pagosApi.ts';

interface CajaState {
    fecha: string;
    turno: string | null;
    abierta: boolean;
}

interface CajaContextType {
    caja: CajaState;
    abrirCaja: (turno: string) => void;
    cerrarCaja: () => void;
    resetCaja: () => void;
    transferencias: Transferencia[];
    agregarTransferencia: (monto: number, nota?: string, esDelivery?: boolean) => Promise<void>;
    editarTransferencia: (id: string, datos: Partial<Transferencia>) => Promise<void>; // Nueva para edits
    eliminarTransferencia: (id: string) => Promise<void>; // Nueva para deletes
    errores: ErrorItem[];
    agregarError: (monto: number) => Promise<void>;
    editarError: (id: string, datos: Partial<ErrorItem>) => Promise<void>; // Nueva para edits
    eliminarError: (id: string) => Promise<void>; // Nueva para deletes
    pagos: Pago[];
    agregarPago: (monto: number, tipo: 'caja' | 'fuera', nota?: string) => Promise<void>;
    editarPago: (id: string, datos: Partial<Pago>) => Promise<void>; // Nueva para edits
    eliminarPago: (id: string) => Promise<void>; // Nueva para deletes
    // Manuales al cierre
    posnet: number;
    setPosnet: (valor: number) => void;
    efectivo: number;
    setEfectivo: (valor: number) => void;
    balanza1: number;
    setBalanza1: (valor: number) => void;
    balanza2: number;
    setBalanza2: (valor: number) => void;
    // Cálculos automáticos (usa useMemo en componentes)
}

const CajaContext = createContext<CajaContextType | undefined>(undefined);
const LOCAL_STORAGE_KEY = "cajaEstado";

export default function CajaProvider({ children, }: { children: ReactNode; }): ReactNode {
    const hoy = new Date().toISOString().split('T')[0];

    const [caja, setCaja] = useState<CajaState>(() => {
        try {
            const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved) as CajaState;
                if (parsed.fecha !== hoy) {
                    return { fecha: hoy, turno: null, abierta: false };
                }
                return parsed;
            }
        } catch (error) {
            console.error('Error al leer el local storage', error);
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
        return { fecha: hoy, turno: null, abierta: false };
    });
    const [transferencias, setTransferencias] = useState<Transferencia[]>([]);
    const [errores, setErrores] = useState<ErrorItem[]>([]);
    const [pagos, setPagos] = useState<Pago[]>([]);
    const [posnet, setPosnet] = useState<number>(0);
    const [efectivo, setEfectivo] = useState<number>(0);
    const [balanza1, setBalanza1] = useState<number>(0);
    const [balanza2, setBalanza2] = useState<number>(0);

    //ZONA DE CARGA DE DATOS AL MONTAR EL COMPONENTE********************
   
    //Local Storage
    useEffect(() => {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(caja));
        } catch (error) {
            console.error("Error al guardar", error);
        }
    }, [caja]);


    //Transferencias
    useEffect(() => {
        if (!caja.abierta) {
            setTransferencias([]);
            return;
        }

        const cargarTransferencias = async () => {
            if (!caja.abierta || !caja.turno) {
                setTransferencias([]);
                return;
            }

            // Aquí ya sabemos que turno existe y es uno de los dos valores válidos
            const turnoActual = caja.turno as 'mañana' | 'tarde';

            try {
                const data = await getTransferencias({
                    fecha: caja.fecha,
                    turno: turnoActual,
                });
                setTransferencias(data);
            } catch (error) {
                console.error("No fue posible cargar las transferencias", error);
                setTransferencias([]);
            }
        };
        cargarTransferencias();
    }, [caja.abierta, caja.fecha, caja.turno]);

    //Errores
    useEffect(() => {
        if (!caja.abierta) {
            setErrores([]);
            return;
        }

        const cargarErrores = async () => {
            try {
                const data = await getErroresItems({
                    fecha: caja.fecha,
                    turno: caja.turno!,
                });
                setErrores(data);
            }
            catch (error) {
                console.error("No fue posible cargar las Errores", error);
                setErrores([]);
            }
        };

        cargarErrores();
    }, [caja.abierta, caja.fecha, caja.turno]);

    //Pagos
    useEffect(() => {
        if (!caja.abierta) {
            setPagos([]);
            return;
        }

        const cargarPagos = async () => {
            try {
                const data = await getPagos({
                    fecha: caja.fecha,
                    turno: caja.turno!,
                });
                setPagos(data);
            }
            catch (error) {
                console.error("No fue posible cargar las Pago", error);
                setPagos([]);
            }
        };

        cargarPagos();
    }, [caja.abierta, caja.fecha, caja.turno]);

    //CRUD DE LAS ENTIDADES DE MI BASE********************

    //Transferencias: agregar/editar/eliminar
    const agregarTransferencia = async (monto: number, nota?: string, esDelivery = false) => {
        if (!caja.abierta) throw new Error('Caja cerrada');

        try {
            const nueva: Omit<Transferencia, 'id'> = {
                monto,
                nota,
                es_delivery: esDelivery,
                fecha: caja.fecha,
                turno: caja.turno as 'mañana' | 'tarde', //Si la caja esta abierta el turno no es null
            };
            const creada = await crearTransferencia(nueva);
            setTransferencias((prev) => [...prev, creada]);
        } catch (error) {
            console.error("No fue posible agregar la transferencia", error);
            throw error;
        }
    };

    const editarTransferencia = async (id: string, datos: Partial<Transferencia>) => {
        try {
            const actualizada = await actualizarTransferencia(id, datos);
            setTransferencias((prev) =>
                prev.map((t) => (t.id === id ? actualizada : t)));
        } catch (error) {
            console.error("No fue posible editar la transferencia", error);
            throw error;
        }
    };

    //NUEVA: eliminar usa API
    const eliminarTransferencia = async (id: string) => {
        try {
            await eliminarTransferenciaApi(id);
            setTransferencias((prev) => prev.filter((t) => t.id !== id));
        } catch (error) {
            console.error('Error eliminando transferencia', error);
            throw error;
        }
    };
    //Errores: agregar/editar/eliminar
    const agregarError = async (monto: number) => {
        if (!caja.abierta) throw new Error('Caja cerrada');

        try {
            const nueva: Omit<ErrorItem, 'id'> = {
                monto,
                fecha: caja.fecha,
                turno: caja.turno as 'mañana' | 'tarde', //Si la caja esta abierta el turno no es null
            };
            const creada = await crearErrorItem(nueva);
            setErrores((prev) => [...prev, creada]);
        } catch (error) {
            console.error("No fue posible agregar el error", error);
            throw error;
        }
    };

    const editarError = async (id: string, datos: Partial<ErrorItem>) => {
        try {
            const actualizada = await actualizarErrorItem(id, datos);
            setErrores((prev) =>
                prev.map((t) => (t.id === id ? actualizada : t)));
        } catch (error) {
            console.error("No fue posible editar la Error", error);
            throw error;
        }
    };

    // NUEVA: eliminar usa API
    const eliminarError = async (id: string) => {
        try {
            await eliminarErrorItemApi(id);
            setErrores((prev) => prev.filter((e) => e.id !== id));
        } catch (error) {
            console.error('Error eliminando Error', error);
            throw error;
        }
    };

    //Pagos: agregar/editar/eliminar
    const agregarPago = async (monto: number, tipo: 'caja' | 'fuera') => {
        if (!caja.abierta) throw new Error('Caja cerrada');

        try {
            const nuevo: Omit<Pago, 'id'> = {
                monto,
                tipo,
                fecha: caja.fecha,
                turno: caja.turno as 'mañana' | 'tarde', //Si la caja esta abierta el turno no es null
            };
            const creado = await crearErrorItem(nuevo);
            setErrores((prev) => [...prev, creado]);
        } catch (error) {
            console.error("No fue posible agregar el error", error);
            throw error;
        }
    };

    const editarPago = async (id: string, datos: Partial<Pago>) => {
        try {
            const actualizado = await actualizarPago(id, datos);
            setPagos((prev) =>
                prev.map((p) => (p.id === id ? actualizado : p)));
        } catch (error) {
            console.error("No fue posible editar la Error", error);
            throw error;
        }
    };

    // NUEVA: eliminar usa API
    const eliminarPago = async (id: string) => {
        try {
            await eliminarPagoApi(id);
            setPagos((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
            console.error('Error eliminando Error', error);
            throw error;
        }
    };

    // === ACCIONES DE CAJA ===
    const abrirCaja = (turno: string) => {
        setCaja({ fecha: hoy, turno, abierta: true });
    };

    const resetCaja = () => {
        setCaja({
            fecha: hoy,
            turno: null,
            abierta: false,
        })
    };

    // Al cerrar, resetea listas (o guárdalas para reporte)
    const cerrarCaja = () => {
        setCaja({ fecha: hoy, turno: null, abierta: false });
        // Opcional: resetea listas o guárdalas en json-server
        setTransferencias([]);
        setErrores([]);
        setPagos([]);
        setPosnet(0);
        setEfectivo(0);
        setBalanza1(0);
        setBalanza2(0);
    };


    return (
        <CajaContext.Provider
            value={{
                caja, abrirCaja, cerrarCaja, resetCaja,
                transferencias, agregarTransferencia,
                editarTransferencia, eliminarTransferencia,
                errores, agregarError,
                editarError, eliminarError,
                pagos, agregarPago,
                editarPago, eliminarPago,
                posnet, setPosnet,
                efectivo, setEfectivo,
                balanza1, setBalanza1,
                balanza2, setBalanza2,
            }}
        >
            {children}
        </CajaContext.Provider>
    );
}

export const useCaja = (): CajaContextType => {
    const context = useContext(CajaContext);
    if (context === undefined) {
        throw new Error('useCaja debe usarse dentro de CajaProvider');
    }
    return context;
}

