// src/pages/DashboardPage.tsx
import { useCaja } from '../context/CajaContext';

export default function DashboardPage() {
  const { caja, transferencias, errores, pagos } = useCaja();

  const totalTransferencias = transferencias.reduce((acc, t) => acc + t.monto, 0);
  const totalErrores = errores.reduce((acc, e) => acc + e.monto, 0);
  const totalPagosCaja = pagos.filter(p => p.tipo === 'caja').reduce((acc, p) => acc + p.monto, 0);
  const netoEstimado = totalTransferencias - totalErrores - totalPagosCaja;

  const semaforoNeto = netoEstimado >= 0 ? 'success' : 'danger';

  return (
    <div className="container py-4">
      {/* Header estilo referencia */}
      <div className="bg-primary text-white p-3 rounded-top mb-3">
        <h2 className="mb-0 text-center fw-bold">
          Dashboard - {caja.fecha} | Turno {caja.turno?.toUpperCase() ?? 'CERRADA'}
        </h2>
      </div>

      {!caja.abierta ? (
        <div className="alert alert-warning text-center">
          Caja cerrada. Abre para ver datos del turno.
        </div>
      ) : (
        <>
          {/* Leyenda semáforo (como en la referencia) */}
          <div className="card mb-4">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">Leyenda de Semáforo</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-around">
                <div className="text-center">
                  <div className="bg-success p-3 rounded-circle mb-2" style={{ width: '60px', height: '60px' }} />
                  <p className="mb-0 fw-bold">Bueno</p>
                </div>
                <div className="text-center">
                  <div className="bg-warning p-3 rounded-circle mb-2" style={{ width: '60px', height: '60px' }} />
                  <p className="mb-0 fw-bold">Regular</p>
                </div>
                <div className="text-center">
                  <div className="bg-danger p-3 rounded-circle mb-2" style={{ width: '60px', height: '60px' }} />
                  <p className="mb-0 fw-bold">Malo</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjetas resumen */}
          <div className="row g-4 mb-5">
            <div className="col-12 col-md-4">
              <div className="card border-success shadow h-100">
                <div className="card-body text-center">
                  <h5 className="text-success">Transferencias</h5>
                  <p className="display-5 fw-bold">${totalTransferencias.toFixed(2)}</p>
                </div>
              </div>
            </div>
            {/* ... otras tarjetas similares */}
          </div>

          {/* Tabla de detalle (estilo referencia) */}
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Registro del Turno</h5>
            </div>
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Concepto</th>
                    <th>Monto</th>
                    <th>Registros</th>
                    <th>Semáforo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Transferencias</td>
                    <td>${totalTransferencias.toFixed(2)}</td>
                    <td>{transferencias.length}</td>
                    <td className="bg-success text-white text-center fw-bold">OK</td>
                  </tr>
                  <tr>
                    <td>Errores/Anulaciones</td>
                    <td>-${totalErrores.toFixed(2)}</td>
                    <td>{errores.length}</td>
                    <td className="bg-danger text-white text-center fw-bold">Revisar</td>
                  </tr>
                  {/* ... más filas */}
                  <tr className="table-active">
                    <td><strong>Neto Estimado</strong></td>
                    <td><strong>${netoEstimado.toFixed(2)}</strong></td>
                    <td>—</td>
                    <td className={`bg-${semaforoNeto} text-white text-center fw-bold`}>
                      {netoEstimado >= 0 ? 'BUENO' : 'REVISAR'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}