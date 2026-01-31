// src/pages/DeliverysPage.tsx
import { useState, useEffect } from 'react';
import { useCaja } from '../context/CajaContext';
import { type Delivery} from '../api/deliverysApi';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

export default function DeliverysPage() {
  const {
    caja,
    deliverys,
    agregarDelivery,
    editarDelivery,
    eliminarDelivery,
  } = useCaja();

  const [monto, setMonto] = useState<number>(0)
  const [dentroCiudad, setDentroCiudad] = useState<boolean>(true);
  const [tipoPago, setTipoPago] = useState<'efectivo' | 'transferencia'>('efectivo');
  const [direccion, setDireccion] = useState<string>('');
  const [idDelivery, setIdDelivery] = useState<'1' | '2'>('1');
  
  const [editando, setEditando] = useState<Delivery | null>(null);

  const [cargandoOperacion, setCargandoOperacion] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const totalEnvios = deliverys.reduce((acc, d) => acc + d.monto, 0);

  // Llenar formulario al editar
  useEffect(() => {
    if (editando) {
      setDentroCiudad(!editando.lejano);
      setTipoPago(editando.tipo);
      setDireccion(editando.direccion || '');
      setIdDelivery(editando.id_delivery);
    } else {
      setDentroCiudad(true);
      setTipoPago('efectivo');
      setDireccion('');
      setIdDelivery('1');
    }
  }, [editando]);

  const comenzarEdicion = (d: Delivery) => {
    setEditando(d);
    setErrorMsg('');
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const montoEnvio = dentroCiudad ? 1000 : 1200;
    const montoTotal = monto + montoEnvio;
    const lejano = !dentroCiudad;

    setCargandoOperacion(true);
    setErrorMsg('');

    try {
      if (editando) {
        await editarDelivery(editando.id, {
          monto: montoTotal,
          tipo: tipoPago,
          lejano,
          direccion: direccion || null,
          id_delivery: idDelivery,
        });
        setEditando(null);
      } else {
        // ¡AHORA SÍ! Respeta exactamente la firma del contexto
        await agregarDelivery(
          montoTotal,        // ← number
          tipoPago,          // ← 'efectivo' | 'transferencia'
          idDelivery,        // ← '1' | '2' (va antes que lejano)
          lejano,            // ← boolean
          direccion || undefined  // ← string | undefined (mejor que null)
        );
      }

      // Resetear formulario
      setDentroCiudad(true);
      setMonto(0);
      setTipoPago('efectivo');
      setDireccion('');
      setIdDelivery('1');
    } catch (err) {
      setErrorMsg('Error al guardar el delivery');
      console.error(err);
    } finally {
      setCargandoOperacion(false);
    }
  };

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar este delivery?')) return;

    setCargandoOperacion(true);
    try {
      await eliminarDelivery(id);
    } catch (err) {
      setErrorMsg('Error al eliminar');
      console.error(err);
    } finally {
      setCargandoOperacion(false);
    }
  };

  // ... resto del JSX igual (sin cambios necesarios)
  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: '#FFF361', color: '#403636' }}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold" style={{ color: '#1B4822' }}>
            Deliverys
          </h1>
          <p className="lead" style={{ color: '#2F753A' }}>
            Día: {caja.fecha} | Turno: {caja.turno?.toUpperCase() ?? 'N/A'}
          </p>
        </div>

        {/* Formulario */}
        <div className="card shadow-lg border-0 mb-5" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="card-body p-4 p-md-5">
            <h2 className="card-title text-center mb-4 fw-bold" style={{ color: '#403636' }}>
              {editando ? 'Editar Delivery' : 'Nuevo Delivery'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="row g-4 mb-4">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Zona</label>
                  <div className="form-check form-switch">
                    <input
                      id="dentroCiudad"
                      type="checkbox"
                      className="form-check-input"
                      checked={dentroCiudad}
                      onChange={(e) => setDentroCiudad(e.target.checked)}
                      disabled={cargandoOperacion}
                      style={{ borderColor: '#5FBA6D' }}
                    />
                    <label htmlFor="dentroCiudad" className="form-check-label fw-semibold">
                      Dentro de la ciudad ($1000) / Fuera ($1200)
                    </label>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Tipo de pago</label>
                  <select
                    className="form-select form-select-lg"
                    value={tipoPago}
                    onChange={(e) => setTipoPago(e.target.value as 'efectivo' | 'transferencia')}
                    disabled={cargandoOperacion}
                    style={{ borderColor: '#2F753A', borderWidth: '2px' }}
                  >
                    <option value="efectivo">Efectivo</option>
                    <option value="transferencia">Transferencia</option>
                  </select>
                </div>

                <div className="col-12">
                  <label htmlFor="direccion" className="form-label fw-semibold">
                    Dirección (opcional)
                  </label>
                  <input
                    id="direccion"
                    type="text"
                    placeholder="Ej: Calle 123, Barrio Centro"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    className="form-control form-control-lg"
                    style={{ borderColor: '#5FBA6D' }}
                    disabled={cargandoOperacion}
                  />
                </div>

                <div className="col-12">
                  <label htmlFor="monto" className="form-label fw-semibold">
                    Monto
                  </label>
                  <input
                    id="monto"
                    type="number"
                    value={monto}
                    onChange={(e) => setMonto(Number(e.target.value))}
                    className="form-control form-control-lg"
                    style={{ borderColor: '#5FBA6D' }}
                    disabled={cargandoOperacion}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Delivery</label>
                  <select
                    className="form-select form-select-lg"
                    value={idDelivery}
                    onChange={(e) => setIdDelivery(e.target.value as '1' | '2')}
                    disabled={cargandoOperacion}
                    style={{ borderColor: '#2F753A', borderWidth: '2px' }}
                  >
                    <option value="1">Delivery 1</option>
                    <option value="2">Delivery 2</option>
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
                    : 'Registrar Delivery'}
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

        {/* Lista y total */}
        <div className="card shadow-lg border-0">
          <div
            className="card-header d-flex justify-content-between align-items-center flex-wrap gap-3"
            style={{ backgroundColor: '#5FBA6D', color: '#FFFFFF' }}
          >
            <h3 className="mb-0">Lista de Deliverys</h3>
            <div className="text-end">
              <div className="fs-5 fw-bold">
                Total Envíos: ${totalEnvios.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="card-body p-0">
            {deliverys.length === 0 ? (
              <p className="text-center py-5 text-muted fs-5">
                No hay deliverys registrados en este turno
              </p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Monto Envío</th>
                      <th>Tipo Pago</th>
                      <th>Zona</th>
                      <th>Dirección</th>
                      <th>Delivery</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliverys.map((d, index) => (
                      <tr key={d.id}>
                        <td>{index + 1}</td>
                        <td className="fw-bold" style={{ color: '#2F753A' }}>
                          ${d.monto.toFixed(2)}
                        </td>
                        <td>{d.tipo}</td>
                        <td>{d.lejano ? 'Fuera ciudad ($1200)' : 'Dentro ciudad ($1000)'}</td>
                        <td>{d.direccion || '-'}</td>
                        <td>Delivery {d.id_delivery}</td>
                        <td className='actions-container'>
                          <button
                            onClick={() => comenzarEdicion(d)}
                            className="btn-action btn-edit"
                            disabled={cargandoOperacion}
                          >
                            <FiEdit size={20}></FiEdit>
                          </button>
                          <button
                            onClick={() => handleEliminar(d.id)}
                            className="btn-action btn-delete"
                            disabled={cargandoOperacion}
                          >
                            <FiTrash2 size={20}/>
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