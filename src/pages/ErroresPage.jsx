// src/pages/ErroresPage.jsx
import { useState, useEffect } from 'react';
import { useCaja } from '../context/CajaContext';

export default function ErroresPage() {
  const {
    caja,
    errores,
    agregarError,
    editarError,
    eliminarError,
  } = useCaja();

  const [monto, setMonto] = useState('');
  const [editando, setEditando] = useState(null); // { id, monto }
  const [cargandoOperacion, setCargandoOperacion] = useState(false);
  const [error, setError] = useState('');

  // Llenar input cuando editamos
  useEffect(() => {
    if (editando) {
      setMonto(editando.monto.toString());
    } else {
      setMonto('');
    }
  }, [editando]);

  const comenzarEdicion = (errorItem) => {
    setEditando({ id: errorItem.id, monto: errorItem.monto });
    setError('');
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setMonto('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!monto || isNaN(monto) || Number(monto) <= 0) {
      setError('Ingresa un monto válido mayor a 0');
      return;
    }

    setCargandoOperacion(true);
    setError('');

    try {
      if (editando) {
        await editarError(editando.id, { monto: Number(monto) });
        setEditando(null);
        setMonto('');
      } else {
        await agregarError(Number(monto));
        setMonto('');
      }
    } catch (err) {
      setError('Error al guardar el error/anulación');
    } finally {
      setCargandoOperacion(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Seguro que quieres eliminar este error?')) return;

    setCargandoOperacion(true);
    try {
      await eliminarError(id);
    } catch (err) {
      setError('Error al eliminar');
    } finally {
      setCargandoOperacion(false);
    }
  };

  // Total de errores
  const totalErrores = errores.reduce((acc, e) => acc + e.monto, 0);

  // Estado de carga inicial
  const cargandoInicial = caja.abierta && errores.length === 0;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Errores / Anulaciones - Día: {caja.fecha} | Turno: {caja.turno?.toUpperCase() || 'N/A'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editando ? 'Editar Error' : 'Nuevo Error/Anulación'}
        </h2>

        <div className="mb-4">
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Monto del error"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            required
            disabled={cargandoOperacion}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={cargandoOperacion}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {cargandoOperacion ? 'Guardando...' : editando ? 'Actualizar' : 'Registrar'}
          </button>

          {editando && (
            <button
              type="button"
              onClick={cancelarEdicion}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cancelar
            </button>
          )}
        </div>

        {error && <p className="text-red-600 mt-4">{error}</p>}
      </form>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="bg-red-600 px-6 py-4 flex justify-between items-center">
          <h3 className="text-white font-semibold text-lg">Lista de Errores</h3>
          <span className="text-white font-bold text-xl">
            Total: ${totalErrores.toFixed(2)}
          </span>
        </div>

        {cargandoInicial ? (
          <p className="p-8 text-center text-gray-500">Cargando errores...</p>
        ) : errores.length === 0 ? (
          <p className="p-8 text-center text-gray-500">No hay errores registrados</p>
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
              {errores.map((e, i) => (
                <tr key={e.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{i + 1}</td>
                  <td className="px-6 py-4 font-medium text-red-600">
                    -${Number(e.monto).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">#{String(e.id).slice(-4)}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => comenzarEdicion(e)}
                      className="text-blue-600 hover:text-blue-800 mr-4 font-medium"
                      disabled={cargandoOperacion}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(e.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                      disabled={cargandoOperacion}
                    >
                      Eliminar
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