// src/pages/PagosPage.jsx
import { useState, useEffect } from 'react';
import { useCaja } from '../context/CajaContext';

export default function PagosPage() {
  const {
    caja,
    pagos,
    agregarPago,
    editarPago,
    eliminarPago,
  } = useCaja();

  const [monto, setMonto] = useState('');
  const [tipo, setTipo] = useState('caja'); // 'caja' | 'fuera'
  const [nota, setNota] = useState('');
  const [editando, setEditando] = useState(null); // { id, monto, tipo, nota }
  const [cargandoOperacion, setCargandoOperacion] = useState(false);
  const [error, setError] = useState('');

  // Llenar formulario cuando editamos
  useEffect(() => {
    if (editando) {
      setMonto(editando.monto.toString());
      setTipo(editando.tipo);
      setNota(editando.nota || '');
    } else {
      setMonto('');
      setTipo('caja');
      setNota('');
    }
  }, [editando]);

  const comenzarEdicion = (pago) => {
    setEditando({
      id: pago.id,
      monto: pago.monto,
      tipo: pago.tipo,
      nota: pago.nota || '',
    });
    setError('');
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setMonto('');
    setTipo('caja');
    setNota('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!monto || isNaN(monto) || Number(monto) <= 0) {
      setError('Ingresa un monto válido');
      return;
    }

    setCargandoOperacion(true);
    setError('');

    try {
      if (editando) {
        await editarPago(editando.id, {
          monto: Number(monto),
          tipo,
          nota: nota || undefined,
        });
        setEditando(null);
      } else {
        await agregarPago(Number(monto), tipo, nota || undefined);
      }
      setMonto('');
      setNota('');
    } catch (err) {
      setError('Error al guardar el pago');
    } finally {
      setCargandoOperacion(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Seguro que quieres eliminar este pago?')) return;

    setCargandoOperacion(true);
    try {
      await eliminarPago(id);
    } catch (err) {
      setError('Error al eliminar');
    } finally {
      setCargandoOperacion(false);
    }
  };

  // Totales separados
  const totalCaja = pagos
    .filter(p => p.tipo === 'caja')
    .reduce((acc, p) => acc + p.monto, 0);
  const totalFuera = pagos
    .filter(p => p.tipo === 'fuera')
    .reduce((acc, p) => acc + p.monto, 0);

  const cargandoInicial = caja.abierta && pagos.length === 0;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Pagos desde Caja - Día: {caja.fecha} | Turno: {caja.turno?.toUpperCase() || 'N/A'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editando ? 'Editar Pago' : 'Nuevo Pago'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Monto"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
            disabled={cargandoOperacion}
          />

          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={cargandoOperacion}
          >
            <option value="caja">Desde Caja</option>
            <option value="fuera">Fuera de Caja</option>
          </select>

          <input
            type="text"
            placeholder="Nota (opcional)"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={cargandoOperacion}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={cargandoOperacion}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
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
        <div className="bg-purple-600 px-6 py-4 flex justify-between items-center">
          <h3 className="text-white font-semibold text-lg">Lista de Pagos</h3>
          <div className="text-white text-right">
            <div className="font-bold">Desde Caja: ${totalCaja.toFixed(2)}</div>
            <div>Fuera de Caja: ${totalFuera.toFixed(2)}</div>
          </div>
        </div>

        {cargandoInicial ? (
          <p className="p-8 text-center text-gray-500">Cargando pagos...</p>
        ) : pagos.length === 0 ? (
          <p className="p-8 text-center text-gray-500">No hay pagos registrados</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nota</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pagos.map((p, i) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{i + 1}</td>
                  <td className="px-6 py-4 font-medium">${Number(p.monto).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      p.tipo === 'caja' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {p.tipo === 'caja' ? 'Desde Caja' : 'Fuera de Caja'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{p.nota || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">#{String(p.id).slice(-4)}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => comenzarEdicion(p)}
                      className="text-blue-600 hover:text-blue-800 mr-4 font-medium"
                      disabled={cargandoOperacion}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(p.id)}
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