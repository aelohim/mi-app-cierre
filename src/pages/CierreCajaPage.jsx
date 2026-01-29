// src/pages/CierreCajaPage.jsx
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

  const [confirmado, setConfirmado] = useState(false);

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

  const handleCerrar = () => {
    if (!confirmado) {
      setConfirmado(true);
      return;
    }
    cerrarCaja();
    navigate('/'); // Vuelve a la página de abrir caja
  };

  if (!caja.abierta) {
    return (
      <div className="p-8 text-center">
        <p className="text-xl text-gray-600">La caja ya está cerrada.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">
        Cierre de Caja - {caja.fecha} | Turno {caja.turno?.toUpperCase()}
      </h1>

      {/* Ingresos manuales */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-6">Ingresar valores finales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Posnet (tarjetas + QR)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={posnet}
              onChange={(e) => setPosnet(Number(e.target.value) || 0)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Efectivo (conteo final)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={efectivo}
              onChange={(e) => setEfectivo(Number(e.target.value) || 0)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Balanza 1
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={balanza1}
              onChange={(e) => setBalanza1(Number(e.target.value) || 0)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Balanza 2
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={balanza2}
              onChange={(e) => setBalanza2(Number(e.target.value) || 0)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Resumen y cálculos */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="bg-gray-800 text-white px-6 py-4">
          <h2 className="text-2xl font-bold">Resumen del Cierre</h2>
        </div>

        <table className="w-full">
          <tbody>
            <tr className="border-b">
              <td className="px-6 py-4 font-medium">Transferencias</td>
              <td className="px-6 py-4 text-right text-green-600">
                +${totalTransferencias.toFixed(2)}
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-6 py-4 font-medium">Posnet</td>
              <td className="px-6 py-4 text-right text-green-600">
                +${posnet.toFixed(2)}
              </td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="px-6 py-4 font-bold">Débito</td>
              <td className="px-6 py-4 text-right font-bold text-green-700">
                ${debito.toFixed(2)}
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-6 py-4 font-medium">Efectivo</td>
              <td className="px-6 py-4 text-right text-green-600">
                +${efectivo.toFixed(2)}
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-6 py-4 font-medium">Errores/Anulaciones</td>
              <td className="px-6 py-4 text-right text-red-600">
                -${totalErrores.toFixed(2)}
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-6 py-4 font-medium">Pagos desde caja</td>
              <td className="px-6 py-4 text-right text-red-600">
                -${totalPagosCaja.toFixed(2)}
              </td>
            </tr>
            <tr className="border-b bg-blue-50">
              <td className="px-6 py-4 font-bold text-lg">Total Esperado</td>
              <td className="px-6 py-4 text-right font-bold text-lg text-blue-700">
                ${totalEsperado.toFixed(2)}
              </td>
            </tr>
            <tr className="border-b bg-gray-100">
              <td className="px-6 py-4 font-bold">Control Balanzas</td>
              <td className="px-6 py-4 text-right font-bold">
                ${controlBalanzas.toFixed(2)}
              </td>
            </tr>
            <tr className="bg-yellow-50">
              <td className="px-6 py-6 font-bold text-xl">Discrepancia</td>
              <td className={`px-6 py-6 text-right text-3xl font-bold ${
                Math.abs(discrepancia) < 0.01 ? 'text-green-600' : 'text-red-600'
              }`}>
                {discrepancia >= 0 ? '+' : ''}${discrepancia.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Botón de cierre */}
      <div className="text-center mt-10">
        <button
          onClick={handleCerrar}
          className={`px-10 py-4 text-xl font-bold rounded-lg shadow-lg transition-all ${
            confirmado
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-orange-500 hover:bg-orange-600 text-white'
          }`}
        >
          {confirmado
            ? 'CONFIRMAR CIERRE DE CAJA'
            : `Cerrar Caja (discrepancia: ${discrepancia >= 0 ? '+' : ''}${discrepancia.toFixed(2)})`}
        </button>

        {Math.abs(discrepancia) >= 0.01 && (
          <p className="text-red-600 mt-4 font-medium">
            ¡Atención! Hay una diferencia de ${Math.abs(discrepancia).toFixed(2)}. Revisa los valores.
          </p>
        )}
      </div>
    </div>
  );
}