import { supabase } from './supabase';

export type License = {
  no: number;
  nik: string;
  name: string;
  licenseNumber?: string;
  licenseName: string;
  instansi?: string;
  startDate: string;
  endDate: string;
  negara?: string;
  jobFamily?: string;
  organization: string;
};

export type NewLicense = Omit<License, 'no'>;

type LicenseAssignmentRow = {
  id: number;
  license_number: string | null;
  start_date: string | null;
  end_date: string | null;
  organization: string | null;
  employee: { nik: string | null; name: string | null } | null;
  license: { name: string | null; issuer: string | null } | null;
};

export async function fetchLicenses(): Promise<License[]> {
  const { data, error } = await supabase
    .from('license_assignments')
    .select('id, license_number, start_date, end_date, organization, employee:employees(nik, name), license:licenses(name, issuer)')
    .order('id', { ascending: true })
    .returns<LicenseAssignmentRow[]>();
  if (error) throw new Error(error.message);
  return (data ?? []).map((row, idx) => ({
    no: idx + 1,
    nik: row.employee?.nik ?? '',
    name: row.employee?.name ?? '',
    licenseNumber: row.license_number ?? undefined,
    licenseName: row.license?.name ?? '',
    instansi: row.license?.issuer ?? undefined,
    startDate: row.start_date ?? '',
    endDate: row.end_date ?? '',
    organization: row.organization ?? '',
  }));
}

export async function fetchEmployeeNameByNik(nik: string): Promise<string | null> {
  const trimmed = nik.trim();
  if (!trimmed) return null;
  const { data, error } = await supabase
    .from('employees')
    .select('name')
    .eq('nik', trimmed)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data?.name ?? null;
}

export async function insertLicense(input: NewLicense, nextNo: number): Promise<License> {
  const nik = input.nik.trim();
  if (!nik) throw new Error('NIK wajib diisi.');

  const { data: emp, error: empErr } = await supabase
    .from('employees')
    .select('id')
    .eq('nik', nik)
    .maybeSingle();
  if (empErr) throw new Error(empErr.message);
  if (!emp) throw new Error(`Employee dengan NIK ${nik} tidak ditemukan.`);

  const licenseName = input.licenseName.trim();
  if (!licenseName) throw new Error('License Name wajib diisi.');

  let licenseId: number | null = null;
  const { data: existing, error: licErr } = await supabase
    .from('licenses')
    .select('id')
    .eq('name', licenseName)
    .maybeSingle();
  if (licErr) throw new Error(licErr.message);
  if (existing) {
    licenseId = existing.id as number;
  } else {
    const { data: created, error: createErr } = await supabase
      .from('licenses')
      .insert({ name: licenseName, issuer: input.instansi || null })
      .select('id')
      .single();
    if (createErr) throw new Error(createErr.message);
    licenseId = created.id as number;
  }

  const { error: assignErr } = await supabase.from('license_assignments').insert({
    employee_id: emp.id,
    license_id: licenseId,
    license_number: input.licenseNumber?.trim() || null,
    start_date: input.startDate || null,
    end_date: input.endDate || null,
    status: 'Pengajuan',
    organization: input.organization || null,
  });
  if (assignErr) throw new Error(assignErr.message);

  return { no: nextNo, ...input };
}

export async function updateLicense(original: License, input: NewLicense): Promise<void> {
  const origNik = original.nik.trim();
  const { data: origEmp, error: origEmpErr } = await supabase
    .from('employees')
    .select('id')
    .eq('nik', origNik)
    .maybeSingle();
  if (origEmpErr) throw new Error(origEmpErr.message);
  if (!origEmp) throw new Error(`Employee asli dengan NIK ${origNik} tidak ditemukan.`);

  const { data: origLic, error: origLicErr } = await supabase
    .from('licenses')
    .select('id')
    .eq('name', original.licenseName)
    .maybeSingle();
  if (origLicErr) throw new Error(origLicErr.message);
  if (!origLic) throw new Error(`License "${original.licenseName}" tidak ditemukan.`);

  const { data: origAssign, error: origAssignErr } = await supabase
    .from('license_assignments')
    .select('id')
    .eq('employee_id', origEmp.id)
    .eq('license_id', origLic.id)
    .maybeSingle();
  if (origAssignErr) throw new Error(origAssignErr.message);
  if (!origAssign) throw new Error(`Assignment untuk ${original.name} — ${original.licenseName} tidak ditemukan.`);

  const newNik = input.nik.trim();
  if (!newNik) throw new Error('NIK wajib diisi.');
  const { data: newEmp, error: newEmpErr } = await supabase
    .from('employees')
    .select('id')
    .eq('nik', newNik)
    .maybeSingle();
  if (newEmpErr) throw new Error(newEmpErr.message);
  if (!newEmp) throw new Error(`Employee dengan NIK ${newNik} tidak ditemukan.`);

  const newLicName = input.licenseName.trim();
  if (!newLicName) throw new Error('License Name wajib diisi.');
  let newLicenseId: number = origLic.id as number;
  if (newLicName !== original.licenseName) {
    const { data: found, error: findErr } = await supabase
      .from('licenses')
      .select('id')
      .eq('name', newLicName)
      .maybeSingle();
    if (findErr) throw new Error(findErr.message);
    if (found) {
      newLicenseId = found.id as number;
    } else {
      const { data: created, error: createErr } = await supabase
        .from('licenses')
        .insert({ name: newLicName, issuer: input.instansi || null })
        .select('id')
        .single();
      if (createErr || !created) throw new Error(createErr?.message ?? 'Gagal menyimpan license baru.');
      newLicenseId = created.id as number;
    }
  } else if (input.instansi && input.instansi !== original.instansi) {
    const { error: issuerErr } = await supabase
      .from('licenses')
      .update({ issuer: input.instansi })
      .eq('id', origLic.id);
    if (issuerErr) throw new Error(issuerErr.message);
  }

  const { error: updErr } = await supabase
    .from('license_assignments')
    .update({
      employee_id: newEmp.id,
      license_id: newLicenseId,
      license_number: input.licenseNumber?.trim() || null,
      start_date: input.startDate || null,
      end_date: input.endDate || null,
      organization: input.organization || null,
    })
    .eq('id', origAssign.id);
  if (updErr) throw new Error(updErr.message);
}

