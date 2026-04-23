export type Training = {
  name: string;
  type: string;
  location: string;
  estimatedCost: string;
};

export type Vendor = {
  no: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  trainings: Training[];
};

export const VENDORS: Vendor[] = [
  {
    no: 1,
    name: 'PT Atma Jaya Training Center',
    address: 'Jl. Jenderal Sudirman No. 51, Jakarta Pusat',
    phone: '021-5708826',
    email: 'info@atmajaya-training.co.id',
    trainings: [
      { name: 'Advance Human Capital Accomplished (AHCA)', type: 'Sertifikasi', location: 'Jakarta', estimatedCost: 'Rp 15.000.000' },
      { name: 'Leadership Development Program', type: 'Workshop', location: 'Bandung', estimatedCost: 'Rp 8.500.000' },
      { name: 'Human Resource Business Partner', type: 'Bootcamp', location: 'Jakarta', estimatedCost: 'Rp 12.000.000' },
    ],
  },
  {
    no: 2,
    name: 'Badan Nasional Sertifikasi Profesi (BNSP)',
    address: 'Jl. MT Haryono Kav. 52, Jakarta Selatan',
    phone: '021-7901106',
    email: 'sekretariat@bnsp.go.id',
    trainings: [
      { name: 'Sertifikasi Kompetensi General Manager SDM', type: 'Sertifikasi', location: 'Jakarta', estimatedCost: 'Rp 6.500.000' },
      { name: 'Metodologi Instruktur', type: 'Sertifikasi', location: 'Jakarta', estimatedCost: 'Rp 4.000.000' },
      { name: 'Asesor Kompetensi', type: 'Sertifikasi', location: 'Online', estimatedCost: 'Rp 3.500.000' },
    ],
  },
  {
    no: 3,
    name: 'PT Mutiara Mutu Katiga',
    address: 'Jl. Gatot Subroto No. 88, Jakarta Selatan',
    phone: '021-5223344',
    email: 'contact@mutiaramutu.co.id',
    trainings: [
      { name: 'Quality Management System ISO 9001', type: 'Training', location: 'Jakarta', estimatedCost: 'Rp 7.000.000' },
      { name: 'Internal Auditor ISO 45001', type: 'Training', location: 'Surabaya', estimatedCost: 'Rp 5.500.000' },
    ],
  },
  {
    no: 4,
    name: 'Forum TJSL BUMN',
    address: 'Gedung BUMN Lt. 5, Jl. Medan Merdeka Selatan No. 13, Jakarta',
    phone: '021-2900788',
    email: 'sekretariat@forumtjslbumn.id',
    trainings: [
      { name: 'Certified Sustainability Reporting Specialist (CSRS)', type: 'Sertifikasi', location: 'Jakarta', estimatedCost: 'Rp 9.500.000' },
      { name: 'ESG Implementation Workshop', type: 'Workshop', location: 'Bali', estimatedCost: 'Rp 11.000.000' },
    ],
  },
  {
    no: 5,
    name: 'Kementerian Ketenagakerjaan RI',
    address: 'Jl. Jenderal Gatot Subroto Kav. 51, Jakarta Selatan',
    phone: '021-5255733',
    email: 'humas@kemnaker.go.id',
    trainings: [
      { name: 'Ahli K3 Umum', type: 'Sertifikasi', location: 'Jakarta', estimatedCost: 'Rp 6.000.000' },
      { name: 'Pengawas Ketenagakerjaan', type: 'Training', location: 'Jakarta', estimatedCost: 'Rp 4.500.000' },
    ],
  },
  {
    no: 6,
    name: 'PT Garuda Aviation Training',
    address: 'Soekarno-Hatta Airport Area, Tangerang',
    phone: '021-5591234',
    email: 'training@garuda-aviation.co.id',
    trainings: [
      { name: 'Airside Safety Awareness', type: 'Training', location: 'Tangerang', estimatedCost: 'Rp 3.500.000' },
      { name: 'Regulated Agent Internal Quality Control', type: 'Workshop', location: 'Tangerang', estimatedCost: 'Rp 5.000.000' },
      { name: 'Dangerous Goods Regulation', type: 'Sertifikasi', location: 'Tangerang', estimatedCost: 'Rp 6.500.000' },
    ],
  },
  {
    no: 7,
    name: 'PT Sertifikasi Kompetensi Indonesia',
    address: 'Jl. Thamrin No. 10, Jakarta Pusat',
    phone: '021-3904567',
    email: 'cs@sertifikasi-id.co.id',
    trainings: [
      { name: 'Supply Chain Management Professional', type: 'Sertifikasi', location: 'Jakarta', estimatedCost: 'Rp 8.000.000' },
      { name: 'Project Management Professional (PMP)', type: 'Sertifikasi', location: 'Online', estimatedCost: 'Rp 14.000.000' },
    ],
  },
];
