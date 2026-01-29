import { useCaja } from "../context/CajaContext.jsx";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function AbrirCajaPage() {

  const {abrirCaja, caja} = useCaja();
  const navigate = useNavigate();

  const [turno, setTurno] = useState("mañana");

  // ← Esto es lo que faltaba: useEffect
  useEffect(() => {
    if (caja?.abierta) {
      navigate("/dashboard", { replace: true });
    }
  }, [caja?.abierta, navigate]);


  const handleAbrirCaja = (e) => {
    e.preventDefault();
    abrirCaja(turno);
    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleAbrirCaja}>
      <h1>Abrir Caja</h1>
      <select className="form-select" value={turno} onChange={(e)=> setTurno(e.target.value)}>
        <option value="mañana">Mañana</option>
        <option value="tarde">Tarde</option>
      </select>
      <button type="submit"> Abrir Caja </button>
    </form>
  )
}

export default AbrirCajaPage;