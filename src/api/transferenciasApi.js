//ruta
const API_URL = 'http://localhost:4000/transferencias';

//Helper para manejar errores y reutilizarlo
const handleResponse = async (response) => {
    if(!response.ok){
        const error = await response.json().catch(()=> ({}));
        throw new Error(error.message || `Error ${response.status}`);
   }
   return response.json();
};
// GET ALL con filtros opcionales
export const getTransferencias = async (filtros = {}) => {
  const params = new URLSearchParams(filtros).toString();
  const url = `${API_URL}${params ? `?${params}` : ''}`;
  const response = await fetch(url);
  return handleResponse(response);
};
// GET BY ID → Obtener una transferencia por ID
export const getTransferenciaById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  return handleResponse(response);
};

// POST → Crear nueva transferencia
export const crearTransferencia = async (nuevaTransferencia) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(nuevaTransferencia),
  });
  return handleResponse(response);
};

// PUT → Actualizar transferencia completa (reemplaza todo)
export const actualizarTransferencia = async (id, datosActualizados) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datosActualizados),
  });
  return handleResponse(response);
};


// DELETE → Eliminar transferencia
export const eliminarTransferencia = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Error al eliminar la transferencia');
  }
  return true; // json-server no devuelve cuerpo en DELETE
};
