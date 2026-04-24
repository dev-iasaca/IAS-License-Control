import { supabase } from './supabase';

export type Area = {
  no: number;
  code: string;
  name: string;
};

export type NewArea = Omit<Area, 'no'>;

export async function fetchAreas(): Promise<Area[]> {
  const { data, error } = await supabase
    .from('areas')
    .select('id, code, name')
    .order('code', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row, idx) => ({
    no: idx + 1,
    code: row.code ?? '',
    name: row.name ?? '',
  }));
}

export async function insertArea(input: NewArea, nextNo: number): Promise<Area> {
  const { error } = await supabase.from('areas').insert({
    code: input.code,
    name: input.name,
  });
  if (error) throw new Error(error.message);
  return { no: nextNo, ...input };
}

export async function updateArea(originalCode: string, input: NewArea): Promise<void> {
  const { error } = await supabase
    .from('areas')
    .update({
      code: input.code,
      name: input.name,
    })
    .eq('code', originalCode);
  if (error) throw new Error(error.message);
}

export async function deleteArea(code: string): Promise<void> {
  const { data, error } = await supabase
    .from('areas')
    .delete()
    .eq('code', code)
    .select('id');
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) {
    throw new Error(
      `Area "${code}" tidak ditemukan atau tidak dapat dihapus (cek RLS).`,
    );
  }
}
