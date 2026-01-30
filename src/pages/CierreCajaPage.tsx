// src/pages/CierreCajaPage.tsx
import { useState } from 'react';
import { useCaja } from '../context/CajaContext';
import { useNavigate } from 'react-router-dom';

export default function CierreCajaPage() {
  const navigate = useNavigate();
  const {
    caja,
    transferencias,
    errores,
    pagos,
    posnet,
    setPosnet,
    efectivo,
    setEfectivo,
    balanza1,
    setBalanza1,
    balanza2,
    setBalanza2,
    cerrarCaja,
  } = useCaja();

  const [confirmado, setConfirmado] = useState<boolean>(false);

  // Cálculos automáticos
  const totalTransferencias = transferencias.reduce((acc, t) => acc + t.monto, 0);
  const totalErrores = errores.reduce((acc, e) => acc + e.monto, 0);
  const totalPagosCaja = pagos
    .filter(p => p.tipo === 'caja')
    .reduce((acc, p) => acc + p.monto, 0);

  const debito = totalTransferencias + posnet;
  const totalEsperado = debito + efectivo - totalPagosCaja - totalErrores;
  const controlBalanzas = balanza1 + balanza2;
  const discrepancia = totalEsperado - controlBalanzas;

  // Semáforo para discrepancia
  const semaforoDiscrepancia = Math.abs(discrepancia) < 0.01
    ? 'success'
    : 'danger';

  const handleCerrar = () => {
    if (!confirmado) {
      setConfirmado(true);
      return;
    }
    cerrarCaja();
    navigate('/');
  };

  if (!caja.abierta) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="alert alert-warning text-center p-5 shadow-lg">
          <h2 className="alert-heading">Caja ya cerrada</h2>
          <p className="fs-5">No puedes cerrar una caja que ya está cerrada.</p>
        </div>
      </div>
    );
  }

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
            Cierre de Caja
          </h1>
          <p className="lead" style={{ color: '#2F753A' }}>
            {caja.fecha} | Turno {caja.turno?.toUpperCase() ?? 'N/A'}
          </p>
        </div>

        {/* Formulario valores manuales */}
        <div className="card shadow-lg border-0 mb-5">
          <div className="card-header text-white fw-bold" style={{ backgroundColor: '#2F753A' }}>
            Ingresar valores finales
          </div>
          <div className="card-body p-4 p-md-5">
            <div className="row g-4">
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  Posnet (tarjetas + QR)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={posnet}
                  onChange={(e) => setPosnet(Number(e.target.value) || 0)}
                  className="form-control form-control-lg text-end"
                  style={{
                    borderColor: '#5FBA6D',
                    borderWidth: '2px',
                  }}
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  Efectivo (conteo final)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={efectivo}
                  onChange={(e) => setEfectivo(Number(e.target.value) || 0)}
                  className="form-control form-control-lg text-end"
                  style={{
                    borderColor: '#5FBA6D',
                    borderWidth: '2px',
                  }}
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  Balanza 1
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={balanza1}
                  onChange={(e) => setBalanza1(Number(e.target.value) || 0)}
                  className="form-control form-control-lg text-end"
                  style={{
                    borderColor: '#5FBA6D',
                    borderWidth: '2px',
                  }}
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  Balanza 2
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={balanza2}
                  onChange={(e) => setBalanza2(Number(e.target.value) || 0)}
                  className="form-control form-control-lg text-end"
                  style={{
                    borderColor: '#5FBA6D',
                    borderWidth: '2px',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Resumen y cálculos */}
        <div className="card shadow-lg border-0 mb-5">
          <div className="card-header text-white fw-bold" style={{ backgroundColor: '#1B4822' }}>
            Resumen del Cierre
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-bordered mb-0">
                <tbody>
                  <tr>
                    <td className="fw-semibold">Transferencias</td>
                    <td className="text-end text-success fw-bold">
                      +${totalTransferencias.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-semibold">Posnet</td>
                    <td className="text-end text-success fw-bold">
                      +${posnet.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="table-active">
                    <td className="fw-bold">Débito</td>
                    <td className="text-end fw-bold text-success">
                      ${debito.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-semibold">Efectivo</td>
                    <td className="text-end text-success fw-bold">
                      +${efectivo.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-semibold">Errores/Anulaciones</td>
                    <td className="text-end text-danger fw-bold">
                      -${totalErrores.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-semibold">Pagos desde caja</td>
                    <td className="text-end text-danger fw-bold">
                      -${totalPagosCaja.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="table-active">
                    <td className="fw-bold">Total Esperado</td>
                    <td className="text-end fw-bold text-primary">
                      ${totalEsperado.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="table-active">
                    <td className="fw-bold">Control Balanzas</td>
                    <td className="text-end fw-bold">
                      ${controlBalanzas.toFixed(2)}
                    </td>
                  </tr>
                  <tr className={`table-${semaforoDiscrepancia}`}>
                    <td className="fw-bold fs-5">Discrepancia</td>
                    <td className="text-end fw-bold fs-4">
                      {discrepancia >= 0 ? '+' : ''}${Math.abs(discrepancia).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Botón de cierre */}
        <div className="text-center mt-5">
          <button
            onClick={handleCerrar}
            className={`btn btn-lg fw-bold px-5 py-3 shadow-lg ${
              confirmado
                ? 'bg-danger text-white hover:bg-danger-subtle'
                : 'bg-primary text-dark hover:bg-primary-subtle'
            }`}
            style={{
              backgroundColor: confirmado ? '#E44C4C' : '#FCEA10',
              color: confirmado ? '#FFFFFF' : '#1B4822',
              border: 'none',
            }}
          >
            {confirmado
              ? 'CONFIRMAR CIERRE DE CAJA'
              : `Cerrar Caja (discrepancia: ${discrepancia >= 0 ? '+' : ''}${discrepancia.toFixed(2)})`}
          </button>

          {Math.abs(discrepancia) >= 0.01 && (
            <p className="text-danger mt-4 fw-bold fs-5">
              ¡Atención! Hay una diferencia de ${Math.abs(discrepancia).toFixed(2)}.  
              Revisa los valores antes de cerrar.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}