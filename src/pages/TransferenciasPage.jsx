import { useState, useEffect } from 'react';
import { useCaja } from '../context/CajaContext.jsx';
import { useTransferencias } from '../hooks/useTransferencias.jsx';


export default function TransferenciasPage() {
  const { caja } = useCaja();
  const [monto, setMonto] = useState('');
  const {
    transferencias,
    total,
    cargando,
    error,
    editando,
    comenzarEdicion,
    cancelarEdicion,
    guardarTransferencia,
    handleEliminar,
  } = useTransferencias();


  // Cuando entra en modo edición, llena el input
  useEffect(() => {
    if (editando) {
      setMonto(editando.monto.toString());
    } else {
      setMonto('');
    }
  }, [editando]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const exito = await guardarTransferencia(monto);
    if (exito) {
      setMonto(''); // solo limpia si es creación
    }
  };

  return (
    <div>
      <h1> Transferencias Dia: {caja.fecha} Turno: {caja.turno}</h1> 
      <form onSubmit={handleSubmit}>
        <h2>{editando ? 'Editar' : 'Nueva'}</h2>
        <div>
          <input
            type="number"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            required />
        </div>
        <div>
          {editando ? (
            <>
              <button type="submit">
                Confirmar
              </button>
              <button type="button" onClick={cancelarEdicion}>
                Cancelar
              </button>
            </>
          ) : (
            <button type='submit'>
              Cargar Transferencia
            </button>
          )}
        </div>
        {error && <p className="text-red-600 mt-3">{error}</p>}
      </form>
      <div className="rounded-lg shadow overflow-hidden">
        <div className="bg-blue-600 px-6 py-3 flex justify-between">
          <h3 className="font-semibold">Lista del Turno</h3>
          <span className="font-bold">Total: ${total.toFixed(2)}</span>
        </div>


        {cargando ? (
          <p className="p-8 text-center text-gray-500">Cargando...</p>
        ) : transferencias.length === 0 ? (
          <p className="p-8 text-center text-gray-500">No hay transferencias aún</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {transferencias.map((t, i) => (
                <tr key={t.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{i + 1}</td>
                  <td className="px-6 py-4 font-medium">${Number(t.monto).toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">#{t.id.slice(-4)}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => comenzarEdicion(t)}
                      className="text-blue-600 hover:text-blue-800 mr-3 font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(t.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>


  );
}

