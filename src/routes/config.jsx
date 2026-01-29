import TransferenciasPage from '../pages/TransferenciasPage.jsx';
import AbrirCajaPage from '../pages/AbrirCajaPage.jsx';
import CierreCajaPage from '../pages/CierreCajaPage.jsx';
import DashboardPage from '../pages/DashBoardPage.jsx';
import ErroresPage from '../pages/ErroresPage.jsx';
import PagosPage from '../pages/PagosPage.jsx';

const routesConfig = [
    {
        path: '/',
        element: <AbrirCajaPage />,
        title: 'Abrir caja',
        requiresClosed: true,
    },
    {
        path: '/transferencias',
        element: <TransferenciasPage />,
        title: 'Transferencias',
        protected: true,
    },
    {
        path: '/dashboard',
        element: <DashboardPage />,
        title: 'Dashboard',
        protected: true,
    },
    {
        path: '/errores',
        element: <ErroresPage />,
        title: 'Errores',
        protected: true,
    },
    {
        path: '/pagos',
        element: <PagosPage />,
        title: 'Pagos',
        protected: true,
    },
    {
        path: '/cierre-caja',
        element: <CierreCajaPage />,
        title: 'Cierre de Caja',
        protected: true, // Solo si caja abierta
    },

];

export default routesConfig;