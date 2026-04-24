import { supabase } from './supabase';

export type Employee = {
  no: number;
  id: string;
  name: string;
  organization: string;
  position: string;
  area: string;
  type: string;
  status: 'Aktif' | 'Non Aktif';
  group?: string;
  gender?: string;
  email?: string;
  phoneNumber?: string;
};

export type NewEmployee = Omit<Employee, 'no'>;

let supportsEmployeeStatusColumn: boolean | null = null;

type EmployeeRow = {
  nik: string | null;
  name: string | null;
  organization: string | null;
  position: string | null;
  area: string | null;
  type: string | null;
  status?: string | null;
  group_name: string | null;
  gender: string | null;
  email: string | null;
  phone_number: string | null;
};

async function fetchEmployeesBase(
  includeStatus: boolean,
): Promise<{ data: EmployeeRow[] | null; error: { message: string } | null }> {
  const selectColumns = includeStatus
    ? 'id, nik, name, organization, position, area, type, status, group_name, gender, email, phone_number'
    : 'id, nik, name, organization, position, area, type, group_name, gender, email, phone_number';
  const result = await (supabase as any)
    .from('employees')
    .select(selectColumns)
    .order('id', { ascending: true });
  return {
    data: (result.data ?? null) as EmployeeRow[] | null,
    error: result.error ? { message: String(result.error.message ?? result.error) } : null,
  };
}

function isMissingStatusColumnError(err: unknown): boolean {
  if (!err) return false;
  const msg =
    err instanceof Error
      ? err.message
      : typeof err === 'object' && err !== null && 'message' in err
      ? String((err as { message: unknown }).message ?? '')
      : String(err);
  return msg.toLowerCase().includes('column employees.status does not exist');
}

export async function fetchEmployees(): Promise<Employee[]> {
  let data: EmployeeRow[] | null = null;
  let error: { message: string } | null = null;

  if (supportsEmployeeStatusColumn === false) {
    ({ data, error } = await fetchEmployeesBase(false));
  } else {
    ({ data, error } = await fetchEmployeesBase(true));
    if (error && isMissingStatusColumnError(error)) {
      supportsEmployeeStatusColumn = false;
      ({ data, error } = await fetchEmployeesBase(false));
    } else if (!error) {
      supportsEmployeeStatusColumn = true;
    }
  }

  if (error) throw new Error(error.message);
  return (data ?? []).map((row, idx) => ({
    no: idx + 1,
    id: row.nik ?? '',
    name: row.name ?? '',
    organization: row.organization ?? '',
    position: row.position ?? '',
    area: row.area ?? '',
    type: row.type ?? '',
    status: row.status === 'Non Aktif' ? 'Non Aktif' : 'Aktif',
    group: row.group_name ?? undefined,
    gender: row.gender ?? undefined,
    email: row.email ?? undefined,
    phoneNumber: row.phone_number ?? undefined,
  }));
}

async function lookupPositionId(title: string | undefined | null): Promise<number | null> {
  if (!title || !title.trim()) return null;
  const { data, error } = await supabase
    .from('positions')
    .select('id')
    .eq('position_title', title)
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return (data as { id: number }).id;
}

export async function insertEmployee(input: NewEmployee, nextNo: number): Promise<Employee> {
  const positionId = await lookupPositionId(input.position);
  const payload = {
    nik: input.id,
    name: input.name,
    organization: input.organization || null,
    position: input.position || null,
    position_id: positionId,
    area: input.area || null,
    type: input.type || null,
    group_name: input.group || null,
    gender: input.gender || null,
    email: input.email || null,
    phone_number: input.phoneNumber || null,
  };
  let error;
  if (supportsEmployeeStatusColumn === false) {
    ({ error } = await supabase.from('employees').insert(payload));
  } else {
    ({ error } = await supabase.from('employees').insert({ ...payload, status: input.status || 'Aktif' }));
    if (error && isMissingStatusColumnError(error)) {
      supportsEmployeeStatusColumn = false;
      ({ error } = await supabase.from('employees').insert(payload));
    } else if (!error) {
      supportsEmployeeStatusColumn = true;
    }
  }
  if (error) throw new Error(error.message);
  return { no: nextNo, ...input, status: input.status || 'Aktif' };
}

