// src/api/deliverysApi.ts
import { supabase } from '../lib/supabaseClient';

// Interfaces (adaptadas)
export interface Delivery {
  id: string;
  monto: number;
  tipo: 'efectivo' | 'transferencia';
  lejano: boolean;
  direccion?: string | null;
  fecha: string;
  turno: 'mañana' | 'tarde';
  id_delivery: '1' | '2';
  created_at?: string | null;
}

// Tipo para filtros (mantengo tu Record)
export type DeliverysFiltros = Record<string, string | number>;

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
export const getDeliverys = async (
  filtros: DeliverysFiltros = {}
): Promise<Delivery[]> => {
  let query = supabase
    .from('deliverys')
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
export const getDeliveryById = async (id: string): Promise<Delivery> => {
  const { data, error } = await supabase
    .from('deliverys')
    .select('*')
    .eq('id', id)
    .single();

  return handleResponse(data, error);
};

// POST → Crear
export const crearDelivery = async (
  nuevoDelivery: Omit<Delivery, 'id' | 'created_at'>
): Promise<Delivery> => {
  const { data, error } = await supabase
    .from('deliverys')
    .insert([nuevoDelivery])
    .select()
    .single();

  return handleResponse(data, error);
};

// PUT → Actualizar
export const actualizarDelivery = async (
  id: string,
  datosActualizados: Partial<Omit<Delivery, 'id' | 'created_at'>>
): Promise<Delivery> => {
  const { data, error } = await supabase
    .from('deliverys')
    .update(datosActualizados)
    .eq('id', id)
    .select()
    .single();

  return handleResponse(data, error);
};

// DELETE
export const eliminarDeliveryApi = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('deliverys')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message || 'Error al eliminar el Delivery');
  }
  return true;
};