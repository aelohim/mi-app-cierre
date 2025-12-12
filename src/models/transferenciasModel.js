export const filtrarPorTurnoActual = (transferencias, fecha, turno) => {
  return transferencias.filter(t => t.fecha === fecha && t.turno === turno);
};

export const calcularTotal = (transferencias) => {
  return transferencias.reduce((sum, t) => sum + Number(t.monto), 0);
};

export const validarTransferencia = (t) => {
  if (!t.monto || t.monto <= 0) {
    throw new Error('El monto debe ser mayor a 0');
  }
};