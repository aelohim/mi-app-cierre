import TransferenciasPage from '../pages/TransferenciasPage.jsx';
import AbrirCajaPage from '../pages/AbrirCajaPage.jsx';
import DashboardPage from '../pages/DashBoardPage.jsx';

const routesConfig =[
    {
        path: '/',
        element: <AbrirCajaPage/>,
        title: 'Abrir caja',
        requiresClosed: true,
    },
    {
        path: '/transferencias',
        element: <TransferenciasPage/>,
        title: 'Abrir caja',
        protected: true,
    },
    {
        path: '/dashboard',
        element: <DashboardPage/>,
        title: 'Dashboard',
        protected: true,
    },

];

export default routesConfig;