// src/pages/AbrirCajaPage.tsx
import { useCaja } from '../context/CajaContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function AbrirCajaPage() {
  const { abrirCaja, caja } = useCaja();
  const navigate = useNavigate();

  const [turno, setTurno] = useState<'mañana' | 'tarde'>('mañana');

  // Redirigir si ya está abierta
  useEffect(() => {
    if (caja?.abierta) {
      navigate('/dashboard', { replace: true });
    }
  }, [caja?.abierta, navigate]);

  const handleAbrirCaja = (e: React.FormEvent) => {
    e.preventDefault();
    abrirCaja(turno);
    navigate('/dashboard');
  };

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center min-vh-100 py-5"
      style={{
        backgroundColor: '#FFF361', // Amarillo pastel de fondo
        color: '#403636',           // Negro claro para textos
      }}
    >
      {/* Logo centrado arriba */}
      <div className="mb-5 text-center">
        <img
          src="assets/logo-panaderia.png" // ← Cambia esta ruta por la real de tu logo
          alt="Panadería Reina de la Paz"
          style={{ maxWidth: '220px', height: 'auto' }}
        />
        <h2 className="mt-3 fw-bold" style={{ color: '#1B4822' }}>
          Abrir Caja
        </h2>
      </div>

      {/* Card centrada con el formulario */}
      <div className="card shadow-lg border-0" style={{ maxWidth: '400px', width: '90%' }}>
        <div className="card-body p-4 p-md-5">
          <form onSubmit={handleAbrirCaja}>
            {/* Fecha actual (solo informativa) */}
            <div className="mb-4 text-center">
              <label className="form-label fw-semibold" style={{ color: '#403636' }}>
                Fecha actual
              </label>
              <p className="fs-5 mb-0" style={{ color: '#2F753A' }}>
                {new Date().toLocaleDateString('es-AR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            {/* Select de turno */}
            <div className="mb-5">
              <label htmlFor="turno" className="form-label fw-semibold">
                Selecciona el turno
              </label>
              <select
                id="turno"
                className="form-select form-select-lg"
                value={turno}
                onChange={(e) => setTurno(e.target.value as 'mañana' | 'tarde')}
                style={{
                  borderColor: '#5FBA6D',           // Verde más claro
                  borderWidth: '2px',
                  color: '#403636',
                }}
              >
                <option value="mañana">Mañana</option>
                <option value="tarde">Tarde</option>
              </select>
            </div>

            {/* Botón principal */}
            <button
              type="submit"
              className="btn btn-lg w-100 fw-bold"
              style={{
                backgroundColor: '#FCEA10', // Amarillo original
                color: '#1B4822',           // Verde oscuro para contraste
                border: 'none',
                fontSize: '1.3rem',
                padding: '0.9rem',
              }}
            >
              Abrir Caja
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}