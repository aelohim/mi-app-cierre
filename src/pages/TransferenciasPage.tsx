// src/pages/TransferenciasPage.tsx
import { useState, useEffect } from 'react';
import { useCaja } from '../context/CajaContext';

export default function TransferenciasPage() {
  const {
    caja,
    transferencias,
    agregarTransferencia,
    editarTransferencia,
    eliminarTransferencia,
  } = useCaja();

  const [monto, setMonto] = useState<string>('');
  const [nota, setNota] = useState<string>('');
  const [esDelivery, setEsDelivery] = useState<boolean>(false);
  const [editando, setEditando] = useState<{ id: number; monto: number; nota?: string; esDelivery: boolean } | null>(null);
  const [cargandoOperacion, setCargandoOperacion] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const total = transferencias.reduce((acc, t) => acc + t.monto, 0);

  // Llenar formulario cuando editamos
  useEffect(() => {
    if (editando) {
      setMonto(editando.monto.toString());
      setNota(editando.nota || '');
      setEsDelivery(editando.esDelivery);
    } else {
      setMonto('');
      setNota('');
      setEsDelivery(false);
    }
  }, [editando]);

  const comenzarEdicion = (t: { id: number; monto: number; nota?: string; esDelivery: boolean }) => {
    setEditando({ id: t.id, monto: t.monto, nota: t.nota, esDelivery: t.esDelivery });
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
        await editarTransferencia(editando.id, {
          monto: montoNum,
          nota: nota || undefined,
          esDelivery,
        });
        setEditando(null);
      } else {
        await agregarTransferencia(montoNum, nota || undefined, esDelivery);
      }
      setMonto('');
      setNota('');
      setEsDelivery(false);
    } catch (err) {
      setErrorMsg('Error al guardar la transferencia');
    } finally {
      setCargandoOperacion(false);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Seguro que quieres eliminar esta transferencia?')) return;

    setCargandoOperacion(true);
    try {
      await eliminarTransferencia(id);
    } catch (err) {
      setErrorMsg('Error al eliminar');
    } finally {
      setCargandoOperacion(false);
    }
  };

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
            Transferencias
          </h1>
          <p className="lead" style={{ color: '#2F753A' }}>
            Día: {caja.fecha} | Turno: {caja.turno?.toUpperCase() ?? 'N/A'}
          </p>
        </div>

        {/* Formulario */}
        <div className="card shadow-lg border-0 mb-5" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div className="card-body p-4 p-md-5">
            <h2 className="card-title text-center mb-4 fw-bold" style={{ color: '#403636' }}>
              {editando ? 'Editar Transferencia' : 'Nueva Transferencia'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
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
                    borderColor: '#5FBA6D', // Verde más claro
                    borderWidth: '2px',
                  }}
                  required
                  disabled={cargandoOperacion}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="nota" className="form-label fw-semibold">
                  Nota (opcional)
                </label>
                <input
                  id="nota"
                  type="text"
                  placeholder="Ej: Transferencia a Juan"
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  className="form-control form-control-lg"
                  style={{
                    borderColor: '#2F753A',
                  }}
                  disabled={cargandoOperacion}
                />
              </div>

              <div className="mb-4 form-check">
                <input
                  id="delivery"
                  type="checkbox"
                  className="form-check-input"
                  checked={esDelivery}
                  onChange={(e) => setEsDelivery(e.target.checked)}
                  disabled={cargandoOperacion}
                  style={{
                    borderColor: '#5FBA6D',
                  }}
                />
                <label htmlFor="delivery" className="form-check-label fw-semibold">
                  Es Delivery (transferencia al repartidor)
                </label>
              </div>

              <div className="d-grid gap-3">
                <button
                  type="submit"
                  disabled={cargandoOperacion}
                  className="btn btn-lg fw-bold"
                  style={{
                    backgroundColor: '#FCEA10', // Amarillo original
                    color: '#1B4822',
                    border: 'none',
                  }}
                >
                  {cargandoOperacion
                    ? 'Guardando...'
                    : editando
                    ? 'Actualizar'
                    : 'Cargar Transferencia'}
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

        {/* Total y lista */}
        <div className="card shadow-lg border-0">
          <div
            className="card-header d-flex justify-content-between align-items-center"
            style={{ backgroundColor: '#5FBA6D', color: '#FFFFFF' }}
          >
            <h3 className="mb-0">Lista de Transferencias</h3>
            <span className="fs-4 fw-bold">
              Total: ${total.toFixed(2)}
            </span>
          </div>

          <div className="card-body p-0">
            {transferencias.length === 0 ? (
              <p className="text-center py-5 text-muted fs-5">
                No hay transferencias registradas en este turno
              </p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Monto</th>
                      <th>Nota</th>
                      <th>Delivery</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transferencias.map((t, index) => (
                      <tr key={t.id}>
                        <td>{index + 1}</td>
                        <td className="fw-bold" style={{ color: '#2F753A' }}>
                          ${t.monto.toFixed(2)}
                        </td>
                        <td>{t.nota || '-'}</td>
                        <td>{t.esDelivery ? 'Sí' : 'No'}</td>
                        <td>
                          <button
                            onClick={() => comenzarEdicion(t)}
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
                            onClick={() => handleEliminar(t.id)}
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