export async function deleteLicense(target: License): Promise<void> {
  const nik = target.nik.trim();
  const { data: emp, error: empErr } = await supabase
    .from('employees')
    .select('id')
    .eq('nik', nik)
    .maybeSingle();
  if (empErr) throw new Error(empErr.message);
  if (!emp) throw new Error(`Employee dengan NIK ${nik} tidak ditemukan.`);

  const { data: lic, error: licErr } = await supabase
    .from('licenses')
    .select('id')
    .eq('name', target.licenseName)
    .maybeSingle();
  if (licErr) throw new Error(licErr.message);
  if (!lic) throw new Error(`License "${target.licenseName}" tidak ditemukan.`);

  const { data: delData, error: delErr } = await supabase
    .from('license_assignments')
    .delete()
    .eq('employee_id', emp.id)
    .eq('license_id', lic.id)
    .select('id');
  if (delErr) throw new Error(delErr.message);
  if (!delData || delData.length === 0) {
    throw new Error(
      `Assignment untuk NIK ${nik} / license "${target.licenseName}" tidak ditemukan atau tidak dapat dihapus (cek RLS).`,
    );
  }
}

export const LICENSES: License[] = [
  { no: 1, nik: '124700019', name: 'Udi Suprianto', licenseName: 'ADVANCE HUMAN CAPITAL ACCOMPLISHED (AHCA)', instansi: 'ATMA JAYA', startDate: '19 Januari 2025', endDate: '26 Februari 2025', negara: 'INDONESIA', jobFamily: 'People Management', organization: 'PT Integrasi Aviasi Solusi' },
  { no: 2, nik: '124830301', name: 'Yullanus Kantetana', licenseName: 'Supply Chain Management', startDate: '07 Januari 2013', endDate: '07 Januari 2013', jobFamily: 'SC', organization: 'PT Integrasi Aviasi Solusi' },
  { no: 3, nik: '124860490', name: 'Radite Aranditya Hermanus', licenseName: 'Sertifikat Kompetensi General Manager SDM', instansi: 'BNSP', startDate: '11 November 2024', endDate: '10 November 2027', negara: 'Indonesia', jobFamily: 'JF-03034', organization: 'PT Integrasi Aviasi Solusi' },
  { no: 4, nik: '124860490', name: 'Radite Aranditya Hermanus', licenseName: 'Advanced Human Capital Accomplished (AHCA)', instansi: 'Atma Jaya', startDate: '19 Januari 2025', endDate: '15 Maret 2025', negara: 'Indonesia', jobFamily: 'JF-03034', organization: 'PT Integrasi Aviasi Solusi' },
  { no: 5, nik: '124900596', name: 'Antin Putri Permatasari', licenseName: 'Metodologi Instruktur', instansi: 'BNSP', startDate: '18 Agustus 2022', endDate: '18 Agustus 2025', negara: 'Indonesia', jobFamily: 'Customer Service Management', organization: 'PT Integrasi Aviasi Solusi' },
  { no: 6, nik: '124740078', name: 'Luh Putu Eka Aryani', licenseName: 'Certified Sustainability Reporting Specialist (CSRS)', instansi: 'FORUM TJSL BUMN', startDate: '20 Mei 2025', endDate: '22 Mei 2025', negara: 'INDONESIA', jobFamily: 'Corporate Relation And Communication', organization: 'PT Integrasi Aviasi Solusi' },
  { no: 7, nik: '124750815', name: 'Maralaut Harahap', licenseName: 'Kementerian Ketenagakerjaan RI', startDate: '27 Desember 2017', endDate: '27 Desember 2017', jobFamily: 'QS', organization: 'PT Integrasi Aviasi Solusi' },
  { no: 8, nik: '124750815', name: 'Maralaut Harahap', licenseName: 'PT MUTIARA MUTU KATIGA', startDate: '28 November 2017', endDate: '26 November 2017', jobFamily: 'QS', organization: 'PT Integrasi Aviasi Solusi' },
  { no: 9, nik: '124750815', name: 'Maralaut Harahap', licenseName: 'REGULATED AGENT INTERNAL QUALITY CONTROL WORKSHOP', startDate: '09 Januari 2018', endDate: '09 Januari 2018', jobFamily: 'SC', organization: 'PT Integrasi Aviasi Solusi' },
  { no: 10, nik: '124750815', name: 'Maralaut Harahap', licenseName: 'AIRSIDE SAFETY AWARENESS', startDate: '05 Desember 2018', endDate: '05 Desember 2018', jobFamily: 'AC', organization: 'PT Integrasi Aviasi Solusi' },
];
