import TransferenciasPage from '../pages/TransferenciasPage.tsx';
import AbrirCajaPage from '../pages/AbrirCajaPage.tsx';
import CierreCajaPage from '../pages/CierreCajaPage.tsx';
import DashboardPage from '../pages/DashboardPage.tsx';
import ErroresPage from '../pages/ErroresPage.tsx';
import PagosPage from '../pages/PagosPage.tsx';
import DeliverysPage from '../pages/DeliverysPage.tsx';

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
        path: '/deliverys',
        element: <DeliverysPage />,
        title: 'Deliveryss',
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