import type { AccentColor } from '../components/shared';

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
};

export const EXPIRING_LICENSES: ExpiringLicense[] = [
  { no: 1, nik: '124860490', name: 'Radite Aranditya Hermanus', licenseName: 'Sertifikat Kompetensi General Manager SDM', instansi: 'BNSP', startDate: '11 November 2024', endDate: '10 November 2026', monthsRemaining: 7, status: 'Aktif', organization: 'PT Integrasi Aviasi Solusi' },
  { no: 2, nik: '124900596', name: 'Antin Putri Permatasari', licenseName: 'Metodologi Instruktur', instansi: 'BNSP', startDate: '18 Agustus 2022', endDate: '18 Agustus 2026', monthsRemaining: 4, status: 'Pengajuan', organization: 'PT Integrasi Aviasi Solusi' },
  { no: 3, nik: '124700019', name: 'Udi Suprianto', licenseName: 'Advance Human Capital Accomplished (AHCA)', instansi: 'Atma Jaya', startDate: '19 Januari 2025', endDate: '26 Juni 2026', monthsRemaining: 2, status: 'Proses', organization: 'PT Integrasi Aviasi Solusi' },
  { no: 4, nik: '124740078', name: 'Luh Putu Eka Aryani', licenseName: 'Certified Sustainability Reporting Specialist (CSRS)', instansi: 'Forum TJSL BUMN', startDate: '20 Mei 2025', endDate: '22 Mei 2026', monthsRemaining: 1, status: 'Proses License', organization: 'PT Integrasi Aviasi Solusi' },
  { no: 5, nik: '124750815', name: 'Maralaut Harahap', licenseName: 'Airside Safety Awareness', instansi: 'PT Garuda Aviation Training', startDate: '05 Desember 2023', endDate: '05 Desember 2026', monthsRemaining: 8, status: 'Aktif', organization: 'PT Integrasi Aviasi Solusi' },
  { no: 6, nik: '124830301', name: 'Yullanus Kantetana', licenseName: 'Supply Chain Management Professional', instansi: 'PT Sertifikasi Kompetensi Indonesia', startDate: '07 Januari 2024', endDate: '07 Juli 2026', monthsRemaining: 3, status: 'Pengajuan', organization: 'PT Integrasi Aviasi Solusi' },
  { no: 7, nik: '124860490', name: 'Radite Aranditya Hermanus', licenseName: 'Advanced Human Capital Accomplished (AHCA)', instansi: 'Atma Jaya', startDate: '19 Januari 2025', endDate: '15 Mei 2026', monthsRemaining: 1, status: 'Proses', organization: 'PT Integrasi Aviasi Solusi' },
  { no: 8, nik: '124750815', name: 'Maralaut Harahap', licenseName: 'Regulated Agent Internal Quality Control', instansi: 'PT Garuda Aviation Training', startDate: '09 Januari 2024', endDate: '09 Januari 2027', monthsRemaining: 9, status: 'Aktif', organization: 'PT Integrasi Aviasi Solusi' },
  { no: 9, nik: '124700019', name: 'Udi Suprianto', licenseName: 'Leadership Development Program', instansi: 'PT Atma Jaya Training Center', startDate: '12 Maret 2025', endDate: '12 Mei 2026', monthsRemaining: 1, status: 'Proses License', organization: 'PT Integrasi Aviasi Solusi' },
  { no: 10, nik: '124740078', name: 'Luh Putu Eka Aryani', licenseName: 'Ahli K3 Umum', instansi: 'Kementerian Ketenagakerjaan RI', startDate: '15 Juni 2023', endDate: '15 Juni 2026', monthsRemaining: 2, status: 'Proses', organization: 'PT Integrasi Aviasi Solusi' },
  { no: 11, nik: '124830301', name: 'Yullanus Kantetana', licenseName: 'Project Management Professional (PMP)', instansi: 'PT Sertifikasi Kompetensi Indonesia', startDate: '20 Februari 2024', endDate: '20 Agustus 2026', monthsRemaining: 4, status: 'Pengajuan', organization: 'PT Integrasi Aviasi Solusi' },
  { no: 12, nik: '124900596', name: 'Antin Putri Permatasari', licenseName: 'Asesor Kompetensi', instansi: 'BNSP', startDate: '05 Mei 2024', endDate: '05 Mei 2027', monthsRemaining: 12, status: 'Aktif', organization: 'PT Integrasi Aviasi Solusi' },
];

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
