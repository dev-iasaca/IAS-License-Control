export type Employee = {
  no: number;
  id: string;
  name: string;
  organization: string;
  position: string;
  area: string;
  grade: string;
  type: string;
  talentCluster: string;
  previousNik?: string;
  jobTitle?: string;
  directorate?: string;
  directorateCode?: string;
  group?: string;
  groupCode?: string;
  division?: string;
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
  lineManager?: string;
};

export const EMPLOYEES: Employee[] = [
  {
    no: 1, id: '250461', name: 'Samiatul Asih',
    organization: 'PT Integrasi Aviasi Solusi',
    position: 'Branch Baggage Services Solution Cashier',
    area: 'Kantor Cabang SBU Logistics Baggage Services Solution Semarang',
    grade: '-', type: 'Kontrak', talentCluster: 'Unfit (Talent Cluster 1)',
    previousNik: '-',
    jobTitle: 'FAJT',
    directorate: 'SBU Logistics',
    directorateCode: 'DR-00416',
    group: 'SBU Logistics Kantor Cabang Baggage Services Solution',
    groupCode: 'GR-17773',
    division: 'Branch Baggage Services Solution Semarang',
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
    lineManager: '-',
  },
  {
    no: 2, id: '250453', name: 'Muhammad Iqbal Qabrani Arsyad',
    organization: 'PT Integrasi Aviasi Solusi',
    position: 'Porter',
    area: 'Kantor Cabang SBU Cargo Services Batam',
    grade: '-', type: 'Kontrak', talentCluster: 'Unfit (Talent Cluster 1)',
    jobTitle: 'FAJT', directorate: 'SBU Cargo',
    gender: 'Laki-laki', morst: 'Lajang',
    email: 'iqbal.qa@ias.co.id', phoneNumber: '081234567890',
  },
  {
    no: 3, id: '250450', name: 'Adellin Dwiny Conchita',
    organization: 'PT Integrasi Aviasi Solusi',
    position: 'Branch Baggage Services Solution Operation Officer',
    area: 'Kantor Cabang SBU Logistics Baggage Services Solution Manado',
    grade: '8', type: 'Kontrak', talentCluster: 'Unfit (Talent Cluster 1)',
    jobTitle: 'FAJT', directorate: 'SBU Logistics',
    gender: 'Perempuan', morst: 'Lajang',
    email: 'adellin.dc@ias.co.id', phoneNumber: '082112345678',
  },
  {
    no: 4, id: '250449', name: 'Lalu Abiyu Aristawidyawan',
    organization: 'PT Integrasi Aviasi Solusi',
    position: 'Branch Air Express Administration Officer',
    area: 'Kantor Cabang SBU Logistics Air Express Lombok',
    grade: '-', type: 'Kontrak', talentCluster: 'Unfit (Talent Cluster 1)',
    jobTitle: 'FAJT', directorate: 'SBU Logistics',
    gender: 'Laki-laki', morst: 'Lajang',
    email: 'lalu.aa@ias.co.id', phoneNumber: '081999887766',
  },
  {
    no: 5, id: '250448', name: 'Adrian Erico Febriansyah',
    organization: 'PT Integrasi Aviasi Solusi',
    position: 'Branch Air Express Operation Officer',
    area: 'Kantor Cabang SBU Logistics Air Express Surabaya',
    grade: '7', type: 'Kontrak', talentCluster: 'Unfit (Talent Cluster 1)',
    jobTitle: 'FAJT', directorate: 'SBU Logistics',
    gender: 'Laki-laki', morst: 'Lajang',
    email: 'adrian.ef@ias.co.id', phoneNumber: '082233445566',
  },
];
