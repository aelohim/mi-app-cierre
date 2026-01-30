// src/components/Layout.tsx
import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { useCaja } from '../context/CajaContext';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { caja } = useCaja();

  // Definimos las rutas según el estado de la caja
  const navItems = caja.abierta
    ? [
        { path: '/transferencias', label: 'Transferencias' },
        { path: '/errores', label: 'Errores' },
        { path: '/pagos', label: 'Pagos' },
        { path: '/cierre-caja', label: 'Cierre' },
        { path: '/dashboard', label: 'Dashboard' },
      ]
    : [
        { path: '/', label: 'Abrir Caja' },
        { path: '/dashboard', label: 'Dashboard' }, // opcional: resumen aunque esté cerrada
      ];

  return (
    <>
      {/* Navbar con verde oscuro #1B4822 */}
      <nav
        className="navbar navbar-expand-lg sticky-top shadow-sm"
        style={{ backgroundColor: '#1B4822' }}
      >
        <div className="container-fluid px-3 px-md-4">
          {/* Brand con amarillo original #FCEA10 */}
          <NavLink
            className="navbar-brand fw-bold fs-4"
            to="/"
            style={{ color: '#FCEA10' }}
          >
            Reina de la Paz - Caja
          </NavLink>

          {/* Botón hamburguesa */}
          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
          </button>

          {/* Menú colapsable */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {navItems.map((item) => (
                <li className="nav-item" key={item.path}>
                  <NavLink
                    className={({ isActive }) =>
                      `nav-link fs-5 ${isActive ? 'fw-bold' : ''}`
                    }
                    style={({ isActive }) => ({
                      color: isActive ? '#FCEA10' : '#FFFFFF',
                    })}
                    to={item.path}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Indicador de estado (visible en desktop) */}
            <div className="ms-3 d-none d-lg-block">
              {caja.abierta ? (
                <span
                  className="badge px-3 py-2 fs-6"
                  style={{
                    backgroundColor: '#5FBA6D', // Verde más claro
                    color: '#FFFFFF',
                  }}
                >
                  ABIERTA – {caja.turno?.toUpperCase() ?? '—'}
                </span>
              ) : (
                <span
                  className="badge px-3 py-2 fs-6"
                  style={{
                    backgroundColor: '#E44C4C', // Rojo
                    color: '#FFFFFF',
                  }}
                >
                  CERRADA
                </span>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main
        className="py-4 py-md-5"
        style={{
          backgroundColor: '#FFF361',
          minHeight: 'calc(100vh - 56px - 56px)', // Ajuste navbar + footer
          color: '#403636',
        }}
      >
        <div className="container">{children}</div>
      </main>

      {/* Footer */}
      <footer
        className="text-center py-3 small mt-auto"
        style={{
          backgroundColor: '#1B4822',
          color: '#FFFFFF',
        }}
      >
        <div className="container">
          Panadería Reina de la Paz – Sistema de Caja © {new Date().getFullYear()}
        </div>
      </footer>
    </>
  );
}