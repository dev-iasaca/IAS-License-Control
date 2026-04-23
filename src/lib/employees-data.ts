import { supabase } from './supabase';

export type Employee = {
  no: number;
  id: string;
  name: string;
  organization: string;
  position: string;
  area: string;
  type: string;
  previousNik?: string;
  directorateCode?: string;
  group?: string;
  groupCode?: string;
  divisionCode?: string;
  areaNomenklatur?: string;
  gender?: string;
  morst?: string;
  birthplace?: string;
  educationLevel?: string;
  universityName?: string;
  idCardNumber?: string;
  email?: string;
  phoneNumber?: string;
};

export type NewEmployee = Omit<Employee, 'no'>;

export async function fetchEmployees(): Promise<Employee[]> {
  const { data, error } = await supabase
    .from('employees')
    .select(
      'id, nik, name, organization, position, area, type, previous_nik, directorate_code, group_name, group_code, division_code, area_nomenklatur, gender, morst, birthplace, education_level, university_name, id_card_number, email, phone_number',
    )
    .order('id', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row, idx) => ({
    no: idx + 1,
    id: row.nik ?? '',
    name: row.name ?? '',
    organization: row.organization ?? '',
    position: row.position ?? '',
    area: row.area ?? '',
    type: row.type ?? '',
    previousNik: row.previous_nik ?? undefined,
    directorateCode: row.directorate_code ?? undefined,
    group: row.group_name ?? undefined,
    groupCode: row.group_code ?? undefined,
    divisionCode: row.division_code ?? undefined,
    areaNomenklatur: row.area_nomenklatur ?? undefined,
    gender: row.gender ?? undefined,
    morst: row.morst ?? undefined,
    birthplace: row.birthplace ?? undefined,
    educationLevel: row.education_level ?? undefined,
    universityName: row.university_name ?? undefined,
    idCardNumber: row.id_card_number ?? undefined,
    email: row.email ?? undefined,
    phoneNumber: row.phone_number ?? undefined,
  }));
}

export async function insertEmployee(input: NewEmployee, nextNo: number): Promise<Employee> {
  const { error } = await supabase.from('employees').insert({
    nik: input.id,
    name: input.name,
    organization: input.organization || null,
    position: input.position || null,
    area: input.area || null,
    type: input.type || null,
    group_name: input.group || null,
    gender: input.gender || null,
    email: input.email || null,
    phone_number: input.phoneNumber || null,
  });
  if (error) throw new Error(error.message);
  return { no: nextNo, ...input };
}

export async function updateEmployee(originalNik: string, input: NewEmployee): Promise<void> {
  const { error } = await supabase
    .from('employees')
    .update({
      nik: input.id,
      name: input.name,
      organization: input.organization || null,
      position: input.position || null,
      area: input.area || null,
      type: input.type || null,
      group_name: input.group || null,
      gender: input.gender || null,
      email: input.email || null,
      phone_number: input.phoneNumber || null,
    })
    .eq('nik', originalNik);
  if (error) throw new Error(error.message);
}

export async function deleteEmployee(nik: string): Promise<void> {
  const { error } = await supabase.from('employees').delete().eq('nik', nik);
  if (error) throw new Error(error.message);
}

export const EMPLOYEES: Employee[] = [
  {
    no: 1, id: '250461', name: 'Samiatul Asih',
    organization: 'PT Integrasi Aviasi Solusi',
    position: 'Branch Baggage Services Solution Cashier',
    area: 'Kantor Cabang SBU Logistics Baggage Services Solution Semarang',
    type: 'Kontrak',
    previousNik: '-',
    directorateCode: 'DR-00416',
    group: 'SBU Logistics Kantor Cabang Baggage Services Solution',
    groupCode: 'GR-17773',
    divisionCode: 'DV-09029',
    areaNomenklatur: 'SBULG-BSS-SRG',
    gender: 'Perempuan',
    morst: 'Lajang',
    birthplace: 'Tegal, 29-05-2001',
    educationLevel: '-',
    universityName: '-',
    idCardNumber: '3328086805010004',
    email: 'samiaasih@gmail.com',
    phoneNumber: '082243466112',
  },
  {
    no: 2, id: '250453', name: 'Muhammad Iqbal Qabrani Arsyad',
    organization: 'PT Integrasi Aviasi Solusi',
    position: 'Porter',
    area: 'Kantor Cabang SBU Cargo Services Batam',
    type: 'Kontrak',
    gender: 'Laki-laki', morst: 'Lajang',
    email: 'iqbal.qa@ias.co.id', phoneNumber: '081234567890',
  },
  {
    no: 3, id: '250450', name: 'Adellin Dwiny Conchita',
    organization: 'PT Integrasi Aviasi Solusi',
    position: 'Branch Baggage Services Solution Operation Officer',
    area: 'Kantor Cabang SBU Logistics Baggage Services Solution Manado',
    type: 'Kontrak',
    gender: 'Perempuan', morst: 'Lajang',
    email: 'adellin.dc@ias.co.id', phoneNumber: '082112345678',
  },
  {
    no: 4, id: '250449', name: 'Lalu Abiyu Aristawidyawan',
    organization: 'PT Integrasi Aviasi Solusi',
    position: 'Branch Air Express Administration Officer',
    area: 'Kantor Cabang SBU Logistics Air Express Lombok',
    type: 'Kontrak',
    gender: 'Laki-laki', morst: 'Lajang',
    email: 'lalu.aa@ias.co.id', phoneNumber: '081999887766',
  },
  {
    no: 5, id: '250448', name: 'Adrian Erico Febriansyah',
    organization: 'PT Integrasi Aviasi Solusi',
    position: 'Branch Air Express Operation Officer',
    area: 'Kantor Cabang SBU Logistics Air Express Surabaya',
    type: 'Kontrak',
    gender: 'Laki-laki', morst: 'Lajang',
    email: 'adrian.ef@ias.co.id', phoneNumber: '082233445566',
  },
];
