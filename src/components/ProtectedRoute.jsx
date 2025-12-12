import { useCaja } from "../context/CajaContext.jsx";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";


function ProtectedRoute({ children, requiresClosed = false }) {
     const { caja } = useCaja();

    if (requiresClosed && caja.abierta){
        return <Navigate to="/dashboard" replace/>;
    }

    if (!requiresClosed && (!caja.abierta || !caja.turno)){
      return <Navigate to="/" replace />
    }
    
  return children;
}

export default ProtectedRoute
