import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/global.css'
//@ts-ignore
import CajaProvider from './context/CajaContext.jsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CajaProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CajaProvider>
  </StrictMode>,
)
