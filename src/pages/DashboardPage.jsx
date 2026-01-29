// src/pages/DashboardPage.jsx
import { useCaja } from '../context/CajaContext';

export default function DashboardPage() {
  const {
    caja,
    transferencias,
    errores,
    pagos,
  } = useCaja();

  // Cálculos
  const totalTransferencias = transferencias.reduce((acc, t) => acc + t.monto, 0);
  const cantTransferencias = transferencias.length;

  const totalErrores = errores.reduce((acc, e) => acc + e.monto, 0);
  const cantErrores = errores.length;

  const totalPagosCaja = pagos.filter(p => p.tipo === 'caja').reduce((acc, p) => acc + p.monto, 0);
  const totalPagosFuera = pagos.filter(p => p.tipo === 'fuera').reduce((acc, p) => acc + p.monto, 0);

  const netoEstimado = totalTransferencias - totalErrores - totalPagosCaja;

  const turnoActual = caja.turno ? caja.turno.toUpperCase() : 'CERRADA';

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Header compacto */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">
          Dashboard - {caja.fecha} | Turno {turnoActual}
        </h1>
        {!caja.abierta && (
          <p className="text-red-600 mt-2 font-medium">
            Caja cerrada - Abre para registrar operaciones
          </p>
        )}
      </div>

      {caja.abierta ? (
        <>
          {/* Tarjetas compactas en grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* Transferencias */}
            <div className="bg-green-600 text-white p-4 rounded-lg shadow">
              <h3 className="font-semibold">Transferencias</h3>
              <p className="text-2xl font-bold">${totalTransferencias.toFixed(2)}</p>
              <p className="text-sm opacity-90">{cantTransferencias} op.</p>
            </div>

            {/* Errores */}
            <div className="bg-red-600 text-white p-4 rounded-lg shadow">
              <h3 className="font-semibold">Errores/Anulaciones</h3>
              <p className="text-2xl font-bold">-${totalErrores.toFixed(2)}</p>
              <p className="text-sm opacity-90">{cantErrores} reg.</p>
            </div>

            {/* Pagos Caja */}
            <div className="bg-purple-600 text-white p-4 rounded-lg shadow">
              <h3 className="font-semibold">Pagos desde Caja</h3>
              <p className="text-2xl font-bold">-${totalPagosCaja.toFixed(2)}</p>
              <p className="text-sm opacity-90">
                {pagos.length} total{pagos.length !== 1 ? 'es' : ''}
                {totalPagosFuera > 0 && ` ($${totalPagosFuera.toFixed(2)} fuera)`}
              </p>
            </div>
          </div>

          {/* Resumen neto compacto */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-lg text-gray-700">Neto Estimado del Turno</p>
            <p className={`text-3xl font-bold ${netoEstimado >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${netoEstimado.toFixed(2)}
            </p>
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-gray-100 rounded-lg">
          <p className="text-lg text-gray-600">
            No hay datos disponibles. Abre la caja para comenzar.
          </p>
        </div>
      )}
    </div>
  );
}