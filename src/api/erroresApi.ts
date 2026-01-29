// src/api/erroresApi.ts

import { supabase } from '../lib/supabaseClient';

// Interfaces (adaptadas)
export interface ErrorItem {
  id: string;
  monto: number;
  motivo?: string | null;
  fecha: string;
  turno: 'mañana' | 'tarde';
  created_at?: string | null;
}

// Tipo para filtros (mantengo tu Record)
export type ErroresFiltros = Record<string, string | number>;

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
export const getErroresItems = async (
  filtros: ErroresFiltros = {}
): Promise<ErrorItem[]> => {
  let query = supabase
    .from('errores')
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
export const getErrorItemById = async (id: string): Promise<ErrorItem> => {
  const { data, error } = await supabase
    .from('errores')
    .select('*')
    .eq('id', id)
    .single();

  return handleResponse(data, error);
};

// POST → Crear
export const crearErrorItem = async (
  nuevaErrorItem: Omit<ErrorItem, 'id' | 'created_at'>
): Promise<ErrorItem> => {
  const { data, error } = await supabase
    .from('errores')
    .insert([nuevaErrorItem])
    .select()
    .single();

  return handleResponse(data, error);
};

// PUT → Actualizar
export const actualizarErrorItem = async (
  id: string,
  datosActualizados: Partial<Omit<ErrorItem, 'id' | 'created_at'>>
): Promise<ErrorItem> => {
  const { data, error } = await supabase
    .from('errores')
    .update(datosActualizados)
    .eq('id', id)
    .select()
    .single();

  return handleResponse(data, error);
};

// DELETE
export const eliminarErrorItemApi = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('errores')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message || 'Error al eliminar el errorItem');
  }
  return true;
};