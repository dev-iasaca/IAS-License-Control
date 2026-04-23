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

export const ACCOUNTS: Account[] = [
  { no: 1, username: 'aldhytya.n', nik: '250461', name: 'Aldhytya Nugraha', email: 'aldhytya.n@ias.co.id', role: 'Administrator', org: 'PT Integrasi Aviasi Solusi', status: 'Active', lastLogin: '23 Apr 2026, 09:14' },
  { no: 2, username: 'samiatul.a', nik: '250453', name: 'Samiatul Asih', email: 'samiatul.a@ias.co.id', role: 'HC Officer', org: 'PT Integrasi Aviasi Solusi', status: 'Active', lastLogin: '22 Apr 2026, 18:02' },
  { no: 3, username: 'iqbal.q', nik: '250450', name: 'Muhammad Iqbal Qabrani', email: 'iqbal.q@ias.co.id', role: 'Manager', org: 'PT Integrasi Aviasi Solusi', status: 'Inactive', lastLogin: '15 Apr 2026, 08:30' },
  { no: 4, username: 'adellin.d', nik: '250449', name: 'Adellin Dwiny Conchita', email: 'adellin.d@ias.co.id', role: 'Supervisor', org: 'PT Integrasi Aviasi Solusi', status: 'Active', lastLogin: '23 Apr 2026, 07:58' },
  { no: 5, username: 'lalu.a', nik: '250448', name: 'Lalu Abiyu Aristawidyawan', email: 'lalu.a@ias.co.id', role: 'Viewer', org: 'PT Integrasi Aviasi Solusi', status: 'Suspended', lastLogin: '01 Apr 2026, 10:21' },
];
