// src/api/pagosApi.ts

import { supabase } from '../lib/supabaseClient';

// Interfaces (adaptadas)
export interface Pago {
  id: string;
  monto: number;
  tipo: 'caja' | 'fuera';
  nota?: string | null;
  fecha: string;
  turno: 'mañana' | 'tarde';
  created_at?: string | null;
}

// Tipo para filtros (mantengo tu Record)
export type PagosFiltros = Record<string, string | number>;

// Helper para manejar errores (adaptado a Supabase)
const handleResponse = <T>(data: T | null, error: { message: string } | null): T => {
  if (error) {
    throw new Error(error.message || 'Error en Supabase');
  }
  if (!data) {
    throw new Error('No se recibieron datos');
  }
  return data;
};

// GET ALL con filtros opcionales
export const getPagos = async (
  filtros: PagosFiltros = {}
): Promise<Pago[]> => {
  let query = supabase
    .from('pagos')
    .select('*')
    .order('created_at', { ascending: false });

  // Aplicamos filtros
  const params = new URLSearchParams(
    Object.entries(filtros).map(([key, value]) => [key, String(value)])
  );

  params.forEach((value, key) => {
    query = query.eq(key, value);
  });

  const { data, error } = await query;

  return handleResponse(data, error);
};

// GET BY ID
export const getPagoById = async (id: string): Promise<Pago> => {
  const { data, error } = await supabase
    .from('pagos')
    .select('*')
    .eq('id', id)
    .single();

  return handleResponse(data, error);
};

// POST → Crear
export const crearPago = async (
  nuevaPago: Omit<Pago, 'id' | 'created_at'>
): Promise<Pago> => {
  const { data, error } = await supabase
    .from('pagos')
    .insert([nuevaPago])
    .select()
    .single();

  return handleResponse(data, error);
};

// PUT → Actualizar
export const actualizarPago = async (
  id: string,
  datosActualizados: Partial<Omit<Pago, 'id' | 'created_at'>>
): Promise<Pago> => {
  const { data, error } = await supabase
    .from('pagos')
    .update(datosActualizados)
    .eq('id', id)
    .select()
    .single();

  return handleResponse(data, error);
};

// DELETE
export const eliminarPagoApi = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('pagos')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message || 'Error al eliminar el pago');
  }
  return true;
};