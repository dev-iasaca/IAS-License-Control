import { supabase } from './supabase';

export type JobFamily = {
  no: number;
  id: number;
  code: string;
  name: string;
  nameAlign: string;
};

export type NewJobFamily = Omit<JobFamily, 'no' | 'id'>;

export async function fetchJobFamilies(): Promise<JobFamily[]> {
  const { data, error } = await supabase
    .from('job_families')
    .select('id, code, name, name_align')
    .order('code', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row, idx) => ({
    no: idx + 1,
    id: (row.id as number) ?? 0,
    code: row.code ?? '',
    name: row.name ?? '',
    nameAlign: row.name_align ?? '',
  }));
}

export async function insertJobFamily(input: NewJobFamily, nextNo: number): Promise<JobFamily> {
  const { error } = await supabase.from('job_families').insert({
    code: input.code,
    name: input.name,
    name_align: input.nameAlign,
  });
  if (error) throw new Error(error.message);
  return { no: nextNo, ...input };
}

export async function updateJobFamily(originalCode: string, input: NewJobFamily): Promise<void> {
  const { error } = await supabase
    .from('job_families')
    .update({
      code: input.code,
      name: input.name,
      name_align: input.nameAlign,
    })
    .eq('code', originalCode);
  if (error) throw new Error(error.message);
}

export async function deleteJobFamily(code: string): Promise<void> {
  const { data, error } = await supabase
    .from('job_families')
    .delete()
    .eq('code', code)
    .select('id');
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) {
    throw new Error(
      `Job Family "${code}" tidak ditemukan atau tidak dapat dihapus (cek RLS).`,
    );
  }
}

export const JOB_FAMILIES: JobFamily[] = [
  { no: 1, id: 1, code: 'JFM-00416', name: 'Airport Engineering', nameAlign: 'Airport Engineering' },
  { no: 2, id: 2, code: 'JFM-00417', name: 'Airport Operation', nameAlign: 'Airport Operation' },
  { no: 3, id: 3, code: 'JFM-00418', name: 'Asset Management', nameAlign: 'Asset Management' },
  { no: 4, id: 4, code: 'JFM-00419', name: 'Audit, Legal & Compliance', nameAlign: 'Audit, Legal, and Compliance' },
  { no: 5, id: 5, code: 'JFM-00420', name: 'Business Development', nameAlign: 'Business Development' },
  { no: 6, id: 6, code: 'JFM-00421', name: 'Corporate Communication', nameAlign: 'Corporate Relation and Communication' },
  { no: 7, id: 7, code: 'JFM-00422', name: 'Customer Service Management', nameAlign: 'Customer Service Management' },
  { no: 8, id: 8, code: 'JFM-00423', name: 'Finance & Accounting', nameAlign: 'Finance and Accounting' },
  { no: 9, id: 9, code: 'JFM-00424', name: 'Human Capital', nameAlign: 'People Management' },
  { no: 10, id: 10, code: 'JFM-00425', name: 'Information Technology', nameAlign: 'Information Technology' },
  { no: 11, id: 11, code: 'JFM-00426', name: 'Procurement', nameAlign: 'Procurement' },
  { no: 12, id: 12, code: 'JFM-00427', name: 'Quality, Safety & Security', nameAlign: 'Quality, Safety and Security' },
  { no: 13, id: 13, code: 'JFM-00428', name: 'Supply Chain Management', nameAlign: 'Supply Chain Management' },
];
