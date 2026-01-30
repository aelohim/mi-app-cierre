// src/pages/PagosPage.tsx
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

  const [monto, setMonto] = useState<string>('');
  const [tipo, setTipo] = useState<'caja' | 'fuera'>('caja');
  const [razon, setRazon] = useState<string>('');
  const [editando, setEditando] = useState<{ id: number; monto: number; tipo: 'caja' | 'fuera'; razon: string } | null>(null);
  const [cargandoOperacion, setCargandoOperacion] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Llenar formulario cuando editamos
  useEffect(() => {
    if (editando) {
      setMonto(editando.monto.toString());
      setTipo(editando.tipo);
      setRazon(editando.razon);
    } else {
      setMonto('');
      setTipo('caja');
      setRazon('');
    }
  }, [editando]);

  const comenzarEdicion = (pago: { id: number; monto: number; tipo: 'caja' | 'fuera'; razon: string }) => {
    setEditando({ id: pago.id, monto: pago.monto, tipo: pago.tipo, razon: pago.razon });
    setErrorMsg('');
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const montoNum = Number(monto);
    if (!monto || isNaN(montoNum) || montoNum <= 0) {
      setErrorMsg('Ingresa un monto válido mayor a 0');
      return;
    }

    setCargandoOperacion(true);
    setErrorMsg('');

    try {
      if (editando) {
        await editarPago(editando.id.toString(), {
          monto: montoNum,
          tipo,
          razon: razon,
        });
        setEditando(null);
      } else {
        await agregarPago(montoNum, tipo, razon);
      }
      setMonto('');
      setRazon('');
      setTipo('caja');
    } catch (err) {
      setErrorMsg('Error al guardar el pago');
    } finally {
      setCargandoOperacion(false);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Seguro que quieres eliminar este pago?')) return;

    setCargandoOperacion(true);
    try {
      await eliminarPago(id.toString());
    } catch (err) {
      setErrorMsg('Error al eliminar');
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

  return (
    <div
      className="min-vh-100 py-5"
      style={{
        backgroundColor: '#FFF361', // Fondo amarillo pastel
        color: '#403636',           // Texto principal negro claro
      }}
    >
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold" style={{ color: '#1B4822' }}>
            Pagos desde Caja
          </h1>
          <p className="lead" style={{ color: '#2F753A' }}>
            Día: {caja.fecha} | Turno: {caja.turno?.toUpperCase() ?? 'N/A'}
          </p>
        </div>

        {/* Formulario */}
        <div className="card shadow-lg border-0 mb-5" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="card-body p-4 p-md-5">
            <h2 className="card-title text-center mb-4 fw-bold" style={{ color: '#403636' }}>
              {editando ? 'Editar Pago' : 'Nuevo Pago'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="row g-4 mb-4">

                <div className="col-12 col-md-4">
                  <label htmlFor="razon" className="form-label fw-semibold">
                    Razon
                  </label>
                  <input
                    id="razon"
                    type="text"
                    placeholder="Ej: Compra de insumos"
                    value={razon}
                    onChange={(e) => setRazon(e.target.value)}
                    className="form-control form-control-lg"
                    style={{
                      borderColor: '#5FBA6D',
                    }}
                    disabled={cargandoOperacion}
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label htmlFor="monto" className="form-label fw-semibold">
                    Monto
                  </label>
                  <input
                    id="monto"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    className="form-control form-control-lg text-end"
                    style={{
                      borderColor: '#5FBA6D',
                      borderWidth: '2px',
                    }}
                    required
                    disabled={cargandoOperacion}
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label htmlFor="tipo" className="form-label fw-semibold">
                    Tipo
                  </label>
                  <select
                    id="tipo"
                    className="form-select form-select-lg"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value as 'caja' | 'fuera')}
                    style={{
                      borderColor: '#2F753A',
                      borderWidth: '2px',
                    }}
                    disabled={cargandoOperacion}
                  >
                    <option value="caja">Desde Caja</option>
                    <option value="fuera">Fuera de Caja</option>
                  </select>
                </div>

              </div>

              <div className="d-grid gap-3">
                <button
                  type="submit"
                  disabled={cargandoOperacion}
                  className="btn btn-lg fw-bold"
                  style={{
                    backgroundColor: '#FCEA10',
                    color: '#1B4822',
                    border: 'none',
                  }}
                >
                  {cargandoOperacion
                    ? 'Guardando...'
                    : editando
                      ? 'Actualizar'
                      : 'Registrar Pago'}
                </button>

                {editando && (
                  <button
                    type="button"
                    onClick={cancelarEdicion}
                    className="btn btn-lg fw-bold"
                    style={{
                      backgroundColor: '#403636',
                      color: '#FFFFFF',
                      border: 'none',
                    }}
                  >
                    Cancelar
                  </button>
                )}
              </div>

              {errorMsg && (
                <p className="text-center mt-3 fw-bold" style={{ color: '#E44C4C' }}>
                  {errorMsg}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Lista y totales */}
        <div className="card shadow-lg border-0">
          <div
            className="card-header d-flex justify-content-between align-items-center flex-wrap gap-3"
            style={{ backgroundColor: '#2F753A', color: '#FFFFFF' }}
          >
            <h3 className="mb-0">Lista de Pagos</h3>
            <div className="text-end">
              <div className="fs-5 fw-bold">
                Desde Caja: ${totalCaja.toFixed(2)}
              </div>
              <div className="fs-6">
                Fuera de Caja: ${totalFuera.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="card-body p-0">
            {pagos.length === 0 ? (
              <p className="text-center py-5 text-muted fs-5">
                No hay pagos registrados en este turno
              </p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Razon</th>
                      <th>Monto</th>
                      <th>Tipo</th>
                      <th>ID</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagos.map((p, index) => (
                      <tr key={p.id.toString()}>
                        <td>{index + 1}</td>
                        <td className="fw-bold" style={{ color: p.tipo === 'caja' ? '#E44C4C' : '#5FBA6D' }}>
                          ${Number(p.monto).toFixed(2)}
                        </td>
                        <td>
                          <span
                            className={`badge fs-6 px-3 py-2 ${p.tipo === 'caja' ? 'bg-danger' : 'bg-success'
                              }`}
                          >
                            {p.tipo === 'caja' ? 'Desde Caja' : 'Fuera de Caja'}
                          </span>
                        </td>
                        <td>{p.razon}</td>
                        <td className="text-muted small">#{String(p.id).slice(-6)}</td>
                        <td>
                          <button
                            onClick={() => comenzarEdicion(p)}
                            className="btn btn-sm me-2"
                            style={{
                              backgroundColor: '#4891FF',
                              color: '#FFFFFF',
                            }}
                            disabled={cargandoOperacion}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleEliminar(p.id)}
                            className="btn btn-sm"
                            style={{
                              backgroundColor: '#E44C4C',
                              color: '#FFFFFF',
                            }}
                            disabled={cargandoOperacion}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}