export async function updateEmployee(originalNik: string, input: NewEmployee): Promise<void> {
  const positionId = await lookupPositionId(input.position);
  const payload = {
    nik: input.id,
    name: input.name,
    organization: input.organization || null,
    position: input.position || null,
    position_id: positionId,
    area: input.area || null,
    type: input.type || null,
    group_name: input.group || null,
    gender: input.gender || null,
    email: input.email || null,
    phone_number: input.phoneNumber || null,
  };
  let error;
  if (supportsEmployeeStatusColumn === false) {
    ({ error } = await supabase
      .from('employees')
      .update(payload)
      .eq('nik', originalNik));
  } else {
    ({ error } = await supabase
      .from('employees')
      .update({ ...payload, status: input.status || 'Aktif' })
      .eq('nik', originalNik));
    if (error && isMissingStatusColumnError(error)) {
      supportsEmployeeStatusColumn = false;
      ({ error } = await supabase
        .from('employees')
        .update(payload)
        .eq('nik', originalNik));
    } else if (!error) {
      supportsEmployeeStatusColumn = true;
    }
  }
  if (error) throw new Error(error.message);
}

export async function deleteEmployee(nik: string): Promise<void> {
  const { data, error } = await supabase
    .from('employees')
    .delete()
    .eq('nik', nik)
    .select('id');
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) {
    throw new Error(
      `Employee dengan NIK "${nik}" tidak ditemukan atau tidak dapat dihapus (cek RLS / foreign key).`,
    );
  }
}

export const EMPLOYEES: Employee[] = [
  {
    no: 1, id: '250461', name: 'Samiatul Asih',
    organization: 'PT Integrasi Aviasi Solusi',
    position: 'Branch Baggage Services Solution Cashier',
    area: 'Kantor Cabang SBU Logistics Baggage Services Solution Semarang',
    type: 'Kontrak',
    status: 'Aktif',
    group: 'SBU Logistics Kantor Cabang Baggage Services Solution',
    gender: 'Perempuan',
    email: 'samiaasih@gmail.com',
    phoneNumber: '082243466112',
  },
  {
    no: 2, id: '250453', name: 'Muhammad Iqbal Qabrani Arsyad',
    organization: 'PT Integrasi Aviasi Solusi',
    position: 'Porter',
    area: 'Kantor Cabang SBU Cargo Services Batam',
    type: 'Kontrak',
    status: 'Aktif',
    gender: 'Laki-laki',
    email: 'iqbal.qa@ias.co.id', phoneNumber: '081234567890',
  },
  {
    no: 3, id: '250450', name: 'Adellin Dwiny Conchita',
    organization: 'PT Integrasi Aviasi Solusi',
    position: 'Branch Baggage Services Solution Operation Officer',
    area: 'Kantor Cabang SBU Logistics Baggage Services Solution Manado',
    type: 'Kontrak',
    status: 'Aktif',
    gender: 'Perempuan',
    email: 'adellin.dc@ias.co.id', phoneNumber: '082112345678',
  },
  {
    no: 4, id: '250449', name: 'Lalu Abiyu Aristawidyawan',
    organization: 'PT Integrasi Aviasi Solusi',
    position: 'Branch Air Express Administration Officer',
    area: 'Kantor Cabang SBU Logistics Air Express Lombok',
    type: 'Kontrak',
    status: 'Aktif',
    gender: 'Laki-laki',
    email: 'lalu.aa@ias.co.id', phoneNumber: '081999887766',
  },
  {
    no: 5, id: '250448', name: 'Adrian Erico Febriansyah',
    organization: 'PT Integrasi Aviasi Solusi',
    position: 'Branch Air Express Operation Officer',
    area: 'Kantor Cabang SBU Logistics Air Express Surabaya',
    type: 'Kontrak',
    status: 'Aktif',
    gender: 'Laki-laki',
    email: 'adrian.ef@ias.co.id', phoneNumber: '082233445566',
  },
];
