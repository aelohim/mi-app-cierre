// src/pages/TransferenciasPage.tsx
import { useState, useEffect } from 'react';
import { useCaja } from '../context/CajaContext';
import { type Transferencia } from '../api/transferenciasApi';
import { FiEdit, FiTrash2 } from 'react-icons/fi';  // Feather Icons

export default function TransferenciasPage() {
  const {
    caja,
    transferencias,
    agregarTransferencia,
    editarTransferencia,
    eliminarTransferencia,
  } = useCaja();

  const [monto, setMonto] = useState<number>(0);
  const [nota, setNota] = useState<string>('');
  const [editando, setEditando] = useState<{ id: string; monto: number; nota?: string } | null>(null);
  const [cargandoOperacion, setCargandoOperacion] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const total = transferencias.reduce((acc, t) => acc + t.monto, 0);

  // Llenar formulario cuando editamos
  useEffect(() => {
    if (editando) {
      setMonto(editando.monto);
      setNota(editando.nota || '');
    } else {
      setMonto(0);
      setNota('');
    }
  }, [editando]);

  const comenzarEdicion = (t: Transferencia) => {
    setEditando({
      id: t.id,
      monto: t.monto,
      // Usamos || undefined para que si es null, se guarde como undefined
      nota: t.nota || undefined
    });
    setErrorMsg('');
  };
  const cancelarEdicion = () => {
    setEditando(null);
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const montoNum = monto;
    if (!monto || isNaN(montoNum) || montoNum <= 0) {
      setErrorMsg('Ingresa un monto válido mayor a 0');
      return;
    }

    setCargandoOperacion(true);
    setErrorMsg('');

    try {
      if (editando) {
        await editarTransferencia(editando.id.toString(), {
          monto: montoNum,
          nota: nota || undefined,
        });
        setEditando(null);
      } else {
        await agregarTransferencia(montoNum, nota || undefined);
      }
      setMonto(0);
      setNota('');
    } catch (err) {
      setErrorMsg('Error al guardar la transferencia');
    } finally {
      setCargandoOperacion(false);
    }
  };

  const handleEliminar = async (id: string) => {
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
                  onChange={(e) => setMonto(Number(e.target.value))}
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
                        <td className="actions-container text-center">
                          <button
                            onClick={() => comenzarEdicion(t)}
                            className="btn-action btn-edit"
                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                            title="Editar"
                            disabled={cargandoOperacion}
                          >
                            <FiEdit size={20} />
                          </button>
                          <button
                            onClick={() => handleEliminar(t.id)}
                            className="btn-action btn-delete"
                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                            title="Eliminar"
                            disabled={cargandoOperacion}
                          >
                            <FiTrash2 size={20} />
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