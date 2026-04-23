import type { AccentColor } from '../components/shared';
import { supabase } from './supabase';

export type LicenseStatus = 'Pengajuan' | 'Proses' | 'Proses License' | 'Aktif';

export const LICENSE_STATUSES: LicenseStatus[] = [
  'Pengajuan',
  'Proses',
  'Proses License',
  'Aktif',
];

export const LICENSE_STATUS_COLOR: Record<LicenseStatus, AccentColor> = {
  Pengajuan: 'sky',
  Proses: 'amber',
  'Proses License': 'blue',
  Aktif: 'emerald',
};

export type ExpiringLicense = {
  id: number;
  no: number;
  nik: string;
  name: string;
  licenseName: string;
  instansi?: string;
  startDate: string;
  endDate: string;
  monthsRemaining: number;
  status: LicenseStatus;
  organization: string;
  position?: string;
  area?: string;
};

export function monthsBadgeColor(months: number): AccentColor {
  if (months <= 1) return 'rose';
  if (months <= 3) return 'amber';
  if (months <= 6) return 'sky';
  return 'emerald';
}

export function monthsLabel(months: number): string {
  if (months <= 0) return 'Sudah Habis';
  if (months === 1) return '1 Bulan';
  return `${months} Bulan`;
}

type AssignmentRow = {
  id: number;
  start_date: string | null;
  end_date: string | null;
  status: LicenseStatus;
  organization: string | null;
  employee: { nik: string | null; name: string | null; position: string | null; area: string | null } | null;
  license: { name: string | null; issuer: string | null } | null;
};

const ID_DATE = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

function formatDate(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return ID_DATE.format(d);
}

export function monthsUntil(iso: string | null, reference: Date = new Date()): number {
  if (!iso) return 0;
  const end = new Date(iso);
  if (Number.isNaN(end.getTime())) return 0;
  const ms = end.getTime() - reference.getTime();
  if (ms <= 0) return 0;
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24 * 30.4375)));
}

export async function fetchExpiringLicenses(): Promise<ExpiringLicense[]> {
  const { data, error } = await supabase
    .from('license_assignments')
    .select(
      'id, start_date, end_date, status, organization, employee:employees(nik, name, position, area), license:licenses(name, issuer)',
    )
    .order('end_date', { ascending: true, nullsFirst: false })
    .returns<AssignmentRow[]>();
  if (error) throw new Error(error.message);

  // Fallback lookup for position/area by NIK to avoid empty aggregates
  // when nested relation does not return those fields consistently.
  const niks = Array.from(
    new Set(
      (data ?? [])
        .map((row) => row.employee?.nik?.trim())
        .filter((v): v is string => Boolean(v)),
    ),
  );

  const employeeMeta = new Map<string, { position: string | null; area: string | null }>();
  if (niks.length > 0) {
    const { data: empData, error: empErr } = await supabase
      .from('employees')
      .select('nik, position, area')
      .in('nik', niks)
      .returns<Array<{ nik: string; position: string | null; area: string | null }>>();
    if (empErr) throw new Error(empErr.message);
    for (const emp of empData ?? []) {
      employeeMeta.set(emp.nik, { position: emp.position, area: emp.area });
    }
  }

  const now = new Date();
  return (data ?? []).map((row, idx) => ({
    ...(() => {
      const nik = row.employee?.nik ?? '';
      const meta = nik ? employeeMeta.get(nik) : undefined;
      return {
        nik,
        position: row.employee?.position ?? meta?.position ?? undefined,
        area: row.employee?.area ?? meta?.area ?? row.organization ?? undefined,
      };
    })(),
    id: row.id,
    no: idx + 1,
    name: row.employee?.name ?? '',
    licenseName: row.license?.name ?? '',
    instansi: row.license?.issuer ?? undefined,
    startDate: formatDate(row.start_date),
    endDate: formatDate(row.end_date),
    monthsRemaining: monthsUntil(row.end_date, now),
    status: row.status,
    organization: row.organization ?? '',
  }));
}

export async function updateAssignmentStatus(id: number, status: LicenseStatus): Promise<void> {
  const { error } = await supabase
    .from('license_assignments')
    .update({ status })
    .eq('id', id);
  if (error) throw new Error(error.message);
}
