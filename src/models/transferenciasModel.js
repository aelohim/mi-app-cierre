export const filtrarPorTurnoActual = (transferencias, fecha, turno) => {
  return transferencias.filter(t => t.fecha === fecha && t.turno === turno);
};
/*
export const calcularTotal = (transferencias) => {
  return transferencias.reduce((sum, t) => sum + Number(t.monto), 0);
};
*/
export const calcularTotal = (transferencias = []) => {
  // Protección 1: si no es array o es undefined/null → devuelve 0
  if (!Array.isArray(transferencias)) {
    return 0;
  }

  return transferencias.reduce((sum, t) => {
    // Protección 2: convierte monto, pero si falla → usa 0
    const monto = Number(t?.monto ?? 0);
    
    // Si no es un número válido, suma 0 en vez de NaN
    return sum + (isNaN(monto) ? 0 : monto);
  }, 0);
};
export const validarTransferencia = (t) => {
  if (!t.monto || t.monto <= 0) {
    throw new Error('El monto debe ser mayor a 0');
  }
};