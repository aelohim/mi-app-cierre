import { useState } from 'react';
import { useCaja } from '../context/CajaContext';

export default function TransferenciasPage() {
  const { 
    caja, 
    transferencias, 
    agregarTransferencia,
    editarTransferencia,
    eliminarTransferencia 
  } = useCaja();

  const [monto, setMonto] = useState('');
  const [editando, setEditando] = useState(null); // modo edición local

  const total = transferencias.reduce((acc, t) => acc + t.monto, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const montoNum = Number(monto);

    if (editando) {
      // Editar
      await editarTransferencia(editando.id, { monto: montoNum });
      setEditando(null);
    } else {
      // Crear
      await agregarTransferencia(montoNum);
    }
    setMonto('');
  };

  const comenzarEdicion = (t) => {
    setEditando(t);
    setMonto(t.monto.toString());
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setMonto('');
  };

  return (
    <div>
      <h1>Transferencias - {caja.fecha} - Turno {caja.turno}</h1>

      <form onSubmit={handleSubmit}>
        <h2>{editando ? 'Editar' : 'Nueva'} Transferencia</h2>
        <input
          type="number"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          required
        />
        <button type="submit">{editando ? 'Guardar cambios' : 'Agregar'}</button>
        {editando && <button type="button" onClick={cancelarEdicion}>Cancelar</button>}
      </form>

      <h3>Total: ${total.toFixed(2)}</h3>

      <ul>
        {transferencias.map(t => (
          <li key={t.id}>
            ${t.monto} - {t.nota || 'Sin nota'}
            <button onClick={() => comenzarEdicion(t)}>Editar</button>
            <button onClick={() => eliminarTransferencia(t.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}