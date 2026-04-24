import { supabase } from './supabase';

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

export type NewVendor = Omit<Vendor, 'no'>;

type VendorRow = {
  id: number;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  trainings: Array<{
    name: string;
    type: string | null;
    location: string | null;
    estimated_cost: string | null;
  }> | null;
};

export async function fetchVendors(): Promise<Vendor[]> {
  const { data, error } = await supabase
    .from('vendors')
    .select('id, name, address, phone, email, trainings:vendor_trainings(name, type, location, estimated_cost)')
    .order('id', { ascending: true })
    .returns<VendorRow[]>();
  if (error) throw new Error(error.message);
  return (data ?? []).map((row, idx) => ({
    no: idx + 1,
    name: row.name ?? '',
    address: row.address ?? '',
    phone: row.phone ?? '',
    email: row.email ?? '',
    trainings: (row.trainings ?? []).map((t) => ({
      name: t.name ?? '',
      type: t.type ?? '',
      location: t.location ?? '',
      estimatedCost: t.estimated_cost ?? '',
    })),
  }));
}

export async function insertVendor(input: NewVendor, nextNo: number): Promise<Vendor> {
  const { data: vendor, error } = await supabase
    .from('vendors')
    .insert({
      name: input.name,
      address: input.address || null,
      phone: input.phone || null,
      email: input.email || null,
    })
    .select('id')
    .single();
  if (error || !vendor) throw new Error(error?.message ?? 'Gagal menyimpan vendor.');

  if (input.trainings.length > 0) {
    const rows = input.trainings.map((t) => ({
      vendor_id: vendor.id,
      name: t.name,
      type: t.type || null,
      location: t.location || null,
      estimated_cost: t.estimatedCost || null,
    }));
    const { error: trErr } = await supabase.from('vendor_trainings').insert(rows);
    if (trErr) throw new Error(trErr.message);
  }

  return { no: nextNo, ...input };
}

export async function updateVendor(originalName: string, input: NewVendor): Promise<void> {
  const { data: existing, error: lookupErr } = await supabase
    .from('vendors')
    .select('id')
    .eq('name', originalName)
    .maybeSingle();
  if (lookupErr) throw new Error(lookupErr.message);
  if (!existing) throw new Error(`Vendor "${originalName}" tidak ditemukan di database.`);
  const vendorId = existing.id as number;

  const { error } = await supabase
    .from('vendors')
    .update({
      name: input.name,
      address: input.address || null,
      phone: input.phone || null,
      email: input.email || null,
    })
    .eq('id', vendorId);
  if (error) throw new Error(error.message);

  const { error: delErr } = await supabase
    .from('vendor_trainings')
    .delete()
    .eq('vendor_id', vendorId);
  if (delErr) throw new Error(delErr.message);

  if (input.trainings.length > 0) {
    const rows = input.trainings.map((t) => ({
      vendor_id: vendorId,
      name: t.name,
      type: t.type || null,
      location: t.location || null,
      estimated_cost: t.estimatedCost || null,
    }));
    const { error: trErr } = await supabase.from('vendor_trainings').insert(rows);
    if (trErr) throw new Error(trErr.message);
  }
}

export async function deleteVendor(name: string): Promise<void> {
  const { data, error } = await supabase
    .from('vendors')
    .delete()
    .eq('name', name)
    .select('id');
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) {
    throw new Error(
      `Vendor "${name}" tidak ditemukan atau tidak dapat dihapus (cek RLS).`,
    );
  }
}

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
