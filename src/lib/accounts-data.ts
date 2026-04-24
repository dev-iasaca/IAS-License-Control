import { supabase } from './supabase';

export type AccountStatus = 'Active' | 'Inactive' | 'Suspended';

export type Account = {
  no: number;
  username: string;
  nik: string;
  name: string;
  email: string;
  role: string;
  org: string;
  status: AccountStatus;
  lastLogin: string;
};

export type NewAccount = Omit<Account, 'no' | 'lastLogin'>;

type AccountRow = {
  id: number;
  username: string;
  nik: string | null;
  full_name: string | null;
  organization: string | null;
  email: string | null;
  role: string;
  status: AccountStatus;
  last_login_at: string | null;
};

function formatLastLogin(iso: string | null): string {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export async function fetchAccounts(): Promise<Account[]> {
  const { data, error } = await supabase
    .from('accounts')
    .select('id, username, nik, full_name, organization, email, role, status, last_login_at')
    .order('id', { ascending: true })
    .returns<AccountRow[]>();
  if (error) throw new Error(error.message);
  return (data ?? []).map((row, idx) => ({
    no: idx + 1,
    username: row.username,
    nik: row.nik ?? '',
    name: row.full_name ?? '',
    email: row.email ?? '',
    role: row.role,
    org: row.organization ?? '',
    status: row.status,
    lastLogin: formatLastLogin(row.last_login_at),
  }));
}

export async function insertAccount(input: NewAccount, nextNo: number): Promise<Account> {
  const { error } = await supabase.from('accounts').insert({
    username: input.username,
    nik: input.nik.trim() || null,
    full_name: input.name.trim() || null,
    organization: input.org.trim() || null,
    email: input.email || null,
    role: input.role,
    status: input.status,
  });
  if (error) throw new Error(error.message);

  return { no: nextNo, lastLogin: '-', ...input };
}

export async function updateAccount(originalUsername: string, input: NewAccount): Promise<void> {
  const { error } = await supabase
    .from('accounts')
    .update({
      username: input.username,
      nik: input.nik.trim() || null,
      full_name: input.name.trim() || null,
      organization: input.org.trim() || null,
      email: input.email || null,
      role: input.role,
      status: input.status,
    })
    .eq('username', originalUsername);
  if (error) throw new Error(error.message);
}

export async function deleteAccount(username: string): Promise<void> {
  const { data, error } = await supabase
    .from('accounts')
    .delete()
    .eq('username', username)
    .select('id');
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) {
    throw new Error(
      `Account "${username}" tidak ditemukan atau tidak dapat dihapus (cek RLS).`,
    );
  }
}

export const ACCOUNTS: Account[] = [
  { no: 1, username: 'aldhytya.n', nik: '250461', name: 'Aldhytya Nugraha', email: 'aldhytya.n@ias.co.id', role: 'Administrator', org: 'PT Integrasi Aviasi Solusi', status: 'Active', lastLogin: '23 Apr 2026, 09:14' },
  { no: 2, username: 'samiatul.a', nik: '250453', name: 'Samiatul Asih', email: 'samiatul.a@ias.co.id', role: 'HC Officer', org: 'PT Integrasi Aviasi Solusi', status: 'Active', lastLogin: '22 Apr 2026, 18:02' },
  { no: 3, username: 'iqbal.q', nik: '250450', name: 'Muhammad Iqbal Qabrani', email: 'iqbal.q@ias.co.id', role: 'Manager', org: 'PT Integrasi Aviasi Solusi', status: 'Inactive', lastLogin: '15 Apr 2026, 08:30' },
  { no: 4, username: 'adellin.d', nik: '250449', name: 'Adellin Dwiny Conchita', email: 'adellin.d@ias.co.id', role: 'Supervisor', org: 'PT Integrasi Aviasi Solusi', status: 'Active', lastLogin: '23 Apr 2026, 07:58' },
  { no: 5, username: 'lalu.a', nik: '250448', name: 'Lalu Abiyu Aristawidyawan', email: 'lalu.a@ias.co.id', role: 'Viewer', org: 'PT Integrasi Aviasi Solusi', status: 'Suspended', lastLogin: '01 Apr 2026, 10:21' },
];
