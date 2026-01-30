// src/api/transferenciasApi.ts

import { supabase } from '../lib/supabaseClient';

// Interfaces (mantenidas y adaptadas)
export interface Transferencia {
  id: string;  // Supabase usa UUID → string
  monto: number;
  nota?: string | null;
  fecha: string;
  turno: 'mañana' | 'tarde';
  created_at?: string | null;  // generado por Supabase
}

// Tipo para filtros
export type TransferenciasFiltros = Record<string, string | number>;

// Helper para manejar errores (adaptado a Supabase, que devuelve error objects)
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
export const getTransferencias = async (
  filtros: TransferenciasFiltros = {}
): Promise<Transferencia[]> => {
  let query = supabase
    .from('transferencias')
    .select('*')
    .order('created_at', { ascending: false });  // Optimización: más reciente primero

  // Aplicamos filtros (mantengo tu lógica)
  const params = new URLSearchParams(
    Object.entries(filtros).map(([key, value]) => [key, String(value)])
  );

  // Supabase usa .eq() para cada filtro
  params.forEach((value, key) => {
    query = query.eq(key, value);
  });

  const { data, error } = await query;

  return handleResponse(data, error);
};

// GET BY ID
export const getTransferenciaById = async (id: string): Promise<Transferencia> => {
  const { data, error } = await supabase
    .from('transferencias')
    .select('*')
    .eq('id', id)
    .single();  // Optimización: .single() para un registro

  return handleResponse(data, error);
};

// POST → Crear nueva transferencia
export const crearTransferencia = async (
  nuevaTransferencia: Omit<Transferencia, 'id' | 'created_at'>
): Promise<Transferencia> => {
  const { data, error } = await supabase
    .from('transferencias')
    .insert([nuevaTransferencia])
    .select()
    .single();

  return handleResponse(data, error);
};

// PUT → Actualizar transferencia (parcial con Partial)
export const actualizarTransferencia = async (
  id: string,
  datosActualizados: Partial<Omit<Transferencia, 'id' | 'created_at'>>
): Promise<Transferencia> => {
  const { data, error } = await supabase
    .from('transferencias')
    .update(datosActualizados)
    .eq('id', id)
    .select()
    .single();

  return handleResponse(data, error);
};

// DELETE
export const eliminarTransferenciaApi = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('transferencias')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message || 'Error al eliminar la transferencia');
  }
  return true;
};