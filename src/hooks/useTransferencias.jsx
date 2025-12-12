import { useState, useEffect } from 'react';
import { useCaja } from '../context/CajaContext.jsx';
import {
  getTransferencias,
  crearTransferencia,
  eliminarTransferencia,
  actualizarTransferencia
} from '../api/transferenciasApi.js';
import {
  filtrarPorTurnoActual,
  calcularTotal,
  validarTransferencia,
} from '../models/transferenciasModel.js';

export const useTransferencias = () => {
  const { caja } = useCaja(); //Mi hook con el contexto de la caja global con abierta/cerrada, fecha y turno.
  const [transferencias, setTransferencias] = useState([]); //El estado para guardar las transferencias.
  const [total, setTotal] = useState(0); //El estado para el total de las transferencias.
  const [cargando, setCargando] = useState(true); //Para manejar estado cargando o no de la app.
  const [error, setError] = useState(''); //Para manejar estado error o no de la app.
  const [editando, setEditando] = useState(null); //Estado para manejar la edición.
  
  //useEffect para cargar las tranferencias de la fecha y turno en cuestion cuando se monta el componente.
  useEffect(() => {
      //if para controlar si la caja no esta abierta (innecesario si estoy manejando bien el acceso a la pagina en funcion del estado de mi caja)
      /*
    if (!caja.abierta) {
      setTransferencias([]);
      setTotal(0);
      setCargando(false);
      return;
    }*/

    const cargar = async () => {
      try {
        setCargando(true);
        setError('');
        const data = await getTransferencias({
          fecha: caja.fecha,
          turno: caja.turno,
        });
        setTransferencias(data);
        setTotal(calcularTotal(data));
      } catch (err) {
        setError('Error al cargar transferencias');
        setTransferencias([]);
        setTotal(0);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [caja]);

  //Función para comenzar la edición
  const comenzarEdicion = (transferencia) => {
    setEditando({...transferencia }); //Clona con spread para no evitar muaciones directas en el estado?
  };

  //Funcion para cancelar la edicion, volciendo a modo creacion
  const cancelarEdicion = () => {
    setEditando(null);
  }

//Ahora tenemos esta funcion asyncrona para crear/editar segun corresponda
const guardarTransferencia = async (monto) => {
  try {
    setError('');
    if (editando){
      const actualizada = {
        ...editando, 
        monto: Number(monto),
      };
      
      validarTransferencia(actualizada);
      
      const respuesta = await actualizarTransferencia(editando.id, actualizada);
      setTransferencias(prev => 
        prev.map(t =>(t.id === editando.id ? respuesta : t))
      );
      setTotal(calcularTotal(transferencias.map(t => (t.id === editando.id ? respuesta : t))));
      setEditando(null);
      return true;
    }
// Si estamos creando nueva
      const nueva = {
        monto: Number(monto),
        fecha: caja.fecha,
        turno: caja.turno,
        estado: 'cargada',
      };

      validarTransferencia(nueva);
      const creada = await crearTransferencia(nueva);

      setTransferencias(prev => [...prev, creada]);
      setTotal(prev => prev + creada.monto);
      return true;
    } catch (err) {
      setError(err.message || 'Error al guardar transferencia');
      return false;
    }


};


  const handleEliminar = async (id) => {
    try {
      await eliminarTransferencia(id);
      const actualizadas = transferencias.filter(t => t.id !== id);
      setTransferencias(actualizadas);
      setTotal(calcularTotal(actualizadas));
    } catch (err) {
      setError('Error al eliminar');
    }
  };

  return {
    transferencias,
    total,
    cargando,
    error,
    editando,
    comenzarEdicion,
    cancelarEdicion,
    guardarTransferencia,
    handleEliminar,
  };
};