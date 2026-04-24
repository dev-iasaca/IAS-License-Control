import { supabase } from './supabase';

export type Position = {
  no: number;
  code: string;
  group: string;
  position: string;
};

export type NewPosition = Omit<Position, 'no'>;

export async function fetchPositions(): Promise<Position[]> {
  const { data, error } = await supabase
    .from('positions')
    .select('id, code, group_name, position_title')
    .order('code', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row, idx) => ({
    no: idx + 1,
    code: row.code ?? '',
    group: row.group_name ?? '',
    position: row.position_title ?? '',
  }));
}

export async function insertPosition(input: NewPosition, nextNo: number): Promise<Position> {
  const { error } = await supabase.from('positions').insert({
    code: input.code,
    group_name: input.group,
    position_title: input.position,
  });
  if (error) throw new Error(error.message);
  return { no: nextNo, ...input };
}

export async function updatePosition(originalCode: string, input: NewPosition): Promise<void> {
  const { error } = await supabase
    .from('positions')
    .update({
      code: input.code,
      group_name: input.group,
      position_title: input.position,
    })
    .eq('code', originalCode);
  if (error) throw new Error(error.message);
}

export async function deletePosition(code: string): Promise<void> {
  const { data, error } = await supabase
    .from('positions')
    .delete()
    .eq('code', code)
    .select('id');
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) {
    throw new Error(
      `Position "${code}" tidak ditemukan atau tidak dapat dihapus (cek RLS).`,
    );
  }
}
