import { Link } from "react-router-dom";
export default function Layout({ children }) {
  return (
    <>
      <header className="p-3 bg-dark text-white">
        <h2>Sistema de Caja</h2>
        {/* Navbar fija */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Mi Cierre de Caja
          </Link>
          <div className="navbar-nav ms-auto">
            <Link className="nav-link" to="/abrir-caja">Abrir Caja</Link>
            <Link className="nav-link" to="/transferencias">Transferencias</Link>
            <Link className="nav-link" to="/cierre-caja">Cierre de Caja</Link>
            <Link className="nav-link" to="/dashboard">Dashboard</Link>
            <Link className="nav-link" to="/errores">Errores</Link>
            <Link className="nav-link" to="/pagos">Pagos</Link>
          </div>
        </div>
      </nav>
      </header>

      <main className="container mt-4">
        {children}
      </main>
    </>
  );
}
