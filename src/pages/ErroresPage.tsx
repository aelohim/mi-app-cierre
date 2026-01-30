// src/pages/ErroresPage.tsx
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

  const [cargandoOperacion, setCargandoOperacion] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const [monto, setMonto] = useState<string>('');
  const [editando, setEditando] = useState<{ id: number; monto: number } | null>(null);

  // Llenar input cuando editamos
  useEffect(() => {
    if (editando) {
      setMonto(editando.monto.toString()); //AQUI SE ESTA USANDO EL TOSTRING
    } else {
      setMonto('');
    }
  }, [editando]);

  const comenzarEdicion = (errorItem: { id: number; monto: number }) => {
    setEditando({ id: errorItem.id, monto: errorItem.monto });
    setErrorMsg('');
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setMonto('');
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
        await editarError(editando.id.toString(), { monto: montoNum });
        setEditando(null);
      } else {
        await agregarError(montoNum);
      }
      setMonto('');
    } catch (err) {
      setErrorMsg('Error al guardar el error/anulación');
    } finally {
      setCargandoOperacion(false);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Seguro que quieres eliminar este error?')) return;

    setCargandoOperacion(true);
    try {
      await eliminarError(id);
    } catch (err) {
      setErrorMsg('Error al eliminar');
    } finally {
      setCargandoOperacion(false);
    }
  };

  const totalErrores = errores.reduce((acc, e) => acc + e.monto, 0);

  // Semáforo para total de errores (ejemplo: rojo si > umbral, puedes ajustar)
  const semaforoTotal = totalErrores > 5000 ? 'danger' : totalErrores > 1000 ? 'warning' : 'success';

  return (
    <div
      className="min-vh-100 py-5"
      style={{
        backgroundColor: '#FFF361', // Fondo amarillo pastel
        color: '#403636',           // Texto principal negro claro
      }}
    >
      <div className="container">
        {/* Header de página */}
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold" style={{ color: '#1B4822' }}>
            Errores / Anulaciones
          </h1>
          <p className="lead" style={{ color: '#2F753A' }}>
            Día: {caja.fecha} | Turno: {caja.turno?.toUpperCase() ?? 'N/A'}
          </p>
        </div>

        {/* Formulario */}
        <div className="card shadow-lg border-0 mb-5" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div className="card-body p-4 p-md-5">
            <h2 className="card-title text-center mb-4 fw-bold" style={{ color: '#403636' }}>
              {editando ? 'Editar Error/Anulación' : 'Nuevo Error/Anulación'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="monto" className="form-label fw-semibold">
                  Monto del error
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
                    borderColor: '#E44C4C', // Rojo para errores
                    borderWidth: '2px',
                  }}
                  required
                  disabled={cargandoOperacion}
                />
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
                      : 'Registrar'}
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

        {/* Tabla de errores */}
        <div className="card shadow-lg border-0">
          <div
            className="card-header d-flex justify-content-between align-items-center"
            style={{ backgroundColor: '#E44C4C', color: '#FFFFFF' }}
          >
            <h3 className="mb-0">Lista de Errores</h3>
            <span className="fs-4 fw-bold">
              Total: -${totalErrores.toFixed(2)}
            </span>
          </div>

          <div className="card-body p-0">
            {errores.length === 0 ? (
              <p className="text-center py-5 text-muted fs-5">
                No hay errores registrados en este turno
              </p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Monto</th>
                      <th>ID</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {errores.map((e, index) => (
                      <tr key={e.id}>
                        <td>{index + 1}</td>
                        <td className="fw-bold" style={{ color: '#E44C4C' }}>
                          -${Number(e.monto).toFixed(2)}
                        </td>
                        <td className="text-muted small">#{String(e.id).slice(-6)}</td>
                        <td>
                          <button
                            onClick={() => comenzarEdicion(e)}
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
                            onClick={() => handleEliminar(e.id)}
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