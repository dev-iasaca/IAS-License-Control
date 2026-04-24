import { useEffect, useRef, useState } from 'react';
import Modal from './Modal';
import { fetchEmployeeNameByNik, insertLicense, updateLicense, type License } from '../lib/licenses-data';
import { fetchJobFamilies, type JobFamily } from '../lib/job-families-data';
import { fetchVendors, type Vendor } from '../lib/vendors-data';

type Props = {
  open: boolean;
  onClose: () => void;
  license: License | null;
  onSaved?: (item: License) => void;
  nextNo?: number;
};

const EMPTY_FORM = {
  nik: '',
  name: '',
  organization: 'PT Integrasi Aviasi Solusi',
  licenseNumber: '',
  licenseName: '',
  instansi: '',
  negara: '',
  jobFamily: '',
  startDate: '',
  endDate: '',
};

export default function LicenseEditModal({ open, onClose, license, onSaved, nextNo = 1 }: Props) {
  const isNew = license === null;
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nikLookup, setNikLookup] = useState<'idle' | 'loading' | 'found' | 'not-found'>('idle');
  const lookupTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [jobFamilies, setJobFamilies] = useState<JobFamily[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const [jf, vs] = await Promise.all([fetchJobFamilies(), fetchVendors()]);
        setJobFamilies(jf);
        setVendors(vs);
      } catch {
        /* silent — select will fall back to current value */
      }
    })();
  }, [open]);

  useEffect(() => {
    if (open) {
      setForm({
        nik: license?.nik ?? '',
        name: license?.name ?? '',
        organization: license?.organization ?? 'PT Integrasi Aviasi Solusi',
        licenseNumber: license?.licenseNumber ?? '',
        licenseName: license?.licenseName ?? '',
        instansi: license?.instansi ?? '',
        negara: license?.negara ?? '',
        jobFamily: license?.jobFamily ?? '',
        startDate: license?.startDate ?? '',
        endDate: license?.endDate ?? '',
      });
      setError(null);
      setSaving(false);
      setNikLookup(license?.name ? 'found' : 'idle');
    }
  }, [open, license]);

  useEffect(() => {
    if (!open) return;
    if (lookupTimer.current) clearTimeout(lookupTimer.current);
    const nik = form.nik.trim();
    if (!nik) {
      setNikLookup('idle');
      return;
    }
    setNikLookup('loading');
    lookupTimer.current = setTimeout(async () => {
      try {
        const name = await fetchEmployeeNameByNik(nik);
        if (name) {
          setForm((prev) => (prev.nik.trim() === nik ? { ...prev, name } : prev));
          setNikLookup('found');
        } else {
          setForm((prev) => (prev.nik.trim() === nik ? { ...prev, name: '' } : prev));
          setNikLookup('not-found');
        }
      } catch {
        setNikLookup('idle');
      }
    }, 350);
    return () => {
      if (lookupTimer.current) clearTimeout(lookupTimer.current);
    };
  }, [form.nik, open]);

  const update = (patch: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...patch }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nik.trim() || !form.licenseName.trim()) {
      setError('NIK dan License Name wajib diisi.');
      return;
    }
    if (nikLookup === 'not-found') {
      setError('NIK tidak ditemukan di Master Employee. Tambahkan employee terlebih dahulu.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (isNew) {
        const created = await insertLicense(form, nextNo);
        onSaved?.(created);
      } else if (license) {
        await updateLicense(license, form);
        onSaved?.({ ...license, ...form });
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan data.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isNew ? 'Add License' : 'Edit License'}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="NIK"
            value={form.nik}
            onChange={(v) => update({ nik: v })}
            hint={
              nikLookup === 'loading'
                ? 'Mencari karyawan...'
                : nikLookup === 'not-found'
                ? 'NIK tidak ditemukan di Master Employee'
                : undefined
            }
            hintColor={nikLookup === 'not-found' ? 'rose' : 'gray'}
          />
          <Field label="Employee Name" value={form.name} onChange={() => undefined} readOnly />
          <Field label="Organization" value={form.organization} onChange={(v) => update({ organization: v })} />
          <Field label="Nomor License" value={form.licenseNumber} onChange={(v) => update({ licenseNumber: v })} />
          <Field label="License Name" value={form.licenseName} onChange={(v) => update({ licenseName: v })} />
          <Select
            label="Instansi"
            value={form.instansi}
            onChange={(v) => update({ instansi: v })}
            options={buildVendorOptions(form.instansi, vendors)}
            placeholder="-Select Instansi-"
          />
          <Field label="Negara" value={form.negara} onChange={(v) => update({ negara: v })} />
          <Select
            label="Job Family"
            value={form.jobFamily}
            onChange={(v) => update({ jobFamily: v })}
            options={buildJobFamilyOptions(form.jobFamily, jobFamilies)}
            placeholder="-Select Job Family-"
          />
          <Field label="Start Date" type="date" value={form.startDate} onChange={(v) => update({ startDate: v })} />
          <Field label="End Date" type="date" value={form.endDate} onChange={(v) => update({ endDate: v })} />
          {error && (
            <p className="md:col-span-2 text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded px-3 py-2">
              {error}
            </p>
          )}
        </div>
        <div className="flex justify-end gap-2 px-6 py-3 border-t border-gray-100 bg-gray-50 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-xs font-medium text-white bg-teal-500 rounded-md hover:bg-teal-600 disabled:opacity-60"
          >
            {saving ? 'Saving…' : isNew ? 'Create License' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  readOnly = false,
  hint,
  hintColor = 'gray',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  readOnly?: boolean;
  hint?: string;
  hintColor?: 'gray' | 'rose';
}) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="text-gray-600">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        className={`border border-gray-200 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-teal-400 ${
          readOnly ? 'bg-gray-50 text-gray-700 cursor-not-allowed' : ''
        }`}
      />
      {hint && (
        <span className={hintColor === 'rose' ? 'text-rose-500' : 'text-gray-400'}>{hint}</span>
      )}
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="text-gray-600">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-200 rounded-md px-3 py-2 text-xs bg-white focus:outline-none focus:border-teal-400"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function buildJobFamilyOptions(current: string, list: JobFamily[]): string[] {
  const names = list.map((j) => j.name).filter((n) => n.trim() !== '');
  if (current && !names.includes(current)) return [current, ...names];
  return names;
}

function buildVendorOptions(current: string, list: Vendor[]): string[] {
  const names = list.map((v) => v.name).filter((n) => n.trim() !== '');
  if (current && !names.includes(current)) return [current, ...names];
  return names;
}


