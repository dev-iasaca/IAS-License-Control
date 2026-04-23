export type License = {
  no: number;
  nik: string;
  name: string;
  licenseName: string;
  instansi?: string;
  startDate: string;
  endDate: string;
  negara?: string;
  jobFamily?: string;
  organization: string;
};

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
