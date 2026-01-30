// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import CajaProvider from './context/CajaContext.tsx';

// Estilos - orden recomendado: librerías primero, luego globales propios
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap base
import './styles/variables.css';               // Tus variables de marca (si existe)
import './styles/global.css';                  // Overrides y resets globales

// ¡Importante! Bootstrap JavaScript para interactividad (toggler, collapse, etc.)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CajaProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CajaProvider>
  </StrictMode>,
);